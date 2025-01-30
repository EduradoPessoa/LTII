import { useState, useCallback, useRef } from 'react';

interface UseSpeechRecognitionProps {
  language: string;
  onResult: (transcript: string) => void;
}

export function useSpeechRecognition({ language, onResult }: UseSpeechRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Seu navegador não suporta reconhecimento de voz.');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

      onResult(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Erro no reconhecimento de voz:', event.error);
      stopListening();
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }, [language, onResult]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  return {
    isListening,
    startListening,
    stopListening
  };
}

// Adiciona o tipo para o webkitSpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}
