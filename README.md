# AI Money Mentor — ET AI Hackathon 2026

> **Problem Statement 9 — AI Money Mentor**
> 6-feature personal finance AI mentor for India's 95% without a financial plan.
> Stack: FastAPI + Llama3-70B (Groq) + React + Vite + Tailwind + Recharts

---

## Features

| # | Feature | What it does |
|---|---------|-------------|
| 1 | 💊 Money Health Score | 360° financial health across 6 dimensions (radar chart + gauge) |
| 2 | 🔥 FIRE Path Planner | Corpus calculator + SIP projection chart + phased roadmap |
| 3 | 🧾 AI Tax Wizard | Upload Form 16 → old vs new regime comparison + missed deductions |
| 4 | 📊 MF Portfolio X-Ray | XIRR badge + fund overlap matrix + expense drag analysis |
| 5 | 🎯 Life Event Advisor | 30/60/90-day plans for marriage, baby, job change, bonus, retirement |
| 6 | 💑 Couple's Money Planner | HRA optimization + NPS strategy + joint SIP split |

---

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- [Groq API key](https://console.groq.com) (free tier)

### 1. Backend

```bash
cd C:\ET_GENAI

# Create .env
echo GROQ_API_KEY=your_key_here > .env

# Install dependencies
pip install -r backend/requirements.txt

# Start server (port 8000)
python -m uvicorn backend.main:app --reload
```

Test: http://localhost:8000/api/v1/health → `{"status":"ok","model":"llama3-70b-8192"}`

### 2. Frontend

```bash
cd C:\ET_GENAI\frontend

npm install   # or: yarn install
npm run dev   # or: yarn dev
```

Open: http://localhost:3000

---

## Project Structure

```
C:\ET_GENAI\
├── backend/
│   ├── main.py               # FastAPI app, CORS, all 6 routers
│   ├── config.py             # Pydantic settings (GROQ_API_KEY)
│   ├── llm_client.py         # Groq SDK wrapper
│   ├── routers/              # 6 API routers (one per feature)
│   ├── services/             # Tax calc, XIRR, SIP projector, PDF parser
│   ├── prompts/              # LLM system prompts + JSON schemas
│   └── sample_data/          # Mock portfolio + Form 16 JSON
└── frontend/
    └── src/
        ├── pages/            # 7 React pages (Home + 6 features)
        ├── components/       # Shared: RadarChart, SipGrowthChart, ScoreGauge…
        └── api/client.ts     # Axios API client
```

---

## API Endpoints

| Method | Path | Feature |
|--------|------|---------|
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/health-score/calculate` | Money Health Score |
| POST | `/api/v1/fire-planner/generate` | FIRE Planner |
| POST | `/api/v1/tax-wizard/analyze` | Tax Wizard |
| POST | `/api/v1/portfolio-xray/analyze` | Portfolio X-Ray |
| POST | `/api/v1/life-events/advise` | Life Events |
| POST | `/api/v1/couple-planner/optimize` | Couple Planner |

---

## Tech Stack

**Backend:** Python · FastAPI · Groq SDK · pdfplumber · scipy
**LLM:** Llama3-70B (Meta, open-source) via Groq API (free tier)
**Frontend:** React 18 · Vite · TypeScript · Tailwind CSS · Recharts · React Router

---

## Demo (Sample Data)

Every page has a **"Use Sample Data"** / **"Load Sample Data"** button — no PDF upload required for demo.

Recommended demo flow:
1. **Health Score** → fill form or click "Load Sample Data" → see radar chart + gauge
2. **FIRE Planner** → age 30, FIRE at 50 → corpus + SIP projection chart
3. **Tax Wizard** → "Use Sample Data" → Form 16 ₹18L salary → regime comparison
4. **Portfolio X-Ray** → "Use Sample Data" → XIRR + overlap matrix
5. **Life Events** → select "Bonus" → ₹5L → 30/60/90 day plan
6. **Couple Planner** → load sample → HRA decision + SIP split

---

## ET AI Hackathon 2026

Built for **Problem Statement 9 — AI Money Mentor**.
Open-source model (Llama3-70B by Meta) satisfies hackathon rule for open-source tools.
