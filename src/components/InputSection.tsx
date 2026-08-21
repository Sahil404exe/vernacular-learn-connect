interface InputSectionProps {
  value: string;
  onChange: (text: string) => void;
  maxLength?: number;
}

/**
 * InputSection — large, high-contrast text area where teachers paste or type
 * lesson content. Includes a visible character count so users know how much
 * they have entered.
 */
export function InputSection({
  value,
  onChange,
  maxLength = 1000,
}: InputSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="lesson-input"
        className="text-lg font-semibold text-foreground"
      >
        Lesson text
      </label>

      <textarea
        id="lesson-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        maxLength={maxLength}
        placeholder="Paste or type your lesson here in English or Hindi..."
        rows={5}
        className="w-full resize-none rounded-xl border border-input bg-card p-4 text-lg leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <p className="text-right text-sm text-muted-foreground">
        {value.length}/{maxLength} characters
      </p>
    </div>
  );
}
