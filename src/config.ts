export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export const config = {
  openai: {
    apiKey: OPENAI_API_KEY,
  },
  app: {
    name: 'LTII',
    description: 'Sistema de Gestão de Perfis e Assinaturas',
    version: '1.0.0',
  },
};
