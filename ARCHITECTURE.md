# Architecture — AI Money Mentor

## System Overview

```
Browser (React/Vite :3000)
        │
        │ HTTP / axios
        ▼
FastAPI Backend (:8000)
        │
        ├── Pure Python Services (deterministic math)
        │       ├── tax_calculator.py    — FY 2024-25 old/new regime slabs
        │       ├── xirr_calculator.py   — Newton-Raphson / scipy.optimize.brentq
        │       ├── sip_projector.py     — Month-by-month corpus projection
        │       └── portfolio_analyzer.py — Overlap (Jaccard), expense drag
        │
        └── Groq API (Llama3-70B)
                │  HTTP (groq Python SDK)
                ▼
          Groq Cloud (free tier)
          Model: llama3-70b-8192
```

## LLM Integration Strategy

**Separation of concerns:**
- Python services compute all arithmetic (tax, XIRR, SIP, expense ratios)
- LLM receives pre-computed numbers as facts in the prompt
- LLM focuses only on: judgment, narrative, recommendations, prioritization
- This prevents hallucination on numbers while leveraging LLM strengths

**Prompt engineering:**
- Every system prompt includes Indian financial context (IT Act sections, SEBI norms, FY 2024-25 slabs)
- Tax slab rates embedded verbatim in tax prompts
- All prompts request strict JSON output matching a defined schema
- `chat_structured()` strips markdown code fences and validates JSON before returning

**Structured output:**
```python
# llm_client.py
def chat_structured(system, user, schema_hint) -> dict:
    # Appends schema to system prompt
    # Calls Groq API → llama3-70b-8192
    # Strips ```json ... ``` blocks
    # Parses JSON → raises HTTP 502 on failure
```

## Data Flow per Feature

### Money Health Score
```
Form input → router → LLM (6-dim scoring + top 3 priorities) → RadarChart + ScoreGauge
```

### FIRE Planner
```
Sliders → sip_projector.py (corpus math) → router → LLM (phases + allocation + risks)
       → AreaChart (projection) + DonutChart (allocation) + roadmap table
```

### Tax Wizard
```
PDF / manual → pdf_parser.py → tax_calculator.py (old + new regime exact math)
             → LLM (missed deductions + investment suggestions)
             → Regime comparison table + missed deductions list
```

### Portfolio X-Ray
```
CAMS PDF / sample → pdf_parser.py → xirr_calculator.py (brentq)
                  → portfolio_analyzer.py (overlap + expense drag)
                  → LLM (rebalancing plan) → XIRR badge + overlap matrix + table
```

### Life Events
```
Event selection + financials → LLM (30/60/90 day plan + immediate actions) → action plan UI
```

### Couple Planner
```
Dual partner form → LLM (HRA optimization + NPS + SIP split + insurance gaps) → optimized plan
```

## Error Handling

- `llm_client.py` raises `HTTP 502` if LLM returns invalid JSON
- `pdf_parser.py` falls back to `sample_data/` JSON if parsing fails
- All Pydantic models validate request bodies → `HTTP 422` on bad input
- Frontend displays inline error messages on API failure

## Security

- GROQ_API_KEY stored in `.env` (excluded from git via `.gitignore`)
- pydantic-settings validates env at startup
- CORS restricted to `localhost:3000` and `localhost:5173`

## Scalability

- FastAPI is async-capable; can add `async def` endpoints for true concurrency
- Groq API has production SLA available (upgrade from free tier)
- React frontend is a static build — deployable to any CDN
- No database required — stateless per-request design
