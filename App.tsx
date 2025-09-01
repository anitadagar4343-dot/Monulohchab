import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ParameterSlider from './components/ParameterSlider';
import CodeExporter from './components/CodeExporter';
import { AppMode, type ModelParams, type HistoryItem, type ChatMessage } from './types';
import { DEFAULT_PARAMS, EXAMPLE_PROMPTS } from './constants';
import { generateText, generateImage, generateVideo, createChatSession, streamChatMessage } from './services/geminiService';
import type { Chat } from '@google/genai';

const LoadingSpinner = ({ message }: { message?: string | null }) => (
    <div className="flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-studio-accent"></div>
        {message && <p className="text-studio-text-secondary text-center">{message}</p>}
    </div>
);

// FreeformView Component
const FreeformView: React.FC<{
    prompt: string,
    setPrompt: (p: string) => void,
    output: ReactNode,
    isLoading: boolean,
    error: string | null,
    handleRun: () => void,
    mode: AppMode,
    loadingMessage: string | null,
}> = ({ prompt, setPrompt, output, isLoading, error, handleRun, mode, loadingMessage }) => {
    const placeholder =
        mode === AppMode.Image ? "Enter a prompt to generate an image..." :
        mode === AppMode.Video ? "Enter a prompt to generate a video..." :
        "Enter a prompt here...";
        
    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow p-6 flex flex-col gap-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={placeholder}
                    className="w-full h-48 p-4 bg-studio-surface rounded-lg border border-studio-border focus:ring-2 focus:ring-studio-accent focus:outline-none resize-none"
                />
                 <div className="flex items-center justify-between">
                    <div>
                        <span className="text-sm font-medium mr-2">Try an example:</span>
                        {EXAMPLE_PROMPTS[mode].map(ex => (
                            <button key={ex.title} onClick={() => setPrompt(ex.prompt)} className="text-sm bg-studio-surface hover:bg-studio-border text-studio-text-secondary px-3 py-1 rounded-full mr-2 transition-colors">{ex.title}</button>
                        ))}
                    </div>
                    <button
                        onClick={handleRun}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 px-6 py-2 bg-studio-accent hover:bg-studio-accent-dark text-white font-semibold rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                        style={{ minWidth: '120px' }}
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Running...</span>
                            </>
                        ) : (
                            'Run'
                        )}
                    </button>
                </div>
            </div>
            <div className="flex-grow p-6 bg-studio-panel border-t border-studio-border overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Output</h3>
                {isLoading ? (
                    <div className="flex justify-center items-center h-full"><LoadingSpinner message={loadingMessage} /></div>
                ) : error ? (
                    <div className="text-red-400 bg-red-900/50 p-4 rounded-md">{error}</div>
                ) : (
                    <div className="prose prose-invert max-w-none text-studio-text whitespace-pre-wrap">{output}</div>
                )}
            </div>
        </div>
    );
};


// ChatView Component
const ChatView: React.FC<{
    addHistoryItem: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
}> = ({ addHistoryItem }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatRef.current = createChatSession();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !chatRef.current) return;
        const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);
        
        const modelResponseParts: string[] = [];
        setMessages(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);

        try {
            await streamChatMessage(chatRef.current, input, (chunk) => {
                modelResponseParts.push(chunk);
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages[newMessages.length - 1];
                    if (lastMessage.role === 'model') {
                        lastMessage.parts[0].text = modelResponseParts.join('');
                    }
                    return newMessages;
                });
            });
            const fullResponse = modelResponseParts.join('');
            addHistoryItem({ mode: AppMode.Chat, prompt: input, output: fullResponse });
        } catch (e) {
            let friendlyErrorMessage = 'An error occurred while sending your message.';
            if (e instanceof Error) {
                if (e.message.includes('RESOURCE_EXHAUSTED') || e.message.includes('429')) {
                    friendlyErrorMessage = 'Too many requests. Please wait a moment and try again.';
                } else if (e.message.includes('API_KEY')) {
                    friendlyErrorMessage = 'The API key is invalid or missing. Please check your configuration.';
                } else {
                    friendlyErrorMessage = e.message;
                }
            }
            setError(friendlyErrorMessage);
            setMessages(prev => prev.slice(0, -1)); // Remove the empty model message
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full p-4">
            <div className="flex-grow overflow-y-auto mb-4 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-studio-accent-dark text-white' : 'bg-studio-surface text-studio-text'}`}>
                            <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
             {error && <div className="text-red-400 bg-red-900/50 p-2 rounded-md mb-2">{error}</div>}
            <div className="flex-shrink-0 flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                    placeholder="Enter a message..."
                    className="w-full p-3 bg-studio-surface rounded-lg border border-studio-border focus:ring-2 focus:ring-studio-accent focus:outline-none"
                    disabled={isLoading}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading}
                    className="flex items-center justify-center px-6 py-3 bg-studio-accent hover:bg-studio-accent-dark text-white font-semibold rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
                    style={{ minWidth: '96px' }}
                >
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                        'Send'
                    )}
                </button>
            </div>
        </div>
    );
};

