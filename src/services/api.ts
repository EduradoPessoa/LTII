// Configuração da API baseada no ambiente
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface EmailData {
  to: string;
  name: string;
  password: string;
}

interface EmailResponse {
  message: string;
  previewUrl?: string;
}

export const sendWelcomeEmail = async (data: EmailData): Promise<EmailResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/email/welcome`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Erro ao enviar email');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Não foi possível conectar ao servidor. Verifique se o servidor está rodando na porta 3001.');
      }
      throw error;
    }
    throw new Error('Erro desconhecido ao enviar email');
  }
};
