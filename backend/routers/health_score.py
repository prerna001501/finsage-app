from fastapi import APIRouter
from pydantic import BaseModel
from backend.llm_client import chat_structured
from backend.prompts import health_score_prompts

router = APIRouter()

class HealthScoreRequest(BaseModel):
    age: int
    monthly_income: float
    monthly_expenses: float
    emergency_fund: float
    monthly_investments: float
    existing_debt_emi: float
    total_assets: float
    life_insurance_cover: float = 0
    health_insurance_cover: float = 0
    retirement_corpus: float = 0
    section_80c_used: float = 0
    section_80d_used: float = 0

@router.post("/health-score/calculate")
def calculate_health_score(req: HealthScoreRequest):
    monthly_savings_rate = (req.monthly_income - req.monthly_expenses) / req.monthly_income * 100 if req.monthly_income > 0 else 0
    investment_rate = req.monthly_investments / req.monthly_income * 100 if req.monthly_income > 0 else 0
    emergency_months = req.emergency_fund / req.monthly_expenses if req.monthly_expenses > 0 else 0
    emi_to_income = req.existing_debt_emi / req.monthly_income * 100 if req.monthly_income > 0 else 0
    recommended_life_cover = req.monthly_income * 12 * 10

    user_prompt = f"""Financial Profile:
- Age: {req.age} years
- Monthly Income: ₹{req.monthly_income:,.0f}
- Monthly Expenses: ₹{req.monthly_expenses:,.0f}
- Monthly Investments: ₹{req.monthly_investments:,.0f}
- Investment Rate: {investment_rate:.1f}%
- Emergency Fund: ₹{req.emergency_fund:,.0f} ({emergency_months:.1f} months of expenses)
- Total Assets: ₹{req.total_assets:,.0f}
- Existing EMIs: ₹{req.existing_debt_emi:,.0f}/month ({emi_to_income:.1f}% of income)
- Life Insurance Cover: ₹{req.life_insurance_cover:,.0f} (recommended: ₹{recommended_life_cover:,.0f})
- Health Insurance: ₹{req.health_insurance_cover:,.0f}
- Retirement Corpus Saved: ₹{req.retirement_corpus:,.0f}
- 80C Used: ₹{req.section_80c_used:,.0f} (max ₹1,50,000)
- 80D Used: ₹{req.section_80d_used:,.0f} (max ₹50,000)

Provide a comprehensive Money Health Score with 6 dimension scores and top 3 action priorities."""

    result = chat_structured(health_score_prompts.SYSTEM, user_prompt, health_score_prompts.SCHEMA)
    return result
