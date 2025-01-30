import OpenAI from 'openai';
import { Message, ConversationSettings } from '../types/conversation';
import { OPENAI_API_KEY } from '../config';
import { updateMetrics } from './metrics';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a translator. Translate the following text to ${targetLanguage}. Only return the translation, nothing else.`
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    // Atualiza métricas
    const tokens = response.usage?.total_tokens || 0;
    updateMetrics(tokens);

    return response.choices[0].message.content || text;
  } catch (error) {
    console.error('Error translating text:', error);
    return text;
  }
}

export async function generateResponse(messages: Message[], settings: ConversationSettings): Promise<string> {
  try {
    const systemPrompt = `You are a language learning assistant for ${settings.language.name}. ${settings.prompt}
    ${!settings.autoTranslate ? 'Since the user is practicing directly in the target language, correct any language mistakes they make in a gentle way.' : ''}
    Keep responses concise and natural.`;

    const formattedMessages = messages.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content
    }));

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        ...formattedMessages
      ]
    });

    // Atualiza métricas
    const tokens = response.usage?.total_tokens || 0;
    updateMetrics(tokens, messages.length === 0); // Nova conversa se não houver mensagens anteriores

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

export async function generateSpeech(text: string, language: string): Promise<string> {
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });

    // Atualiza métricas (estimativa de tokens para TTS)
    const estimatedTokens = Math.ceil(text.length / 4);
    updateMetrics(estimatedTokens);

    const blob = new Blob([await mp3.arrayBuffer()], { type: 'audio/mpeg' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error generating speech:', error);
    throw error;
  }
}
