import { useState, useRef, useCallback, useEffect } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaLanguage, FaBan } from 'react-icons/fa';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { generateResponse, generateSpeech, translateText } from '../services/conversation';
import { Language, Topic, Message, ConversationSettings } from '../types/conversation';

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
];

const topics: Topic[] = [
  { id: '1', name: 'Daily Routine', description: 'Discuss daily activities and habits' },
  { id: '2', name: 'Travel', description: 'Talk about travel experiences and plans' },
  { id: '3', name: 'Food', description: 'Discuss favorite foods and cooking' },
];

const promptExamples = [
  {
    id: 'friend',
    name: 'Amigo de Estudos',
    description: 'Um amigo de estudos que você encontra casualmente na rua depois de muito tempo',
    prompt: 'Create a fictitious persona for this conversation, imagine that it is a friend who I study with and we haven\'t seen each other for a while and we meet casually on the street'
  },
  {
    id: 'teacher',
    name: 'Professor',
    description: 'Um professor paciente que ajuda a corrigir erros de forma gentil',
    prompt: 'Act as a patient teacher who helps correct language mistakes in a gentle and encouraging way. Provide explanations for corrections when needed.'
  },
  {
    id: 'tourist',
    name: 'Turista Local',
    description: 'Um turista que conhece bem a região e compartilha dicas',
    prompt: 'Pretend to be a local tourist guide who knows the area well. Share interesting facts about local attractions, culture, and customs. Help with directions and recommendations.'
  },
  {
    id: 'custom',
    name: 'Personalizado',
    description: 'Defina seu próprio contexto de conversação',
    prompt: ''
  }
];

