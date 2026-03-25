from fastapi import APIRouter
from pydantic import BaseModel
from backend.llm_client import chat_structured
from backend.prompts import fire_prompts
from backend.services.sip_projector import project_corpus, calculate_required_sip

router = APIRouter()

class FirePlannerRequest(BaseModel):
    current_age: int
    fire_age: int
    monthly_income: float
    monthly_expenses: float
    current_corpus: float = 0
    monthly_sip: float = 0
    annual_return_pct: float = 12.0
    inflation_rate: float = 6.5
    monthly_retirement_expenses: float = 0

@router.post("/fire-planner/generate")
def generate_fire_plan(req: FirePlannerRequest):
    years_to_fire = req.fire_age - req.current_age
    monthly_retirement_exp = req.monthly_retirement_expenses or req.monthly_expenses * 0.7
    annual_expenses_at_fire = monthly_retirement_exp * 12 * ((1 + req.inflation_rate/100) ** years_to_fire)
    corpus_required = annual_expenses_at_fire / 0.04  # 4% safe withdrawal rate

    required_sip = calculate_required_sip(corpus_required, req.current_corpus, years_to_fire, req.annual_return_pct)
    corpus_projection = project_corpus(req.current_age, req.fire_age, req.current_corpus, req.monthly_sip or required_sip, req.annual_return_pct)

    user_prompt = f"""FIRE Planning Request:
- Current Age: {req.current_age}, Target FIRE Age: {req.fire_age} ({years_to_fire} years)
- Monthly Income: ₹{req.monthly_income:,.0f}
- Current Monthly Expenses: ₹{req.monthly_expenses:,.0f}
- Estimated Monthly Expenses at Retirement: ₹{monthly_retirement_exp:,.0f} today (inflation-adjusted to ₹{annual_expenses_at_fire/12:,.0f}/month at FIRE age)
- Current Corpus: ₹{req.current_corpus:,.0f}
- Corpus Required (4% SWR): ₹{corpus_required:,.0f}
- Required Monthly SIP: ₹{required_sip:,.0f}
- Current Monthly SIP: ₹{req.monthly_sip:,.0f}
- Annual Return Assumption: {req.annual_return_pct}% CAGR
- Inflation: {req.inflation_rate}%

Provide a comprehensive FIRE roadmap with phases, asset allocation, and key risks."""

    result = chat_structured(fire_prompts.SYSTEM, user_prompt, fire_prompts.SCHEMA)
    result["corpus_required"] = round(corpus_required)
    result["monthly_sip_required"] = required_sip
    result["corpus_projection"] = corpus_projection
    result["years_to_fire"] = years_to_fire
    return result
