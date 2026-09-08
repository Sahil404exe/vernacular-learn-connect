import { Languages, ChevronDown } from "lucide-react";

/**
 * Supported target languages for the Jharkhand primary-school context.
 * English and Hindi are also listed so teachers can convert back-and-forth.
 */
export const LANGUAGES = [
  { code: "sat", label: "Santhali" },
  { code: "ho", label: "Ho" },
  { code: "mun", label: "Mundari" },
  { code: "kru", label: "Kurukh" },
  { code: "hi", label: "Hindi" },
  { code: "en", label: "English" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

interface LanguageSelectorProps {
  value: LanguageCode;
  onChange: (code: LanguageCode) => void;
}

/**
 * LanguageSelector — a large, mobile-friendly native <select> for choosing
 * the target language. Native controls are easier to use on low-end phones
 * and work well with screen readers.
 */
export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="target-language"
        className="text-lg font-semibold text-foreground"
      >
        Translate into
      </label>

      <div className="relative">
        <Languages
          className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />

        <select
          id="target-language"
          value={value}
          onChange={(event) => onChange(event.target.value as LanguageCode)}
          className="w-full appearance-none rounded-xl border border-input bg-card py-3 pl-10 pr-10 text-lg text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {LANGUAGES.map((language) => (
            <option key={language.code} value={language.code}>
              {language.label}
            </option>
          ))}
        </select>

        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
