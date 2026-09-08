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

// Anonymous MyMemory queries are capped at 500 characters per request.
// Keep chunks a little under the cap to be safe.
const MAX_CHUNK = 450;

/**
 * Split long lessons into sentence-sized chunks that each fit under the
 * MyMemory 500-character query limit. Sentences longer than the cap are
 * hard-split at the nearest space.
 */
function chunkText(text: string): string[] {
  const sentences = text.match(/[^.!?।\n]+[.!?।]*\s*/g) ?? [text];
  const chunks: string[] = [];
  let current = "";

  const pushLong = (piece: string) => {
    // Hard-split an over-long sentence at word boundaries.
    let rest = piece;
    while (rest.length > MAX_CHUNK) {
      let cut = rest.lastIndexOf(" ", MAX_CHUNK);
      if (cut < MAX_CHUNK / 2) cut = MAX_CHUNK;
      chunks.push(rest.slice(0, cut).trim());
      rest = rest.slice(cut);
    }
    current = rest;
  };

  for (const sentence of sentences) {
    if ((current + sentence).length > MAX_CHUNK) {
      if (current.trim()) chunks.push(current.trim());
      current = "";
      if (sentence.length > MAX_CHUNK) {
        pushLong(sentence);
        continue;
      }
    }
    current += sentence;
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.filter(Boolean);
}

/**
 * Call the MyMemory API for a single text chunk.
 * langpair is formatted as "en|hi" (ISO codes joined by a pipe) and the
 * text is URL-encoded; the translation comes back in
 * responseData.translatedText.
 */
async function translateChunk(
  text: string,
  langpair: string,
): Promise<string> {
  const url =
    "https://api.mymemory.translated.net/get" +
    `?q=${encodeURIComponent(text)}` +
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
  return translated;
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

    // MyMemory rejects anonymous queries over 500 characters, so long
    // lessons are translated chunk by chunk and joined back together.
    const chunks = chunkText(data.text);
    const translatedChunks: string[] = [];
    for (const chunk of chunks) {
      translatedChunks.push(await translateChunk(chunk, langpair));
    }

    return { translatedText: translatedChunks.join(" ") };
  });
