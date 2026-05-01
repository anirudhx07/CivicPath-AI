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
- Users can create a local prototype account, log in locally, or continue as a guest
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
- User accounts are stored locally for prototype/demo purposes only
- Guest progress is saved only on the current device

## Key Features
- Local prototype account creation and login
- Continue as guest
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

## Prototype Authentication
CivicPath AI uses prototype-only localStorage authentication. Users can create an account, log in with that account, or continue as a guest without Firebase Authentication or Google login.

Local account and session data uses:
- `civicpath_users`
- `civicpath_current_user`

Progress is stored locally per user:
- `civicpath_progress_${user.id}`
- `civicpath_progress_guest`

User accounts are stored locally for prototype/demo purposes only. Do not use this authentication system for production security.

## Gemini Setup
1. Create or use a Gemini API key from Google AI Studio.
2. Create a `.env` file in the project root.
3. Add the key:

```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

If `VITE_GEMINI_API_KEY` is missing, AI Guide, quizzes, and Myth Buster continue to work with local fallback responses.

## App Mode
Offline/PWA mode has been removed. The app runs as a standard Vite React application.

## Firebase Hosting
The project may keep `firebase.json` for static Firebase Hosting deployment. Firebase Authentication, Google login, and Firestore sync are not used by the app.

## Run Locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```
