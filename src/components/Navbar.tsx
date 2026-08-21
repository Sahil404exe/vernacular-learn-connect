import { GraduationCap } from "lucide-react";

/**
 * Navbar — fixed app header showing the brand name and tagline.
 * Uses a friendly graduation-cap icon paired with large, readable text.
 */
export function Navbar() {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4">
        {/* Brand icon inside a soft primary circle */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <GraduationCap className="h-6 w-6" aria-hidden="true" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            VernacuLearn
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            Bringing lessons home — in every child's own language
          </p>
        </div>
      </div>
    </header>
  );
}
