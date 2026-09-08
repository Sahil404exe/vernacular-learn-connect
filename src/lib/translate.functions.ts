import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Real translation powered by the free MyMemory Translation API
 * (https://api.mymemory.translated.net/get). No API key is required for
 * basic usage. The call runs on the server so the browser never talks to a
 * third-party service directly.
 */

// MyMemory language codes (ISO 639) for the languages we offer.
// Ho, Mundari and Kurukh are not yet supported by MyMemory.
export const UNSUPPORTED_LANGUAGES = ["ho", "mun", "kru"] as const;

const inputSchema = z.object({
  text: z.string().min(1).max(5000),
  targetLanguage: z.string().min(2).max(8),
});

/**
 * Guess the source language: if the text contains Devanagari characters we
 * treat it as Hindi, otherwise English. MyMemory needs an explicit
 * source|target pair.
 */
function detectSourceLanguage(text: string): "hi" | "en" {
  return /[ऀ-ॿ]/.test(text) ? "hi" : "en";
}

export const translateTextFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const source = detectSourceLanguage(data.text);
    const langpair =
      source === data.targetLanguage
        ? // Same language: nothing to translate, return as-is.
          null
        : `${source}|${data.targetLanguage}`;

    if (!langpair) {
      return { translatedText: data.text };
    }

    const url =
      "https://api.mymemory.translated.net/get" +
      `?q=${encodeURIComponent(data.text)}` +
      `&langpair=${encodeURIComponent(langpair)}`;

    const response = await fetch(url, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      console.error("MyMemory error", response.status);
      throw new Error("Translation service is unavailable. Please try again.");
    }

    const json = (await response.json()) as {
      responseStatus?: number | string;
      responseDetails?: string;
      responseData?: { translatedText?: string };
    };

    const status = Number(json.responseStatus ?? 200);
    if (status !== 200) {
      console.error("MyMemory rejected request:", json.responseDetails);
      if (status === 403 || status === 429) {
        throw new Error(
          "The free translation limit was reached. Please try again later.",
        );
      }
      throw new Error(
        "This language isn't available for automatic translation yet.",
      );
    }

    const translated = json.responseData?.translatedText;
    if (!translated || /NO QUERY SPECIFIED|INVALID LANG/i.test(translated)) {
      throw new Error("No translation was returned. Please try again.");
    }

    return { translatedText: translated };
  });
