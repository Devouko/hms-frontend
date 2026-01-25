import { cn } from "./utils";

interface GlassCardProps {
  className?: string;
  children: React.ReactNode;
}

export function GlassCard({ className, children }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-card/10 dark:bg-card/5 backdrop-blur-xl shadow-[0_8px_32px_rgba(31,38,135,0.15)] border border-border/20 dark:border-border/10 transition-all hover:bg-card/20 dark:hover:bg-card/10",
        className
      )}
    >
      {children}
    </div>
  );
}