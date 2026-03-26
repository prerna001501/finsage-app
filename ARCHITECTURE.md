# FinSage — Architecture Document
## ET AI Hackathon 2026 · Track 9: AI Money Mentor

---

## 1. System Overview

FinSage is built on a **5-agent pipeline architecture** where each agent has a single, well-defined responsibility. Agents communicate through structured data contracts — no agent interprets raw user input, and no agent makes financial calculations. This separation prevents hallucination, ensures regulatory compliance, and makes every output independently verifiable.

```
+-------------------------------------------------------------------------+
|                        USER BROWSER (React/Vite)                        |
|  Feature Pages: Health Score · FIRE · Tax · Portfolio · Life · Couple   |
|  AgentPipeline UI -- shows users the 4-step reasoning in real time      |
+--------------------------------+----------------------------------------+
                                 |  HTTPS / Vercel proxy (no CORS)
                                 v
+-------------------------------------------------------------------------+
|                    FINSAGE PIPELINE ORCHESTRATOR                        |
|              FastAPI · 7 routers · Python 3.11 · Render cloud           |
|                                                                         |
|  +----------+   +--------------+   +---------------+   +------------+  |
|  | AGENT 1  |-->|   AGENT 2    |-->|    AGENT 3    |-->|  AGENT 4   |  |
|  |  Input & |   | Quantitative |   |  Regulatory   |   |  Advisory  |  |
|  |Validation|   |   Analysis   |   |   Context     |   |    LLM     |  |
|  |          |   |    Agent     |   |    Agent      |   |   Agent    |  |
|  +----------+   +--------------+   +---------------+   +------------+  |
|                                                               v         |
|                       +-------------------------------+                 |
|                       |  AGENT 5: Compliance Guard    |                 |
|                       |  SEBI boundary enforcement    |                 |
|                       +-------------------------------+                 |
+-------------------------------------------------------------------------+
                                 |
                                 v
               +-----------------------------------+
               |       Groq Cloud · Free Tier      |
               |   llama-3.3-70b-versatile (Meta)  |
               |       Open-Source License         |
               +-----------------------------------+
```

---

## 2. Agent Roles & Responsibilities

### Agent 1 — Input & Validation Agent (`pdf_parser.py` + Pydantic models)

**Responsibility:** Accept any input format and produce a normalized financial profile.

| Input | Processing | Output |
|-------|-----------|--------|
| Form 16 PDF upload | pdfplumber text extraction + regex patterns for salary components | Normalized dict: gross_salary, HRA, 80C, 80D… |
| CAMS statement PDF | Table extraction + transaction parsing | List of transactions: fund, date, units, NAV |
| Manual form entry | Pydantic BaseModel validation | Validated Python dict |
| `use_sample=true` | Load from `sample_data/*.json` | Same normalized dict |

**Fallback logic:** If PDF parsing fails (scanned PDF, unusual format), the agent falls back gracefully to `sample_data/` JSON and signals the downstream agents. This ensures the pipeline never hard-fails on a bad upload.

---

### Agent 2 — Quantitative Analysis Agent (`services/`)

**Responsibility:** Run all deterministic financial mathematics. This agent never calls the LLM. Numbers are computed using exact formulas from Indian law and finance standards.

| Service | Method | Accuracy Basis |
|---------|--------|---------------|
| `tax_calculator.py` | `calculate_old_regime()` | IT Act FY 2024-25 exact slabs (0/5/20/30%), §80C max ₹1.5L, §80D max ₹50K, §24(b) max ₹2L, §87A rebate, 4% cess |
| `tax_calculator.py` | `calculate_new_regime()` | New regime slabs (0/5/10/15/20/30%), ₹75K std deduction, §87A rebate up to ₹7L |
| `xirr_calculator.py` | Pure Python Newton-Raphson | Iterates cashflow NPV = 0 with multiple starting guesses; annualized rate per SEBI XIRR definition. No scipy dependency. |
| `sip_projector.py` | Month-by-month FV | Standard compound interest, inflation-adjusted corpus at retirement |
| `portfolio_analyzer.py` | Jaccard similarity | Top-10 holdings overlap per fund; weighted expense ratio drag |

**Output contract:** A `facts_bundle` dict with all computed numbers — passed as pre-computed context to Agent 3. The LLM sees only verified numbers, never raw inputs.

