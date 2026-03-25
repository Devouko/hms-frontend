import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Mic, X, Minimize2, Maximize2, Sparkles, Brain, Stethoscope } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

interface AIAssistantProps {
  currentPage?: string;
  userRole?: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function AIAssistant({ currentPage = 'dashboard', userRole = 'admin', isOpen, onToggle }: AIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const medicalKnowledge = {
    symptoms: {
      'chest pain': 'Consider cardiac evaluation, ECG, troponin levels, emergency assessment',
      'shortness of breath': 'Check oxygen saturation, chest X-ray, pulmonary function',
      'fever': 'Order blood culture, CBC, vital signs monitoring',
      'headache': 'Neurological exam, blood pressure check, CT scan if severe',
      'abdominal pain': 'Physical exam, ultrasound, blood work, urinalysis'
    },
    procedures: {
      'ECG': 'Electrocardiogram for heart rhythm assessment',
      'CBC': 'Complete blood count for infection/anemia screening',
      'CT scan': 'Detailed imaging for internal structures',
      'ultrasound': 'Non-invasive imaging using sound waves'
    }
  };

  const contextualHelp = {
    dashboard: 'I can help with hospital overview, patient census, alerts, and quick actions.',
    patients: 'I can assist with patient registration, medical history, and record management.',
    emergency: 'I provide emergency protocols, triage guidelines, and critical care support.',
    pharmacy: 'I help with medication management, drug interactions, and prescription verification.',
    appointments: 'I can help schedule, reschedule, and manage patient appointments.',
    billing: 'I assist with invoice generation, payment processing, and insurance verification.'
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: AIMessage = {
        id: '1',
        role: 'assistant',
        content: `Hello! I'm your AI medical assistant. ${contextualHelp[currentPage as keyof typeof contextualHelp] || 'I\'m here to help with hospital operations.'} How can I assist you today?`,
        timestamp: new Date().toISOString(),
        suggestions: getQuickActions()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, currentPage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getQuickActions = () => {
    const actions = {
      dashboard: ['View patient census', 'Check bed availability', 'Review alerts'],
      patients: ['Add new patient', 'Search records', 'Update medical history'],
      emergency: ['Triage protocols', 'Emergency procedures', 'Contact specialists'],
      pharmacy: ['Check drug interactions', 'Verify prescriptions', 'Monitor inventory'],
      appointments: ['Schedule appointment', 'View today\'s schedule', 'Send reminders'],
      billing: ['Generate invoice', 'Process payment', 'Check insurance']
    };
    return actions[currentPage as keyof typeof actions] || actions.dashboard;
  };

  const generateResponse = async (userMessage: string): Promise<AIMessage> => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { 
              role: 'system', 
              content: `You are SmartCare AI Assistant for ${currentPage} page. User role: ${userRole}. Provide helpful, accurate medical and hospital management guidance.` 
            },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) throw new Error('API Error');
      
      const data = await response.json();
      const content = data.choices[0]?.message?.content || 'I apologize, but I could not process your request.';
      
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content,
        timestamp: new Date().toISOString(),
        suggestions: getQuickActions()
      };
    } catch (error) {
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'AI service temporarily unavailable. Please try again later.',
        timestamp: new Date().toISOString()
      };
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(async () => {
      const aiResponse = await generateResponse(input);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed bottom-20 right-4 z-50 max-w-[calc(100vw-2rem)]"
    >
      <Card className={`bg-card shadow-2xl border-2 border-[#38bdf8] transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96'
      }`} style={{ height: isMinimized ? '64px' : '500px', maxHeight: '80vh' }}>
        <CardHeader className="p-4 bg-gradient-to-r from-[#38bdf8] to-[#0ea5e9] text-card-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bot className="size-6" />
                <Sparkles className="size-3 absolute -top-1 -right-1 text-yellow-300" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Medical Assistant</CardTitle>
                <p className="text-xs opacity-90">Powered by Medical AI</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-card-foreground hover:bg-card/20 p-1"
              >
                {isMinimized ? <Maximize2 className="size-4" /> : <Minimize2 className="size-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onToggle}
                className="text-card-foreground hover:bg-card/20 p-1"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col" style={{ height: '420px' }}>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-[#38bdf8] text-card-foreground' 
                        : 'bg-muted text-gray-900'
                    }`}>
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="size-4 text-[#38bdf8]" />
                          <span className="text-xs font-medium text-[#38bdf8]">AI Assistant</span>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      {message.suggestions && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {message.suggestions.map((suggestion, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="cursor-pointer hover:bg-[#38bdf8] hover:text-card-foreground text-xs"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="size-4 text-[#38bdf8] animate-pulse" />
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-[#38bdf8] rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-[#38bdf8] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-[#38bdf8] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about symptoms, procedures, or hospital operations..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="bg-[#38bdf8] hover:bg-[#0ea5e9]"
                >
                  <Send className="size-4" />
                </Button>
              </div>
              <div className="flex items-center justify-center mt-2">
                <Badge variant="outline" className="text-xs">
                  <Brain className="size-3 mr-1" />
                  Medical AI • Context: {currentPage}
                </Badge>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}

