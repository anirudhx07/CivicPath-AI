# CivicPath AI

## Chosen Vertical
Election Process Education

## Overview
CivicPath AI is an AI-powered civic education app designed to help users understand the election process in a simple, interactive, and neutral way. It guides users through election timelines, voting steps, voter responsibilities, quizzes, myth-busting, and AI-powered explanations.

## Approach and Logic
The solution is designed around a neutral civic education assistant persona. It focuses on:
- explaining the election process in simple language
- guiding users through step-by-step election timelines
- providing an AI guide for election-related questions
- helping users learn through lessons and quizzes
- busting common election myths and misinformation
- tracking user progress through readiness scores and badges
- supporting accessibility and multilingual learning

## How the Solution Works
- Users select their preferred language and learning role
- The app personalizes the learning experience based on the user type
- Users explore the election process through an interactive timeline
- The AI Guide answers election-related questions in a neutral and educational way
- Lessons explain important topics such as voter registration, voting day, vote counting, and result declaration
- Quizzes test user understanding and update learning progress
- Myth Buster helps users identify misleading election claims
- Badges and readiness scores motivate users to complete their civic learning journey

## Assumptions Made
- The app provides election process education only and does not support any political party or candidate
- Election rules, dates, and requirements may vary by location
- Users should verify official requirements with their local election authority
- AI responses are designed to be neutral, simple, and educational
- Some advanced features such as real-time official verification, voice support, and Firebase sync are represented as prototype logic and UI flows
- User progress, saved answers, quiz history, and badges can later be connected to Firebase

## Key Features
- AI Election Guide
- Interactive Election Timeline
- Election Learning Hub
- Quiz System
- Myth Buster
- Election Readiness Checklist
- Saved Answers and Lessons
- Badges and Progress Tracking
- Multilingual UI Concept
- Accessibility Settings
- Teacher Toolkit
- Student Learning Mode
- Privacy and Safety Flow

## Tech Stack
- React
- TypeScript
- Vite

## Firebase Setup
1. Go to the Firebase Console: https://console.firebase.google.com/
2. Create a Firebase project or open an existing one.
3. Add a Web App to the project.
4. Copy the Firebase config values from the Web App settings.
5. Create a `.env` file in the project root, at the same level as `package.json` and `vite.config.ts`.
6. Copy the exact keys from `.env.example` into `.env`.
7. Fill in the `VITE_FIREBASE_*` values from the Firebase Web App config.
8. Go to Firebase Authentication.
9. Enable the Google provider.
10. Add `localhost` and your deployed domain to Authorized domains if needed.
11. Restart the dev server after editing `.env`.

```bash
cp .env.example .env
```

Your `.env` file should use this exact shape:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_GEMINI_API_KEY=
```

Firebase is initialized from `src/services/firebase.ts` using Vite's `import.meta.env`. Do not use `process.env` in frontend code. If Firebase variables are missing, Google login and Firestore sync are unavailable, but guest mode still works.

## Gemini Setup
1. Create or use a Gemini API key from Google AI Studio.
2. Add it to the same project-root `.env` file:

```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

If `VITE_GEMINI_API_KEY` is missing, AI Guide, quizzes, and Myth Buster continue to work with local fallback responses.

## Environment Validation
The app validates configuration in `src/services/env.ts`.

In development, missing Firebase or Gemini values show a non-blocking setup banner. When a user opens a feature that requires missing Firebase config, such as Google login, the app shows a setup panel with the missing keys and keeps guest login available.

After changing `.env`, always restart the Vite dev server:

```bash
npm run dev
```

## Run Locally
```bash
npm install
npm run dev
