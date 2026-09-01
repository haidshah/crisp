import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  X, 
  Clock, 
  CheckCircle2, 
  RotateCcw,
  Zap,
  Layers,
  Calendar,
  DollarSign
} from 'lucide-react';
import { chatWithAssistantAI } from '../services/geminiService';
import { Job, Customer, Cleaner, Invoice, Lead } from '../types';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: Job[];
  customers: Customer[];
  cleaners: Cleaner[];
  invoices: Invoice[];
  leads: Lead[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  jobs,
  customers,
  cleaners,
  invoices,
  leads
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your Crisp Cleaners AI Operations Copilot. You can ask me anything about your current schedule, cleaner routes, customer preferences, outstanding invoices, or ask me to draft client emails.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    "What jobs are scheduled for today?",
    "Show cleaners and their current ratings",
    "How much unpaid revenue is pending?",
    "Which leads have the highest AI score?"
  ];

  const handleSend = async (userPrompt?: string) => {
    const query = userPrompt || input;
    if (!query.trim() || isLoading) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = { role: 'user', content: query, timestamp: timeNow };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history format for backend
      const history = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const response = await chatWithAssistantAI(query, history, {
        jobs,
        customers,
        cleaners,
        invoices,
        leads
      });

      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `Sorry, I encountered an issue querying the CRM database: ${err.message || 'Unknown error'}. Please verify your connection.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex justify-end">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between border-l border-slate-200">
        {/* Header */}
        <div className="p-4 bg-linear-to-r from-teal-900 to-cyan-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600/60 border border-teal-400/40 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm font-sans flex items-center gap-1.5">
                Crisp AI Copilot
                <span className="px-1.5 py-0.2 bg-teal-400/20 text-teal-200 text-[10px] rounded-md font-mono">
                  Gemini 2.5 Flash
                </span>
              </h3>
              <p className="text-[11px] text-teal-100/80">CRM Context & Operations Assistant</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-teal-200 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3.5 bg-slate-50/50 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-xl bg-teal-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-teal-600 text-white rounded-tr-xs shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs shadow-2xs'
                }`}
              >
                <p className="whitespace-pre-line font-sans">{m.content}</p>
                <span
                  className={`text-[9px] block mt-1 text-right ${
                    m.role === 'user' ? 'text-teal-200' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </span>
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center text-white shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 p-2 text-xs">
              <Sparkles className="w-4 h-4 animate-spin text-teal-600" />
              <span>Crisp AI is thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggested Queries */}
        <div className="p-2.5 bg-white border-t border-slate-200 space-y-1.5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 rounded-lg border border-slate-200 shrink-0 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 pt-1"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about jobs, routes, client notes, invoices..."
              disabled={isLoading}
              className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-teal-500 outline-hidden"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
