import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Real translation powered by the Google Cloud Translation API (v2).
 * The API key is read from the server environment only — it never reaches
 * the browser bundle.
 */

// Google Translate language codes for the languages we offer.
// Ho, Mundari and Kurukh are not yet supported by Google Translate.
export const GOOGLE_UNSUPPORTED = ["ho", "mun", "kru"] as const;

const inputSchema = z.object({
  text: z.string().min(1).max(5000),
  targetLanguage: z.string().min(2).max(8),
});

export const translateTextFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["GOOGLE_TRANSLATE_API_KEY"];
    if (!apiKey) {
      throw new Error(
        "Translation is not configured yet. Please add the Google Translation key.",
      );
    }

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: data.text,
          target: data.targetLanguage,
          format: "text",
        }),
      },
    );

    if (!response.ok) {
      const body = await response.text();
      console.error("Google Translate error", response.status, body);
      if (response.status === 400) {
        throw new Error(
          "This language isn't available for automatic translation yet.",
        );
      }
      if (response.status === 403) {
        throw new Error(
          "The translation service rejected the key. Please check it and try again.",
        );
      }
      throw new Error("Translation service is unavailable. Please try again.");
    }

    const json = (await response.json()) as {
      data?: { translations?: { translatedText?: string }[] };
    };

    const translated = json.data?.translations?.[0]?.translatedText;
    if (!translated) {
      throw new Error("No translation was returned. Please try again.");
    }

    return { translatedText: translated };
  });