**Why this matters (Scenario 2 compliance):** The step-by-step `calculation_steps[]` array from the tax calculator provides full traceable logic to the frontend. Judges can verify every deduction against the IT Act.

---

### Agent 3 — Regulatory Context Agent (`prompts/`)

**Responsibility:** Construct the LLM prompt with the appropriate Indian regulatory context for the feature. This agent encodes domain expertise as structured prompt templates.

Each feature has a dedicated system prompt that embeds:

- **Tax Wizard** (`tax_prompts.py`): FY 2024-25 old/new regime slab tables verbatim, §80C/80D/80CCD sections, §10(13A) HRA formula
- **Health Score** (`health_score_prompts.py`): SEBI-aligned financial health benchmarks (6-month emergency fund, 10x life cover, debt-to-income < 40%)
- **FIRE Planner** (`fire_prompts.py`): 4% Safe Withdrawal Rate, inflation-adjusted corpus formula, AMFI asset allocation guidelines
- **Portfolio X-Ray** (`portfolio_prompts.py`): SEBI direct vs regular plan rules, LTCG/STCG tax implications for rebalancing
- **Life Events** (`life_event_prompts.py`): Event-specific IT Act implications (Section 54 for property, gratuity exemptions, NPS partial withdrawal rules)
- **Couple Planner** (`couple_prompts.py`): HRA exemption formula per §10(13A) for each partner, joint NPS benefit under §80CCD(1B)

**Output contract:** A `(system_prompt, user_message)` tuple passed to Agent 4. The user message contains the `facts_bundle` from Agent 2 formatted as structured text.

---

### Agent 4 — Advisory Intelligence Agent (Llama 3.3 70B via Groq)

**Responsibility:** Generate personalised, actionable advice based on pre-computed facts and regulatory context. The LLM is never asked to do arithmetic.

**Model:** `llama-3.3-70b-versatile` — Meta's open-source Llama 3.3 (70B parameters). Running on Groq's LPU inference for ~500ms response time.

**Why open-source:** Satisfies hackathon extra-credit criterion ("cost-efficient architectures, open-source models"). No OpenAI/Anthropic vendor lock-in. Can be self-hosted on a single A100 GPU for ₹0 marginal cost at scale.

**Structured output pattern:**
```python
# llm_client.py — chat_structured()
# 1. Append JSON schema to system prompt
# 2. Call Groq API (temperature=0.1 for consistency)
# 3. Strip markdown code fences
# 4. Parse JSON — 3 fallback attempts:
#    Attempt 1: json.loads() (strict)
#    Attempt 2: manual escape repair (_repair_json)
#    Attempt 3: json-repair library (handles truncated JSON)
# 5. Raise HTTP 502 with raw preview if all fail
```

**What LLM produces (never computes):**
- Missed deductions identification and specific recovery actions
- Investment recommendations ranked by risk profile and liquidity
- FIRE roadmap phases with milestones
- Rebalancing plan with fund-level specificity and LTCG tax context
- Life event 30/60/90-day action plans
- Health score insights and priority actions

---

### Agent 5 — Compliance Guardrail Agent (`Disclaimer.tsx` + system prompts)

**Responsibility:** Enforce SEBI boundary on every output. Prevent any output from being construed as licensed investment advice.

**Implementation — two layers:**

1. **LLM-level guardrail:** Every system prompt contains:
   > *"You are an AI-powered financial education tool. You do NOT provide SEBI-registered investment advice. Always frame recommendations as educational guidance. Never make specific buy/sell recommendations for individual stocks."*

2. **UI-level guardrail:** `Disclaimer.tsx` renders on every feature page:
   > *"SEBI Compliance Guardrail: FinSage provides AI-generated educational guidance only. It is not a SEBI-registered investment advisor..."*

**Agentic architecture requirement met:** The judges specifically require *"Agents must include a clear disclaimer guardrail distinguishing AI guidance from licensed financial advice."* — implemented at both the LLM prompt level and the UI rendering level.

---

## 3. Orchestration Pattern

Each FastAPI router acts as the **pipeline orchestrator** for one feature:

```
Router receives request
  ↓
Agent 1: Normalize input (PDF → dict, or validate Pydantic model)
  ↓
Agent 2: Run deterministic calculations (tax slabs, XIRR, SIP math)
  ↓
Agent 3: Build regulatory-aware prompt (embed facts + regulatory context)
  ↓
Agent 4: Call Llama 3.3 70B → parse structured JSON response
  ↓
Agent 5: Merge calculated facts + LLM advice → return with SEBI context
  ↓
Return combined response to frontend
```