export default function Conversation() {
  const [settings, setSettings] = useState<ConversationSettings>({
    language: languages[0],
    topic: topics[0],
    prompt: promptExamples[0].prompt,
    autoTranslate: true,
  });

  const [selectedPromptId, setSelectedPromptId] = useState(promptExamples[0].id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [isUserTurn, setIsUserTurn] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onTranscriptResult = useCallback((transcript: string) => {
    setCurrentTranscript(transcript);
  }, []);

  const { isListening, startListening, stopListening } = useSpeechRecognition({
    language: settings.autoTranslate ? 'pt-BR' : settings.language.code,
    onResult: onTranscriptResult,
  });

  useEffect(() => {
    if (isListening) {
      stopListening();
      startListening();
    }
  }, [settings.autoTranslate, settings.language.code, isListening, startListening, stopListening]);

  const handleSubmitMessage = async () => {
    if (!currentTranscript.trim()) return;

    try {
      setIsProcessing(true);
      setIsUserTurn(false);

      let messageContent = currentTranscript;
      let originalContent: string | undefined;

      if (settings.autoTranslate) {
        originalContent = currentTranscript;
        messageContent = await translateText(currentTranscript, settings.language.name);
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: messageContent,
        originalContent,
        timestamp: Date.now(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setCurrentTranscript('');

      const response = await generateResponse(updatedMessages, settings);

      if (response) {
        const audioUrl = await generateSpeech(response, settings.language.code);

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: Date.now(),
          audioUrl,
        };

        setMessages([...updatedMessages, assistantMessage]);

        if (audioRef.current && audioUrl) {
          audioRef.current.src = audioUrl;
          audioRef.current.onended = () => {
            setIsUserTurn(true);
          };
          audioRef.current.play();
        }
      }
    } catch (error) {
      console.error('Error in handleSubmitMessage:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleListening = () => {
    if (!isUserTurn) return;

    if (isListening) {
      stopListening();
      handleSubmitMessage();
    } else {
      setCurrentTranscript('');
      startListening();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="space-y-4">
            {/* Title and Status */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Prática de Conversação</h1>
              <div className="flex space-x-2">
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ${
                  settings.autoTranslate ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {settings.autoTranslate ? 'Tradução Automática' : 'Prática Direta'}
                </span>
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ${
                  isUserTurn ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {isUserTurn ? 'SUA VEZ DE FALAR' : 'IA ESTÁ RESPONDENDO'}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 items-center">
              <select
                value={settings.language.code}
                onChange={(e) => {
                  const language = languages.find(l => l.code === e.target.value);
                  if (language) {
                    setSettings(prev => ({ ...prev, language }));
                  }
                }}
                className="block w-48 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} ({lang.nativeName})
                  </option>
                ))}
              </select>

              <select
                value={settings.topic.id}
                onChange={(e) => {
                  const topic = topics.find(t => t.id === e.target.value);
                  if (topic) {
                    setSettings(prev => ({ ...prev, topic }));
                  }
                }}
                className="block w-48 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>

              <button
                onClick={toggleListening}
                disabled={!isUserTurn || isProcessing}
                className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${
                  isListening
                    ? 'bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600'
                } ${(!isUserTurn || isProcessing) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isListening ? (
                  <FaMicrophoneSlash className="h-5 w-5 mr-2" />
                ) : (
                  <FaMicrophone className="h-5 w-5 mr-2" />
                )}
                {isListening ? 'Parar' : 'Falar'}
              </button>

              <button
                onClick={() => setSettings(prev => ({ ...prev, autoTranslate: !prev.autoTranslate }))}
                className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${
                  settings.autoTranslate
                    ? 'bg-green-600 text-white hover:bg-green-500 focus-visible:outline-green-600'
                    : 'bg-gray-600 text-white hover:bg-gray-500 focus-visible:outline-gray-600'
                }`}
              >
                {settings.autoTranslate ? (
                  <FaLanguage className="h-5 w-5 mr-2" />
                ) : (
                  <FaBan className="h-5 w-5 mr-2" />
                )}
                {settings.autoTranslate ? 'Tradução Ativa' : 'Tradução Inativa'}
              </button>
            </div>

            {/* Prompt Selection */}
            <div className="bg-white rounded-lg shadow p-4 mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900">Contexto da Conversação</span>
                <select
                  value={selectedPromptId}
                  onChange={(e) => {
                    const selected = promptExamples.find(p => p.id === e.target.value);
                    setSelectedPromptId(e.target.value);
                    if (selected) {
                      setSettings(prev => ({ 
                        ...prev, 
                        prompt: selected.id === 'custom' ? prev.prompt : selected.prompt 
                      }));
                    }
                  }}
                  className="block w-48 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  {promptExamples.map((example) => (
                    <option key={example.id} value={example.id}>
                      {example.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">
                {promptExamples.find(p => p.id === selectedPromptId)?.description}
              </p>

              <textarea
                value={settings.prompt}
                onChange={(e) => {
                  setSettings(prev => ({ ...prev, prompt: e.target.value }));
                  if (selectedPromptId !== 'custom') {
                    setSelectedPromptId('custom');
                  }
                }}
                placeholder="Descreva como você quer que seja a conversação..."
                rows={3}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>

            {isProcessing && (
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-indigo-200">
                  <div className="animate-pulse w-full bg-indigo-500"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-4">
          {/* Current Transcript */}
          {currentTranscript && (
            <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
              <p className="text-blue-800 italic">{currentTranscript}</p>
            </div>
          )}

          {/* Messages */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="min-h-[400px] max-h-[600px] overflow-y-auto p-4">
              <div className="space-y-4">
                {[...messages].reverse().map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === 'user' ? 'bg-indigo-100' : 'bg-gray-100'
                      }`}
                    >
                      <p className="text-gray-900">{message.content}</p>
                      {message.originalContent && (
                        <p className="text-sm text-gray-600 mt-1">
                          Mensagem original: {message.originalContent}
                        </p>
                      )}
                      {message.audioUrl && message.role === 'assistant' && (
                        <button
                          onClick={() => {
                            if (audioRef.current) {
                              audioRef.current.src = message.audioUrl!;
                              audioRef.current.play();
                            }
                          }}
                          className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <FaMicrophone className="h-4 w-4 mr-1" />
                          Ouvir novamente
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
