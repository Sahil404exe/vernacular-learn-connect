import { useState } from "react";
import { Volume2, Copy, Check } from "lucide-react";

interface OutputSectionProps {
  output: string;
  isLoading: boolean;
}

/**
 * OutputSection — displays the translated lesson in a large, readable font.
 * Includes a non-functional Listen button (icon only) as a placeholder for
 * future text-to-speech, plus a small Copy button for teachers who want to
 * save the result.
 */
export function OutputSection({ output, isLoading }: OutputSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-lg font-semibold text-foreground">
          Translated lesson
        </label>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!output}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
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
            className="inline-flex items-center justify-center rounded-full bg-secondary p-3 text-secondary-foreground transition-colors hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Listen to translation"
            title="Listen (coming soon)"
          >
            <Volume2 className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div id="translation-output" className="min-h-[160px] rounded-xl border border-input bg-card p-4">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center gap-3 text-muted-foreground">
            <span className="h-6 w-6 animate-spin rounded-full border-4 border-muted border-t-primary" />
            <span className="text-lg font-medium">Translating...</span>
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
