# 🗳️ ElectEd — Your Friendly AI-Powered Election Guide

> *“Democracy is not a spectator sport — but sometimes the rulebook is longer than a phone book. So I built this.”*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-gold?style=for-the-badge)](https://your-deployment-url.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Made with Claude](https://img.shields.io/badge/Made%20with-Claude-orange?style=for-the-badge)](https://anthropic.com)

ElectEd is a single-file web app that makes the U.S. election process easier to understand through interactive learning. It combines a clickable election timeline, guided process breakdowns, a quiz, a glossary, and an AI-powered assistant in one lightweight static app.

## Table of Contents

- [Why ElectEd](#why-elected)
- [Features](#features)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [AI Chat Setup](#ai-chat-setup)
- [Privacy and Security](#privacy-and-security)
- [Accessibility](#accessibility)
- [Use Cases](#use-cases)
- [Roadmap](#roadmap)
- [License](#license)
- [Credits](#credits)

## Why ElectEd

Elections are important, but the process can feel complicated, fragmented, and hard to follow. ElectEd was built to turn civic education into something more approachable, interactive, and easy to deploy.

Because the entire app lives in a single `index.html` file, it runs without build tools, package installation, or framework setup. That makes it ideal for classrooms, demos, workshops, and quick static hosting.

## Features

### 📅 Interactive Election Timeline
Explore 8 major phases of the U.S. election cycle, from voter registration to transition and swearing-in.

### 🔍 Process Explorer
Understand key election workflows step by step, including:
- Voter registration
- Primary elections
- Election Day voting
- Mail-in and absentee voting
- Results, canvassing, and certification

### 🧠 Knowledge Quiz
Test understanding with 8 multiple-choice questions and instant explanations. The quiz is designed for learning, not scoring pressure.

### 🤖 AI Election Assistant
Ask election-related questions in plain English through an AI chat assistant powered by Claude.

Example questions:
- “What’s the difference between a caucus and a primary?”
- “Why do we have the Electoral College?”
- “How does mail-in voting work?”
- “When do polls close in my state?”

### 📖 Election Glossary
Browse 16 important election terms with simple definitions and phonetic pronunciations.

## Live Demo

Visit the deployed app here:

**[Open ElectEd](https://your-deployment-url.com)**

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES6) |
| AI | Anthropic Claude |
| Storage | Browser local storage for API key |
| Fonts | Playfair Display, DM Sans, DM Mono |
| Hosting | Any static host |

## Project Structure

```text
election-edu/
├── index.html
└── README.md
```

ElectEd is intentionally packaged as a single-file application. This keeps setup simple and makes the project easy to share, host, or adapt.

## Getting Started

### Run locally

No installation is required for the core app.

1. Clone or download this repository.
2. Open `index.html` in your browser.

You can also serve it with a lightweight local server if preferred:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deployment

Because ElectEd is a static single-file app, it can be deployed almost anywhere.

### GitHub Pages

1. Fork or clone this repository.
2. Push it to your GitHub account.
3. Open **Settings → Pages**.
4. Set the source to your main branch.
5. Publish the site.

### Netlify

1. Go to [Netlify](https://netlify.com).
2. Create a new site.
3. Drag and drop `index.html` or the full project folder.
4. Netlify will generate a live URL instantly.

### Vercel

```bash
npm install -g vercel
cd election-edu
vercel
```

### Other static hosts

ElectEd works on any platform that serves static files, including:
- Cloudflare Pages
- Firebase Hosting
- AWS S3
- Surge
- Local intranet hosting

## AI Chat Setup

The AI assistant uses the Anthropic API and requires your own API key.

1. Go to [Anthropic Console](https://console.anthropic.com).
2. Create an API key.
3. Open ElectEd in your browser.
4. Scroll to the AI Assistant section.
5. Paste your key into the input field.

Once entered, the key is stored in your browser so the app can make requests directly to Anthropic.

## Privacy and Security

- Your Anthropic API key is stored only in your browser.
- The project does not include a backend server.
- No API key is hardcoded in the source.
- Requests are sent directly from the frontend to Anthropic.

For personal, classroom, or prototype use, this setup is simple and practical. For a larger public deployment, a backend proxy is recommended so users do not need to expose their own API keys in the browser.

## Accessibility

ElectEd is designed to be usable across devices and experience levels.

- Semantic HTML structure
- Keyboard-friendly navigation
- Readable contrast and typography
- Mobile-responsive layout
- Clear, plain-language educational content

## Use Cases

ElectEd works especially well for:
- Civic education projects
- Classroom teaching aids
- Library and community workshops
- Student hackathons
- Public information demos
- Personal learning about elections

## Roadmap

Potential future improvements:
- State-specific election information
- More quiz questions and difficulty levels
- Multilingual support
- Better comparative election system explanations
- Optional backend proxy for secure shared AI access
- Expanded glossary and visual explainers

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Credits

- Civic content inspiration: U.S. election education and public guidance sources
- AI integration: [Anthropic Claude](https://anthropic.com)
- Fonts: [Google Fonts](https://fonts.google.com/) — Playfair Display, DM Sans, DM Mono
- Built for the Election Process Education Challenge

---

Made with care, curiosity, and zero npm packages.
