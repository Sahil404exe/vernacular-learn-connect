import { useState } from "react";
import { Volume2, Copy, Check, Loader2, AlertCircle } from "lucide-react";

interface OutputSectionProps {
  output: string;
  isLoading: boolean;
  error?: string | null;
}

/**
 * OutputSection — displays the translated lesson in a large, readable font,
 * a spinner while translating, and a clear message if translation fails.
 * The Listen button is an icon-only placeholder for future text-to-speech.
 */
export function OutputSection({ output, isLoading, error }: OutputSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-lg font-semibold text-foreground">
          Translated lesson
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!output}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground active:scale-95 disabled:opacity-50"
          >
            {copied ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4" aria-hidden="true" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>

          {/* Icon-only placeholder for future text-to-speech */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-secondary p-3 text-secondary-foreground transition-all hover:bg-secondary/80 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Listen to translation"
            title="Listen (coming soon)"
          >
            <Volume2 className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        id="translation-output"
        aria-live="polite"
        className="min-h-[200px] rounded-xl border border-input bg-card p-4 shadow-sm"
      >
        {isLoading ? (
          <div className="flex h-40 flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
            <span className="text-lg font-medium">Translating...</span>
          </div>
        ) : error ? (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-destructive"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <p className="text-base font-medium">{error}</p>
          </div>
        ) : output ? (
          <p className="whitespace-pre-wrap text-2xl leading-relaxed text-foreground">
            {output}
          </p>
        ) : (
          <p className="text-lg text-muted-foreground">
            Your translated text will appear here.
          </p>
        )}
      </div>
    </div>
  );
}
