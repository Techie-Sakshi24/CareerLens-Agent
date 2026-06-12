# CareerLens Agent
A reasoning agent that reads a job description and your resume, then tells you exactly where the gap is — and what to do about it.

Built for the **Microsoft Agents League Hackathon 2026** | Track: Reasoning Agents | IQ Layer: Foundry IQ


## The problem

Job hunting is exhausting. You paste a JD, reread your resume five times, wonder if you're qualified, write a generic message, and hit send. Half the time you don't hear back.

The real issue is that matching yourself to a job description is a reasoning problem, not a search problem. It needs someone (or something) to actually read both documents, compare them, and say: here's what they want, here's what you have, here's the gap, and here's how to talk about it.

That's what CareerLens does.


## What it does

You paste in a job description. You paste in your resume (or upload a PDF). The agent runs a 4-step reasoning pipeline:

1. **Extract** — pulls out required skills, preferred skills, and role context from the JD
2. **Match** — maps your experience against those requirements, line by line
3. **Gap analysis** — identifies what's missing, what's close enough, and what's strong
4. **Generate outputs** — writes tailored resume bullet points for the role and a cold outreach message draft

Foundry IQ grounds every step with retrieved context so the output isn't just hallucinated filler.

## Tech stack

- **Frontend** — React.js
- **Backend** — Node.js + Express
- **AI layer** — Microsoft Azure AI Foundry + Foundry IQ
- **Deployment** — Vercel (frontend), Render (backend)


## Microsoft IQ integration

This project uses **Foundry IQ** — the agentic knowledge retrieval layer from Azure AI Foundry.

Foundry IQ connects to knowledge sources, enforces permissions, and returns cited, grounded answers. In CareerLens, it powers the skill extraction and matching steps to reduce hallucination in the gap analysis output.


## How to run locally

### Prerequisites

- Node.js v18+
- An Azure AI Foundry account with Foundry IQ access
- A `.env` file (see `.env.example`)

### Setup

```bash
git clone https://github.com/Techie-Sakshi24/careerlens-agent.git
cd careerlens-agent
```

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend:**
```bash
cd client
npm install
npm start
```

The app runs at `http://localhost:3000`.

### Environment variables

Create a `.env` file in `/server`:

```
AZURE_FOUNDRY_API_KEY=your_key_here
AZURE_FOUNDRY_ENDPOINT=your_endpoint_here
PORT=5000
```

---

## Project structure

```
careerlens-agent/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # ResumeInput, JDInput, OutputPanel
│   │   ├── pages/        # Home, Results
│   │   └── utils/        # API helpers
├── server/               # Node + Express backend
│   ├── routes/           # /analyze endpoint
│   ├── services/         # Foundry IQ integration, reasoning pipeline
│   └── index.js
├── .env.example
└── README.md
```


## Demo

[Link to demo video — coming before June 14 submission]


## Built by

**Sakshi Kale** — BCA final year, SPPU Pune  
GitHub: [Techie-Sakshi24](https://github.com/Techie-Sakshi24)  
LinkedIn: [sakshi-kale-ab0a622b0](https://linkedin.com/in/sakshi-kale-ab0a622b0)

I built this because I'm actively job hunting as a fresher and this is the tool I actually needed. It solves a problem I ran into every single day during applications.

## Hackathon

**Microsoft Agents League Hackathon 2026**  
Track: Reasoning Agents  
IQ Layer: Foundry IQ  
Submission deadline: June 14, 2026
