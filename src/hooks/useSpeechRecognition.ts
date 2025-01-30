import { useState, useCallback } from 'react';

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Seu navegador não suporta reconhecimento de voz.');
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pt-BR';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      setTranscript(transcript);
    };

    recognition.onerror = (event: Event) => {
      console.error('Erro no reconhecimento de voz:', event);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, []);

  const stopListening = useCallback(() => {
    setIsListening(false);
    window.speechSynthesis?.cancel();
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
  };
}

// Adiciona o tipo para o webkitSpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    speechSynthesis: any;
  }
}
