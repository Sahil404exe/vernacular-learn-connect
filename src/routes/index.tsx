import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Navbar } from "@/components/Navbar";
import { InputSection } from "@/components/InputSection";
import { LanguageSelector, type LanguageCode } from "@/components/LanguageSelector";
import { OutputSection } from "@/components/OutputSection";
import { HowItWorks } from "@/components/HowItWorks";
import { translateText } from "@/lib/translate";

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
  const [targetLang, setTargetLang] = useState<LanguageCode>("san");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setOutputText("");

    try {
      const result = await translateText(inputText, targetLang);
      setOutputText(result);
    } catch (error) {
      // For a hackathon demo, a simple message is enough; in production this
      // should be handled with a proper error boundary or toast.
      setOutputText("Translation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        {/* Hero + translator area */}
        <section className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Bringing lessons home — in every child's own language
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Paste a lesson, choose a language, and get a simple translation
              teachers can use in class.
            </p>
          </div>

          {/* Main translator card */}
          <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-lg sm:mt-12 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr]">
              {/* Left column: input, language selector, translate button */}
              <div className="space-y-4">
                <InputSection value={inputText} onChange={setInputText} />
                <LanguageSelector
                  value={targetLang}
                  onChange={(code) => setTargetLang(code)}
                />
                <button
                  type="button"
                  onClick={handleTranslate}
                  disabled={isLoading || !inputText.trim()}
                  className="w-full rounded-xl bg-primary px-6 py-4 text-lg font-bold text-primary-foreground shadow-md transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                >
                  {isLoading ? "Translating..." : "Translate"}
                </button>
              </div>

              {/* Desktop arrow between input and output */}
              <div className="hidden items-center justify-center lg:flex">
                <span className="text-3xl text-muted-foreground">→</span>
              </div>

              {/* Right column: output */}
              <OutputSection output={outputText} isLoading={isLoading} />
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
