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
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ConversationSettings {
  language: Language;
  topic: Topic;
  prompt: string;
  autoTranslate: boolean; // Nova configuração
}