**Error recovery at each step:**
- Agent 1 failure: Fall back to sample data (no hard failure)
- Agent 2 failure: HTTP 422 with specific validation error
- Agent 4 failure: 3-attempt JSON repair; HTTP 502 with diagnostic info on final failure
- All errors: Frontend displays inline error message; user can retry

---

## 4. Scenario Coverage

All 3 shared scenario pack scenarios from Track 9 are implemented and testable:

### Scenario 2 — Tax Regime Optimisation (Edge Case) ✅

Input: ₹18L salary, ₹3.6L HRA, ₹1.5L 80C, ₹50K NPS, ₹40K home loan interest

Agent pipeline execution:
1. **Agent 1** validates inputs
2. **Agent 2** runs `calculate_old_regime()` with exact §10(13A) HRA formula and all deductions → `calculation_steps[]` with 11 labeled line items
3. **Agent 2** runs `calculate_new_regime()` with ₹75K std deduction only
4. **Agent 3** injects full slab tables into prompt so LLM cannot hallucinate tax rates
5. **Agent 4** identifies missed deductions and ranks investment suggestions
6. **Frontend** renders collapsible step-by-step trace — fully verifiable against IT Act

### Scenario 1 — FIRE Plan for Mid-Career Professional ✅

`sip_projector.py` generates month-by-month corpus array. Any input change triggers full re-run (<200ms). SipGrowthChart re-renders with updated projection.

### Scenario 3 — MF Portfolio X-Ray with Overlap ✅

`xirr_calculator.py` runs Newton-Raphson on all transactions. `portfolio_analyzer.py` computes pairwise Jaccard overlap on top-10 holdings. LLM rebalancing plan includes LTCG tax context (holds > 1 year = 10% vs < 1 year = 15%).

---

## 5. Agentic Pipeline UI

Every feature page renders a real-time **AgentPipeline** component that shows users which of the 4 agent steps is currently running:

```
🤖 AI Agent Pipeline
✓  Step 1: Collecting inputs          (completed — green)
►  Step 2: Running calculations       (active — orange pulse)
   Step 3: Applying regulatory rules  (pending — grey)
   Step 4: Generating action plan     (pending — grey)
```

This makes the multi-agent architecture visible to judges during the demo, satisfying the "clear orchestration pattern" requirement.

---

## 6. Technology Stack

| Layer | Technology | Choice Rationale |
|-------|-----------|-----------------|
| LLM | Llama 3.3 70B (Meta, open-source) via Groq API | Open-source → extra credit; Groq LPU = ~500ms latency; free tier viable |
| Backend | FastAPI + Python 3.11 | Async-ready, auto OpenAPI docs, Pydantic validation |
| Math engine | Pure Python Newton-Raphson XIRR + exact IT Act slab logic | No LLM hallucination risk on numbers; no scipy dependency |
| PDF parsing | pdfplumber | Indian tax document layouts; regex-based field extraction |
| JSON repair | json-repair library | 3-level fallback prevents hard failures on LLM output |
| Frontend | React 19 + Vite + Tailwind | Fast builds, static CDN deployment |
| Charts | Recharts | RadarChart, AreaChart, PieChart — all India-specific financial data |
| Deployment | Render (backend) + Vercel (frontend) | Zero-cost, auto-deploy from GitHub |
| Agent framework | Custom (no LangGraph/CrewAI) | Simpler, faster, no framework overhead; pipeline pattern fits the domain |

---

## 7. Enterprise Readiness

| Concern | Implementation |
|---------|---------------|
| SEBI compliance | Dual guardrails: LLM system prompt + UI disclaimer on every page |
| No hallucinated numbers | All calculations in Python; LLM receives only pre-computed facts |
| Graceful degradation | PDF parse failure → sample data; LLM failure → HTTP 502 with diagnostic |
| Input validation | Pydantic models reject malformed requests with structured 422 errors |
| Secret management | `GROQ_API_KEY` in `.env` (git-ignored); `pydantic-settings` validates at startup |
| Auditability | `calculation_steps[]` array in every tax response — fully verifiable output |
| Stateless design | No database required; each request is fully self-contained |
| Scalability | FastAPI → async endpoints; Groq → production SLA on upgrade |
