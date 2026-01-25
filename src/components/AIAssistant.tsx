import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIAssistantProps {
  session: any;
}

const GROQ_API_KEY = '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';

export function AIAssistant({ session }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userRole = session?.user?.user_metadata?.role || 'user';
  const userName = session?.user?.user_metadata?.name || 'User';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getSystemPrompt = () => {
    const basePrompt = `You are SmartCare AI Assistant, an intelligent healthcare management system assistant. You help users with the SmartCare Hospital Management System.

Current User: ${userName}
User Role: ${userRole}

System Features:
- Dashboard: Overview of hospital operations, statistics, and key metrics
- Front Office: Patient registration, visitor management, queue management
- Patients: Patient records, medical history, admission details
- Appointments: Schedule and manage patient appointments
- Payments: Billing, invoices, payment tracking
- Statistics: Analytics and reports
${userRole !== 'user' ? '- Employee Management: Staff records and scheduling' : ''}
${userRole !== 'user' ? '- User Management: System user accounts and permissions' : ''}
${userRole !== 'user' ? '- Doctor Management: Doctor profiles and schedules' : ''}
${userRole !== 'user' ? '- Pharmacy: Medication inventory and prescriptions' : ''}
${userRole !== 'user' ? '- Laboratory: Lab tests and results' : ''}
${userRole !== 'user' ? '- Nursing Station: Patient care and monitoring' : ''}

Role-Based Access:
`;

    if (userRole === 'super_admin') {
      return basePrompt + `As Super Admin, you have full system access. You can help with all features including system configuration, user management, and advanced analytics.`;
    } else if (userRole === 'admin') {
      return basePrompt + `As Admin, you have extended access. You can help with employee management, reports, and department operations but not system-level configurations.`;
    } else {
      return basePrompt + `As a User, you have access to basic features: Dashboard, Front Office, Patients, Appointments, Payments, and Statistics. I can help you with these features.`;
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const userMessage: Message = { role: 'user', content: input, timestamp };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: getSystemPrompt() },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: input },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0]?.message?.content || 'Sorry, I could not process your request.',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'AI service is temporarily unavailable. Please try again later.',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
        aria-label="Open AI Assistant"
      >
        <Bot className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[1000] transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-0 right-0 h-screen bg-card shadow-2xl z-[1001] flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } w-full sm:w-[400px] md:w-[400px] lg:w-[400px]`}
        role="dialog"
        aria-label="AI Assistant"
      >
        {/* Header */}
        <div className="h-[60px] bg-gradient-to-r from-primary to-primary/90 text-card-foreground flex items-center justify-between px-4 border-b border-border/10">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <h2 className="font-semibold text-lg">AI Assistant</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-card/10 rounded-lg transition-colors"
            aria-label="Close AI Assistant"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Welcome Message */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border-b border-border p-4">
          <p className="text-sm text-foreground">
            Hello <span className="font-semibold">{userName}</span>! I'm your SmartCare AI Assistant.
            {userRole === 'super_admin' && ' As Super Admin, I can help you with all system features.'}
            {userRole === 'admin' && ' As Admin, I can help you manage operations and reports.'}
            {userRole === 'doctor' && ' I can help you with patient records and medical workflows.'}
          </p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground mt-8">
              <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">How can I assist you today?</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-xl p-3 ${
                msg.role === 'user' 
                  ? 'bg-primary text-card-foreground ml-auto' 
                  : 'bg-muted text-foreground'
              }`}>
                <p className="text-sm break-words whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-xs mt-1 ${
                  msg.role === 'user' ? 'text-card-foreground/70' : 'text-muted-foreground'
                }`}>
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="h-auto border-t border-border p-3 bg-card">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask me anything..."
              disabled={loading}
              className="resize-none min-h-[44px] max-h-[120px]"
              rows={1}
            />
            <Button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              size="icon"
              className="h-[44px] w-[44px] shrink-0"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
              aria-label="Message input"
            />
            <Button 
              onClick={sendMessage} 
              disabled={loading || !input.trim()}
              size="icon"
              className="h-[44px] w-[44px] shrink-0"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
      `}</style>
    </>
  );
}
