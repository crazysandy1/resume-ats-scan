# ATS Resume Toolkit

An AI-powered resume assistant. Build a clean, ATS-friendly resume from a form, and check any resume against a job description to see how an Applicant Tracking System might score it.

> Formerly named `resume--ats-scan`.

## Features

- **ATS checker:** paste a resume and a job description. Gemini returns a 0-100 match score, a summary, matching keywords, missing keywords and concrete suggestions as structured JSON.
- **Resume builder:** form for contact details, summary, work experience (title, company, dates, responsibilities) and education, with a live preview.

## Tech stack

React 19, TypeScript, Vite, Google Gemini (`gemini-2.5-flash` through the `@google/genai` SDK).

## Getting started

Requirements: Node.js 18+ and a [Gemini API key](https://aistudio.google.com/apikey).

```bash
git clone https://github.com/crazysandy1/resume-ats-scan.git
cd resume-ats-scan
npm install
echo "GEMINI_API_KEY=your_key_here" > .env.local
npm run dev
```

Do not commit `.env.local`. The key is read in the browser build by Vite, so for a public deployment put the Gemini call behind your own small server instead of shipping the key to users.

## Project layout

```
App.tsx                      App shell
components/AtsChecker.tsx    Resume vs job-description analysis UI
components/ResumeBuilder.tsx Resume form and preview
services/geminiService.ts    Gemini request and response-schema validation
types.ts, constants.ts       Shared types and defaults
```

## Roadmap

- Move the Gemini call to a backend so the API key stays private.
- PDF export for built resumes and PDF upload for the checker.
- Multiple resume templates.

## License

MIT
