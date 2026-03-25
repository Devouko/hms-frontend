'use client';

import { useState } from 'react';
import { Brain, Loader2, Sparkles, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useAIInsights } from '../hooks/useAIInsights';
import { toast } from 'sonner';

interface AIDiagnosisHelperProps {
  symptoms?: string;
  diagnosis?: string;
  onSuggestion?: (field: string, value: string) => void;
}

export function AIDiagnosisHelper({ symptoms, diagnosis, onSuggestion }: AIDiagnosisHelperProps) {
  const { getInsight, loading } = useAIInsights();
  const [result, setResult] = useState<string | null>(null);
  const [mode, setMode] = useState<'diagnosis' | 'treatment' | 'summary'>('diagnosis');
  const [copied, setCopied] = useState(false);

  const prompts = {
    diagnosis: `Based on these symptoms: "${symptoms || 'not provided'}", suggest possible diagnoses with brief reasoning. List top 3 most likely conditions.`,
    treatment: `For diagnosis "${diagnosis || 'not provided'}", suggest evidence-based treatment options, medications, and follow-up care. Be concise.`,
    summary: `Create a brief clinical summary for: Symptoms: ${symptoms || 'N/A'}, Diagnosis: ${diagnosis || 'N/A'}. Format as a professional clinical note.`,
  };

  const systemPrompt = 'You are a clinical decision support AI for a hospital. Provide evidence-based suggestions. Always note that final clinical decisions must be made by licensed physicians.';

  const run = async () => {
    const res = await getInsight(prompts[mode], { systemPrompt, maxTokens: 600 });
    setResult(res);
  };

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const applyToForm = () => {
    if (!result || !onSuggestion) return;
    if (mode === 'diagnosis') onSuggestion('diagnosis', result.split('\n')[0].replace(/^[0-9.*\s]+/, '').trim());
    if (mode === 'treatment') onSuggestion('treatment', result);
    if (mode === 'summary') onSuggestion('notes', result);
    toast.success('Applied to form');
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-sm flex items-center gap-2">
          <Brain className="size-4 text-primary" />
          AI Clinical Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-3 space-y-3">
        <div className="flex gap-1">
          {(['diagnosis', 'treatment', 'summary'] as const).map(m => (
            <Button
              key={m}
              size="sm"
              variant={mode === m ? 'default' : 'outline'}
              className="text-xs h-7 px-2 capitalize"
              onClick={() => { setMode(m); setResult(null); }}
            >
              {m}
            </Button>
          ))}
        </div>

        <Button size="sm" onClick={run} disabled={loading} className="gap-2 text-xs w-full">
          {loading ? <Loader2 className="size-3 animate-spin" /> : <Sparkles className="size-3" />}
          {mode === 'diagnosis' ? 'Suggest Diagnoses' : mode === 'treatment' ? 'Suggest Treatment' : 'Generate Summary'}
        </Button>

        {result && (
          <div className="space-y-2">
            <div className="text-xs text-foreground whitespace-pre-wrap leading-relaxed bg-background rounded p-2 border max-h-48 overflow-y-auto">
              {result}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs h-7 gap-1" onClick={copy}>
                {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                Copy
              </Button>
              {onSuggestion && (
                <Button size="sm" className="text-xs h-7 gap-1" onClick={applyToForm}>
                  Apply to Form
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
