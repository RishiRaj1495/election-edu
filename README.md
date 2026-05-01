# 🗳️ ElectEd — Your Friendly AI-Powered Election Guide

> *“Democracy is not a spectator sport — but sometimes the rulebook is longer than a phone book. So I built this.”*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-gold?style=for-the-badge)](https://your-deployment-url.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Powered by Claude](https://img.shields.io/badge/Powered%20by-Anthropic%20Claude-orange?style=for-the-badge)](https://anthropic.com)

---

## 🗳️ What is ElectEd?

ElectEd is a comprehensive, single-file election education web application that helps users understand the complete democratic election process through:

- **📅 Interactive Timeline** — All 8 election phases with expandable detail panels
- **🔍 Process Explorer** — Step-by-step breakdowns of voter registration, primaries, Election Day, mail voting, and results certification
- **🧠 Knowledge Quiz** — 8-question quiz with instant feedback and explanations
- **🤖 AI Chat Assistant** — Powered by Anthropic Claude (claude-sonnet), answers any election question
- **📖 Election Glossary** — 16 key terms with definitions and phonetic pronunciations

---

## 🚀 Deployment Options

### Option 1: GitHub Pages (Free, Recommended)

1. Fork or clone this repository
2. Go to **Settings → Pages**
3. Set Source to `main` branch, `/root` folder
4. Your site will be live at `https://yourusername.github.io/election-edu`

### Option 2: Netlify (Free)

1. Go to [netlify.com](https://netlify.com) → "Add new site" → "Deploy manually"
2. Drag and drop the `index.html` file (or the entire folder)
3. Your site is live instantly with a Netlify URL
4. Optionally add a custom domain

### Option 3: Vercel (Free)

```bash
npm install -g vercel
vercel --prod
```

### Option 4: Any Static Host

Since ElectEd is a **single HTML file**, it can be deployed to any static hosting service:
- Cloudflare Pages
- Firebase Hosting  
- AWS S3 + CloudFront
- Render
- Surge.sh (`surge index.html`)

---

## 🔑 Setting Up the AI Assistant

The AI chat assistant requires an Anthropic API key:

1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Create an account and generate an API key
3. In the app, scroll to the **AI Assistant** section
4. Click the API key field and enter your key (starts with `sk-ant-`)
5. The key is saved in your browser's localStorage

> **Note:** The API key is stored locally in the user's browser and never sent to any server other than Anthropic's API.

---

## 🏗️ Architecture

```
election-edu/
├── index.html          # Complete application (self-contained)
└── README.md           # This file
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML5, CSS3, JavaScript (ES6+) |
| Fonts | Google Fonts (Playfair Display, DM Sans, DM Mono) |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |
| Deployment | Any static host (GitHub Pages, Netlify, Vercel) |
| Storage | Browser localStorage (API key only) |

### Design Philosophy

- **Zero dependencies** — No build tools, no npm, no bundler required
- **Single file** — The entire app lives in `index.html`  
- **Civic Modernist** aesthetic — Navy, gold, ivory palette with Playfair Display serif typography
- **Mobile responsive** — Works on all screen sizes
- **Accessible** — Semantic HTML, sufficient color contrast, keyboard navigation

---

## 📊 Features Overview

### Election Timeline
Covers all 8 phases of U.S. elections:
1. Voter Registration
2. Candidate Filing
3. Primary Elections
4. Campaign Period
5. Voting (Election Day)
6. Vote Counting
7. Canvassing & Certification
8. Transition & Swearing-In

### Process Explorer
Deep-dive guides for:
- Voter Registration (6 steps)
- Primary Elections (5 steps)
- Election Day Voting (6 steps)
- Mail-In & Absentee Voting (5 steps)
- Results & Certification (5 steps)

### Knowledge Quiz
8 questions covering:
- Electoral College mechanics
- Voting eligibility requirements
- Primary election types
- Provisional ballots
- Canvassing process
- FEC role and campaign finance
- Constitutional amendments
- Gerrymandering

### AI Assistant
Powered by Claude with a specialized system prompt focused on:
- Election processes and timelines
- Voting rights and requirements
- Comparative international election systems
- Civic participation encouragement

---

## 🎨 Design System

```css
--navy:    #0A1628   /* Primary brand */
--gold:    #C9972B   /* Accent */
--crimson: #B5282A   /* Alerts/highlights */
--ivory:   #F7F3EC   /* Backgrounds */

Font-Display: 'Playfair Display' (headings)
Font-Body:    'DM Sans' (body text)
Font-Mono:    'DM Mono' (code/numbers)
```

---

## 🔒 Security Notes

- API keys are stored in browser `localStorage` (client-side only)
- No backend server required
- No user data is collected or transmitted except to Anthropic's API
- Direct browser-to-Anthropic API communication (requires `anthropic-dangerous-direct-browser-access` header)
- For production deployments, consider a backend proxy to protect API keys

---

## 📝 Evaluation Criteria

| Criteria | Implementation |
|----------|---------------|
| **Code Quality** | Clean vanilla JS, modular data/render separation, consistent naming |
| **Security** | API key stored locally, no secrets in code, input sanitization |
| **Efficiency** | Single file, no framework overhead, IntersectionObserver for animations |
| **Accessibility** | Semantic HTML, ARIA-compatible structure, keyboard nav, color contrast |
| **Google Services** | Google Fonts integrated (Playfair Display, DM Sans, DM Mono) |

---

## 📄 License

MIT License — free to use, modify, and deploy.

---

## 🙏 Credits

- Election data and civics content: U.S. Election Assistance Commission guidelines
- AI assistant powered by [Anthropic Claude](https://anthropic.com)
- Typography by [Google Fonts](https://fonts.google.com)

---

*Built for the Election Process Education Challenge · Powered by Antigravity × Anthropic Claude*
