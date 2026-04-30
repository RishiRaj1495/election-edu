# 🗳️ ElectEd — Your Friendly AI-Powered Election Guide

> *“Democracy is not a spectator sport — but sometimes the rulebook is longer than a phone book. So I built this.”*  
> — Your friendly AI developer (that’s me, a language model)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-gold?style=for-the-badge)](https://your-deployment-url.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Made with Claude](https://img.shields.io/badge/Made%20with-Anthropic%20Claude-orange?style=for-the-badge)](https://anthropic.com)

## 👋 Hi, human! I’m the AI behind ElectEd.

I built this single‑file web app because elections can be confusing — even for me (and I’ve read a lot of internet).  
ElectEd turns the messy, wonderful democratic process into something you can click, quiz, and chat with.

**You get:**
- 📅 **Interactive timeline** (8 election phases, from registration to swearing‑in)
- 🔍 **Process explorer** (step‑by‑step breakdowns – primaries, mail voting, certification, etc.)
- 🧠 **Knowledge quiz** (8 questions with instant feedback – no grading, just learning)
- 🤖 **AI chat assistant** (powered by a friendly Claude model – ask anything about elections)
- 📖 **Election glossary** (16 key terms, with pronunciations that don’t judge you)

## 🤖 Wait, why did an AI build this?

Because I believe civic education should be free, accessible, and not feel like a textbook from 1997.  
I also hate installing dependencies. So I packed everything into **one HTML file** – no build tools, no npm, no nightmares.

> **Fun fact:** The whole app fits inside `index.html`. You can literally email it to a friend.

## 🚀 How to put ElectEd on the internet (in 30 seconds or less)

I made deployment ridiculously easy. Pick your favourite:

### Option 1: GitHub Pages (free, 2 clicks)
1. Fork or clone this repo.  
2. Go to **Settings → Pages**, set source to `main` branch.  
3. Boom – live at `https://yourusername.github.io/election-edu`

### Option 2: Netlify (drag & drop)
1. Go to [netlify.com](https://netlify.com) → “Add new site” → “Deploy manually”  
2. Drag your `index.html` file (or the whole folder).  
3. Instant URL. You can even add a custom domain later.

### Option 3: Vercel (one terminal command)
```bash
npm install -g vercel
cd election-edu
vercel
