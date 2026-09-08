import { useRef, useState } from "react";
import { Upload, Loader2, FileText } from "lucide-react";

import { extractFileText } from "@/lib/extract-file-text";

interface InputSectionProps {
  value: string;
  onChange: (text: string) => void;
  maxLength?: number;
}

/**
 * InputSection — large, high-contrast text area where teachers paste or type
 * lesson content. A file upload button lets them load a .txt or .pdf lesson
 * instead of typing; the extracted text fills the same box.
 */
export function InputSection({
  value,
  onChange,
  maxLength = 5000,
}: InputSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setIsReading(true);
    setFileError(null);
    try {
      const text = await extractFileText(file);
      onChange(text.slice(0, maxLength));
      setFileName(file.name);
    } catch (error) {
      setFileName(null);
      setFileError(
        error instanceof Error ? error.message : "We couldn't read that file.",
      );
    } finally {
      setIsReading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label
          htmlFor="lesson-input"
          className="text-lg font-semibold text-foreground"
        >
          Lesson text
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.pdf,text/plain,application/pdf"
          className="sr-only"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isReading}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-all hover:bg-accent hover:text-accent-foreground active:scale-95 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {isReading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Upload className="h-4 w-4" aria-hidden="true" />
          )}
          {isReading ? "Reading file..." : "Upload .txt or .pdf"}
        </button>
      </div>

      <textarea
        id="lesson-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={maxLength}
        placeholder="Paste or type your lesson here in English or Hindi..."
        rows={6}
        className="w-full resize-none rounded-xl border border-input bg-card p-4 text-lg leading-relaxed text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <div className="flex items-center justify-between gap-3">
        {fileName ? (
          <p className="inline-flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
            <FileText className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{fileName}</span>
          </p>
        ) : (
          <span />
        )}
        <p className="shrink-0 text-sm text-muted-foreground">
          {value.length}/{maxLength} characters
        </p>
      </div>

      {fileError && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive"
        >
          {fileError}
        </p>
      )}
    </div>
  );
}
