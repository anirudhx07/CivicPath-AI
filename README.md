# CivicPath AI

<p align="center">
  <strong>AI-powered civic education app for understanding the election process in a simple, interactive, and neutral way.</strong>
</p>

<p align="center">
  <a href="https://civicpath-ai.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-Open%20CivicPath%20AI-2563EB?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
</p>

<p align="center">
  <a href="https://civicpath-ai.vercel.app/">
    <strong>🚀 Launch CivicPath AI</strong>
  </a>
</p>

---

## Chosen Vertical

Election Process Education

## Overview

CivicPath AI is an AI-powered civic education app designed to help users understand the election process in a simple, interactive, and neutral way.

It guides users through election timelines, voting steps, voter responsibilities, quizzes, myth-busting, and AI-powered explanations. The app focuses only on election process education and does not support or promote any political party, candidate, ideology, or voting choice.

## Live Deployment

The project is deployed on Vercel.

**Live App:**  
https://civicpath-ai.vercel.app/

## Approach and Logic

The solution is designed around a neutral civic education assistant persona. It focuses on:

- explaining the election process in simple language
- guiding users through step-by-step election timelines
- providing an AI guide for election-related questions
- helping users learn through lessons and quizzes
- busting common election myths and misinformation
- tracking user progress through readiness scores and badges
- supporting accessibility and multilingual learning
- keeping all explanations non-partisan and educational

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
- Some AI features can work through Gemini when an API key is available, while local fallback responses keep the prototype functional without an API key

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
- Neutral AI safety behavior for political persuasion questions

## Tech Stack

- React
- TypeScript
- Vite
- Vercel
- Gemini API optional
- Browser localStorage/sessionStorage for prototype data

## Prototype Authentication

CivicPath AI uses prototype-only browser storage authentication. Users can create an account, log in with that account, or continue as a guest without Firebase Authentication or Google login.

Local accounts are saved in `localStorage`:

```text
civicpath_users
