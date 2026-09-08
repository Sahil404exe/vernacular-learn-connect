# Vernacular Voice

Project: Vernacular Pedagogy Translation Tool

Build a simple, clean web app for a hackathon prototype (SIH) called "VernacuLearn" (or similar) — an AI-powered translation tool that converts primary school educational content from English/Hindi into regional mother-tongue languages for students in Jharkhand.

Core functionality:

A homepage with a clear headline explaining the tool's purpose (e.g., "Bringing lessons home — in every child's own language")

A main input section where a teacher can:

Paste or type lesson text into a text box (English or Hindi)

Select target regional language from a dropdown (Santhali, Ho, Mundari, Kurukh, Hindi, English — placeholder list)

Click "Translate" button

Output section showing:

The translated text in large, simple, readable font

A "Listen" button (icon only, can be non-functional/placeholder for now) for future text-to-speech

Use Google Translate API (or mock/placeholder API response for now if API isn't connected) to handle the actual translation

Design requirements:

Simple, minimal UI — large fonts, high contrast, easy to read (target audience includes low-literacy users)

Friendly education-themed color palette (soft blues/greens, avoid clutter)

Mobile-responsive (rural users likely on phones)

Include a simple navbar with app name and tagline

Add a small "How it works" 3-step visual section (Upload/Type → Translate → Read/Listen)

Tech preferences:

React frontend

Keep code clean and well-commented so it's easy to explain each section

Structure code in clear components (InputSection, OutputSection, LanguageSelector, Navbar)

Extra (if easy to add):

Simple loading state while "translating"

Sample example pre-filled in the text box for demo purposes

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f53783ab-8fc6-406f-8587-dda9539bdd1e).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
