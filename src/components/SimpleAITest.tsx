import { useState } from 'react';
import { Bot, Send, X } from 'lucide-react';

const GROQ_API_KEY = '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';

export function SimpleAITest() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const testAI = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: input }],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      
      const data = await res.json();
      setResponse(data.choices[0]?.message?.content || 'No response');
    } catch (error: any) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 bg-primary text-card-foreground p-3 rounded-full shadow-lg z-50"
      >
        <Bot className="size-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 w-96 bg-card rounded-lg shadow-2xl z-50 border">
      <div className="bg-primary text-card-foreground p-3 rounded-t-lg flex justify-between items-center">
        <span className="font-medium">AI Test</span>
        <button onClick={() => setOpen(false)}>
          <X className="size-4" />
        </button>
      </div>
      <div className="p-4 space-y-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && testAI()}
          placeholder="Type a message..."
          className="w-full px-3 py-2 border rounded"
          disabled={loading}
        />
        <button
          onClick={testAI}
          disabled={loading}
          className="w-full bg-primary text-card-foreground py-2 rounded flex items-center justify-center gap-2"
        >
          <Send className="size-4" />
          {loading ? 'Sending...' : 'Send'}
        </button>
        {response && (
          <div className="p-3 bg-muted/50 rounded text-sm">
            <strong>Response:</strong>
            <p className="mt-1">{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}

