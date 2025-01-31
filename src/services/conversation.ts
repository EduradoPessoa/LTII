import OpenAI from 'openai';
import { Message } from '../types/conversation';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function generateResponse(messages: Message[]): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      model: 'gpt-3.5-turbo',
    });

    return completion.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('Error generating response:', error);
    throw new Error('Failed to generate response');
  }
}
