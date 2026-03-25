'use client';

import { useState, useCallback } from 'react';

interface AIInsightOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export function useAIInsights() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInsight = useCallback(async (
    prompt: string,
    options: AIInsightOptions = {}
  ): Promise<string | null> => {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (!apiKey) {
      setError('AI service not configured. Add NEXT_PUBLIC_GROQ_API_KEY to your environment.');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: options.systemPrompt || 'You are SmartCare AI, a clinical and operational intelligence assistant for a hospital management system. Be concise, practical, and evidence-based. Format responses clearly.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: options.temperature ?? 0.4,
          max_tokens: options.maxTokens ?? 512,
        }),
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const data = await response.json();
      return data.choices?.[0]?.message?.content || null;
    } catch (err: any) {
      setError(err.message || 'AI request failed');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getInsight, loading, error };
}
