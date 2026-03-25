'use client';

import { useState } from 'react';
import { Sparkles, Loader2, RefreshCw, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useAIInsights } from '../hooks/useAIInsights';

interface AIInsightPanelProps {
  title?: string;
  prompt: string;
  systemPrompt?: string;
  autoLoad?: boolean;
  compact?: boolean;
  className?: string;
}

export function AIInsightPanel({
  title = 'AI Insights',
  prompt,
  systemPrompt,
  autoLoad = false,
  compact = false,
  className = '',
}: AIInsightPanelProps) {
  const { getInsight, loading, error } = useAIInsights();
  const [insight, setInsight] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  const load = async () => {
    const result = await getInsight(prompt, { systemPrompt });
    setInsight(result);
    setHasLoaded(true);
  };

  // Auto-load on first render if requested
  if (autoLoad && !hasLoaded && !loading) {
    load();
  }

  if (compact && !insight && !loading) {
    return (
      <Button variant="outline" size="sm" onClick={load} className="gap-2 text-xs">
        <Sparkles className="size-3 text-primary" />
        Get AI Insights
      </Button>
    );
  }

  return (
    <Card className={`border-primary/20 bg-primary/5 ${className}`}>
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            {title}
          </CardTitle>
          <div className="flex gap-1">
            {insight && (
              <Button variant="ghost" size="icon" className="size-6" onClick={load} title="Refresh">
                <RefreshCw className="size-3" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="size-6" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="px-4 pb-3">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Analyzing data...
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertTriangle className="size-4" />
              {error}
            </div>
          )}

          {!loading && !insight && !error && (
            <Button size="sm" onClick={load} className="gap-2 text-xs">
              <Sparkles className="size-3" />
              Generate Insights
            </Button>
          )}

          {insight && (
            <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {insight}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
