import type { LanguageCode } from "@/components/LanguageSelector";

/**
 * Mock translation service for the hackathon prototype.
 *
 * In production this should call a real translation API (e.g. Google Cloud
 * Translation). For now it simulates a network delay and returns:
 *   - a real-looking translation for the demo sample sentence in Hindi/English
 *   - a clear placeholder for the regional mother-tongue languages that still
 *     need API integration.
 */

const languageNames: Record<LanguageCode, string> = {
  san: "Santhali",
  ho: "Ho",
  mun: "Mundari",
  kru: "Kurukh",
  hi: "Hindi",
  en: "English",
};

const sampleInput = "The sun rises in the east. Plants need water and sunlight to grow.";

const sampleTranslations: Record<LanguageCode, string> = {
  san: "[Santhali translation will appear here once the language API is connected.]",
  ho: "[Ho translation will appear here once the language API is connected.]",
  mun: "[Mundari translation will appear here once the language API is connected.]",
  kru: "[Kurukh translation will appear here once the language API is connected.]",
  hi: "सूरज पूर्व में उगता है। पौधों को बढ़ने के लिए पानी और सूरज की रोशनी चाहिए।",
  en: "The sun rises in the east. Plants need water and sunlight to grow.",
};

/**
 * Translate the given text into the target language.
 * @param text - the source lesson text
 * @param targetLanguage - the language code to translate into
 * @returns a promise resolving to the translated string
 */
export async function translateText(
  text: string,
  targetLanguage: LanguageCode,
): Promise<string> {
  // Simulate a short API delay so the loading state is visible during demos.
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const trimmed = text.trim();
  if (!trimmed) {
    return "";
  }

  // For the demo sample, show a pre-written translation so the UI feels real.
  if (trimmed === sampleInput) {
    return sampleTranslations[targetLanguage];
  }

  // For other inputs, return a labeled placeholder until the real API is wired.
  return `[${languageNames[targetLanguage]} translation] ${trimmed}`;
}

export type { LanguageCode };
