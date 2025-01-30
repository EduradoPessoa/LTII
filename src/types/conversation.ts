export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  originalContent?: string; // Conteúdo original antes da tradução
  timestamp: number;
  audioUrl?: string;
}

export interface ConversationSettings {
  language: Language;
  topic: Topic;
  prompt: string;
  autoTranslate: boolean; // Nova configuração
}
