import { FaMicrophone, FaMicrophoneSlash, FaLanguage } from 'react-icons/fa';

function HelpSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="prose prose-indigo max-w-none">{children}</div>
    </div>
  );
}

export default function Help() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm rounded-lg">
            <div className="px-8 py-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Guia de Uso do LTII</h1>

              <HelpSection title="Visão Geral">
                <p>
                  O LTII (Language Training with Interactive Intelligence) é uma ferramenta de prática de conversação
                  que utiliza inteligência artificial para ajudar você a melhorar suas habilidades em diferentes idiomas.
                  Você pode praticar conversação através de fala ou texto, com tradução automática opcional.
                </p>
              </HelpSection>

              <HelpSection title="Como Iniciar uma Conversação">
                <ol className="list-decimal pl-6 space-y-4">
                  <li>
                    Acesse a página de Conversação através do menu lateral
                  </li>
                  <li>
                    Escolha o idioma que deseja praticar no seletor de idiomas
                  </li>
                  <li>
                    Selecione um tópico de conversação para guiar o diálogo
                  </li>
                  <li>
                    Escolha uma persona (Amigo de Estudos, Professor, etc.) para definir o estilo da conversa
                  </li>
                </ol>
              </HelpSection>

              <HelpSection title="Usando o Microfone">
                <div className="space-y-4">
                  <p>
                    O botão do microfone permite que você fale diretamente com o assistente. Aqui está como usar:
                  </p>
                  <div className="flex items-center space-x-4 my-4">
                    <div className="flex items-center space-x-2">
                      <FaMicrophone className="text-green-500 h-6 w-6" />
                      <span>Microfone ativo - clique para enviar</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaMicrophoneSlash className="text-red-500 h-6 w-6" />
                      <span>Microfone inativo - clique para falar</span>
                    </div>
                  </div>
                  <ol className="list-decimal pl-6">
                    <li>Clique no ícone do microfone para começar a gravar</li>
                    <li>Fale sua mensagem</li>
                    <li>Clique novamente para enviar a mensagem</li>
                    <li>Aguarde a resposta do assistente</li>
                  </ol>
                </div>
              </HelpSection>

              <HelpSection title="Tradução Automática">
                <div className="space-y-4">
                  <p>
                    A tradução automática permite que você fale em português e tenha sua mensagem traduzida
                    automaticamente para o idioma de prática.
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 flex items-center">
                      <FaLanguage className="h-5 w-5 mr-2 text-indigo-600" />
                      Como funciona:
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        <strong>Com tradução automática (recomendado para iniciantes):</strong>
                        <br />
                        Fale em português → O sistema traduz → O assistente responde no idioma escolhido
                      </li>
                      <li>
                        <strong>Sem tradução automática (para prática avançada):</strong>
                        <br />
                        Fale diretamente no idioma escolhido → O assistente responde no mesmo idioma
                      </li>
                    </ul>
                  </div>
                </div>
              </HelpSection>

              <HelpSection title="Dicas para uma Melhor Experiência">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Fale claramente e em um ambiente silencioso para melhor reconhecimento de voz</li>
                  <li>Comece com tópicos simples e vá aumentando a complexidade gradualmente</li>
                  <li>Use a tradução automática no início e tente desativá-la conforme progride</li>
                  <li>Experimente diferentes personas para variar o estilo de conversação</li>
                  <li>Preste atenção às correções e sugestões do assistente</li>
                </ul>
              </HelpSection>

              <HelpSection title="Monitorando seu Progresso">
                <p>
                  No Dashboard, você pode acompanhar:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Total de tokens utilizados</li>
                  <li>Número de conversas realizadas</li>
                  <li>Custos associados ao uso</li>
                  <li>Saldo disponível para continuar praticando</li>
                </ul>
              </HelpSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
