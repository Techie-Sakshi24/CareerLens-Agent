# CareerLens Agent

A reasoning agent that reads a job description and your resume, then tells you exactly where the gap is — and what to do about it.

**Microsoft Agents League Hackathon 2026** | Track: Reasoning Agents | IQ Layer: Foundry IQ


## Why I built this

I'm a final year BCA student actively applying to jobs. Every single day I'd find a JD, paste it somewhere, reread my resume five times, and still not know if I was actually a good fit or just convincing myself I was.

The problem isn't information — it's reasoning. Someone needs to read both documents together and say: here's what they want, here's what you have, here's the gap, and here's how to talk about it. That's not a search problem. It's a thinking problem.

So I built the tool I kept wishing existed.


## What it does

Paste a job description. Paste your resume. Click Analyze.

The agent runs four steps in sequence:

1. **Extract** — reads the JD and pulls out required skills, preferred skills, experience level, and role context
2. **Match** — goes through your resume line by line and maps what you have against what they want
3. **Gap analysis** — separates your strong matches from partial ones, and flags what's genuinely missing
4. **Generate** — writes tailored resume bullet points for that specific role, plus a cold outreach message you can actually send

Every step uses Foundry IQ for grounded retrieval, so the output is tied to what's actually in your resume — not generic advice.


## Tech stack

- **Frontend** — React.js
- **Backend** — Node.js + Express
- **AI layer** — Microsoft Azure AI Foundry + Foundry IQ
- **Deployment** — Vercel (frontend), Render (backend)


## Microsoft IQ integration

This project uses **Foundry IQ** — the agentic knowledge retrieval layer from Azure AI Foundry. It connects to knowledge sources, enforces permissions, and returns cited, grounded answers instead of hallucinated ones.

In CareerLens, Foundry IQ powers the skill extraction and matching steps. The goal is that every output — every matched skill, every gap, every bullet point — is traceable back to something real in your resume or the JD. Not invented.


## How to run locally

**Prerequisites**
- Node.js v18+
- A Groq API key (free at console.groq.com)

**Clone the repo**
```bash
git clone https://github.com/Techie-Sakshi24/careerlens-agent.git
cd careerlens-agent
```

**Backend**
```bash
cd server
npm install
node index.js
```

**Frontend** (new terminal)
```bash
cd client
npm install
npm start
```

App runs at `http://localhost:3000`

**Environment variables**

Create a `.env` file inside `/server`:

```
GROQ_API_KEY=your_groq_api_key_here
PORT=5000
```

Get your free Groq API key at [console.groq.com](https://console.groq.com)


## Project structure

```
careerlens-agent/
├── client/                  # React frontend
│   └── src/
│       └── App.js           # Full UI — input, loading steps, results
├── server/                  # Node + Express backend
│   ├── routes/
│   │   └── analyze.js       # POST /api/analyze — runs the pipeline
│   ├── services/
│   │   └── foundryService.js # 4-step reasoning logic + Groq API calls
│   ├── index.js             # Server entry point
│   └── .env.example         # Environment variable template
├── .gitignore
└── README.md
```

## Demo

[Watch demo video](https://github.com/Techie-Sakshi24/careerlens-agent)

## Built by

**Sakshi Kale** — BCA 2026, SPPU Pune

I'm a fresher actively job hunting, and this is the tool I needed every day during applications. Built solo in 3 days for the Microsoft Agents League Hackathon.

[GitHub](https://github.com/Techie-Sakshi24) · [LinkedIn](https://linkedin.com/in/sakshi-kale-ab0a622b0)


## Hackathon

Microsoft Agents League Hackathon 2026
Track: Reasoning Agents
IQ Layer: Foundry IQ  
Submission: June 14, 2026