// Main App Component
const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.Freeform);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState<ReactNode>('');
  const [params, setParams] = useState<ModelParams>(DEFAULT_PARAMS);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addHistoryItem = useCallback((item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
    };
    setHistory(prev => [newItem, ...prev]);
  }, []);

  const handleRun = useCallback(async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setOutput('');
    setLoadingMessage(null);

    try {
      let result: ReactNode = '';
      if (mode === AppMode.Freeform) {
        const response = await generateText(prompt, params);
        result = response.text;
      } else if (mode === AppMode.Image) {
        const imageUrls = await generateImage(prompt);
        result = (
            <div className="grid grid-cols-1 gap-4">
                {imageUrls.map((url, index) => <img key={index} src={url} alt={`Generated for: ${prompt}`} className="rounded-lg" />)}
            </div>
        );
      } else if (mode === AppMode.Video) {
        const videoUrl = await generateVideo(prompt, (message) => {
            setLoadingMessage(message);
        });
        result = (
            <div>
                <video src={videoUrl} controls autoPlay loop className="rounded-lg w-full" />
            </div>
        );
      }
      setOutput(result);
      addHistoryItem({ mode, prompt, output: result });
    } catch (e) {
      let friendlyErrorMessage = 'An error occurred while processing your request.';
      if (e instanceof Error) {
          if (e.message.includes('RESOURCE_EXHAUSTED') || e.message.includes('429')) {
              friendlyErrorMessage = 'Too many requests. Please wait a moment and try again.';
          } else if (e.message.includes('API_KEY')) {
              friendlyErrorMessage = 'The API key is invalid or missing. Please check your configuration.';
          } else {
              friendlyErrorMessage = e.message;
          }
      }
      setError(friendlyErrorMessage);
    } finally {
      setIsLoading(false);
      setLoadingMessage(null);
    }
  }, [prompt, mode, params, addHistoryItem]);
  
  const handleSelectHistory = (item: HistoryItem) => {
    setMode(item.mode);
    setPrompt(item.prompt);
    setOutput(item.output);
  }

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    setPrompt('');
    setOutput('');
    setError(null);
  };
  
  const renderCurrentView = () => {
    const viewProps = { prompt, setPrompt, output, isLoading, error, handleRun, mode, loadingMessage };
    switch (mode) {
        case AppMode.Freeform:
        case AppMode.Image:
        case AppMode.Video:
            return <FreeformView {...viewProps} />;
        case AppMode.Chat:
            return <ChatView addHistoryItem={addHistoryItem} />;
        default:
            return null;
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col font-sans">
      <Header currentMode={mode} onModeChange={handleModeChange} />
      <div className="flex-grow flex overflow-hidden">
        <Sidebar history={history} onSelectHistory={handleSelectHistory} />
        <main className="flex-grow flex flex-col bg-studio-bg overflow-hidden">
            {renderCurrentView()}
        </main>
        <aside className="w-80 bg-studio-panel p-4 border-l border-studio-border overflow-y-auto">
            {mode === AppMode.Freeform && (
              <>
                <h3 className="text-lg font-semibold mb-4 text-studio-text">Parameters</h3>
                <ParameterSlider label="Temperature" value={params.temperature} min={0} max={1} step={0.1} onChange={v => setParams(p => ({ ...p, temperature: v }))} description="Controls randomness. Lower is more predictable." />
                <ParameterSlider label="Top-K" value={params.topK} min={1} max={100} step={1} onChange={v => setParams(p => ({ ...p, topK: v }))} description="Limits the sampling to the K most likely tokens." />
                <ParameterSlider label="Top-P" value={params.topP} min={0} max={1} step={0.05} onChange={v => setParams(p => ({ ...p, topP: v }))} description="Samples from tokens with a cumulative probability of P." />
              </>
            )}
             <CodeExporter prompt={prompt} params={params} mode={mode} />
        </aside>
      </div>
    </div>
  );
};

export default App;
