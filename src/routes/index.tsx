import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { InputSection } from "@/components/InputSection";
import { LanguageSelector, type LanguageCode } from "@/components/LanguageSelector";
import { OutputSection } from "@/components/OutputSection";
import { HowItWorks } from "@/components/HowItWorks";
import { translateTextFn, UNSUPPORTED_LANGUAGES } from "@/lib/translate.functions";

// Demo sample shown in the input box so the prototype is ready to use immediately.
const SAMPLE_TEXT = "The sun rises in the east. Plants need water and sunlight to grow.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VernacuLearn — Translate Lessons for Every Child" },
      {
        name: "description",
        content:
          "VernacuLearn translates primary school lessons into regional mother-tongue languages for students in Jharkhand.",
      },
      {
        property: "og:title",
        content: "VernacuLearn — Translate Lessons for Every Child",
      },
      {
        property: "og:description",
        content:
          "VernacuLearn translates primary school lessons into regional mother-tongue languages for students in Jharkhand.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/**
 * VernacuLearn homepage.
 *
 * Layout: sticky navbar > hero headline > translator card (input, language,
 * translate button, output) > how-it-works section > footer.
 */
function Index() {
  const [inputText, setInputText] = useState(SAMPLE_TEXT);
  const [targetLang, setTargetLang] = useState<LanguageCode>("sat");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const translate = useServerFn(translateTextFn);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setOutputText("");
    setErrorMessage(null);

    // MyMemory has no model for these languages yet.
    if ((UNSUPPORTED_LANGUAGES as readonly string[]).includes(targetLang)) {
      setIsLoading(false);
      setErrorMessage(
        "Automatic translation for this language isn't available yet. Try Santhali, Hindi or English.",
      );
      return;
    }

    try {
      const result = await translate({
        data: { text: inputText.trim(), targetLanguage: targetLang },
      });
      setOutputText(result.translatedText);
    } catch (error) {
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : "Translation failed. Please check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        {/* Hero + translator area */}
        <section className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Bringing lessons home — in every child's own language
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Paste a lesson or upload a file, choose a language, and get a
              simple translation teachers can use in class.
            </p>
          </div>

          {/* Main translator card */}
          <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-lg sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-6">
              {/* Left column: input, language selector, translate button */}
              <div className="space-y-5">
                <InputSection value={inputText} onChange={setInputText} />
                <LanguageSelector
                  value={targetLang}
                  onChange={(code) => setTargetLang(code)}
                />
                <button
                  type="button"
                  onClick={handleTranslate}
                  disabled={isLoading || !inputText.trim()}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-lg font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
                >
                  {isLoading && (
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  )}
                  {isLoading ? "Translating..." : "Translate"}
                </button>
              </div>

              {/* Desktop arrow between input and output */}
              <div className="hidden items-center justify-center lg:flex">
                <span className="text-3xl text-muted-foreground">→</span>
              </div>

              {/* Right column: output */}
              <OutputSection
                output={outputText}
                isLoading={isLoading}
                error={errorMessage}
              />
            </div>
          </div>
        </section>

        <HowItWorks />
      </main>

      <footer className="border-t border-border bg-background py-6 text-center">
        <p className="text-sm text-muted-foreground">
          VernacuLearn · SIH Hackathon Prototype
        </p>
      </footer>
    </div>
  );
}
