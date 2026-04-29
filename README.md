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
1. Go to the Firebase Console.
2. Create a Firebase project or open an existing one.
3. Add a Web App to the project.
4. Copy the Firebase config values from the Web App settings.
5. Create a `.env` file in the project root, at the same level as `package.json` and `vite.config.ts`.
6. Copy the keys from `.env.example` into `.env` and fill in the `VITE_FIREBASE_*` values.
7. Go to Firebase Authentication.
8. Enable the Google provider.
9. Add `localhost` and your deployed domain to Authorized domains if needed.
10. Restart the dev server after editing `.env`.

```bash
cp .env.example .env
```

Required Vite environment variables:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_GEMINI_API_KEY=
```

Firebase is initialized from `src/services/firebase.ts` using `import.meta.env`. Do not use `process.env` in frontend code. If Firebase variables are missing, Google login is unavailable, but guest mode still works.

## Run Locally
```bash
npm install
npm run dev
