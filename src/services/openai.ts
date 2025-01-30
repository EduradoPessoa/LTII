import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('OpenAI API Key é necessária.');
}

export const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // Nota: Em produção, é melhor fazer as chamadas através de um backend
});
