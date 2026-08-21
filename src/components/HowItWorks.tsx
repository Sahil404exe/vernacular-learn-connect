import { Pencil, Languages, BookOpen } from "lucide-react";

const steps = [
  {
    icon: Pencil,
    title: "Type or Paste",
    description: "Enter lesson text in English or Hindi.",
  },
  {
    icon: Languages,
    title: "Pick a Language",
    description: "Choose a regional mother-tongue like Santhali or Ho.",
  },
  {
    icon: BookOpen,
    title: "Read & Listen",
    description: "Get a clear translation and listen when ready.",
  },
];

/**
 * HowItWorks — a simple 3-step visual guide for new users.
 * Each step uses an icon, a step number, and a short sentence.
 */
export function HowItWorks() {
  return (
    <section className="w-full bg-secondary/30 py-10">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="text-center text-2xl font-bold text-foreground">
          How it works
        </h2>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="flex flex-col items-center rounded-2xl bg-card p-6 text-center shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <step.icon className="h-6 w-6" aria-hidden="true" />
              </div>

              <span className="mt-3 text-sm font-semibold text-primary">
                Step {index + 1}
              </span>

              <h3 className="mt-1 text-lg font-bold text-foreground">
                {step.title}
              </h3>

              <p className="mt-2 text-base text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
