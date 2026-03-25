from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from backend.llm_client import chat_structured
from backend.prompts import life_event_prompts

router = APIRouter()

LIFE_EVENTS = ["marriage", "baby", "job_change", "bonus", "retirement", "home_purchase"]

class LifeEventRequest(BaseModel):
    event_type: str  # one of LIFE_EVENTS
    monthly_income: float
    monthly_expenses: float
    current_savings: float
    event_amount: float = 0  # bonus amount, home price, etc.
    age: int = 30
    has_emergency_fund: bool = True
    existing_investments: float = 0
    partner_income: float = 0
    additional_context: Optional[str] = None

@router.post("/life-events/advise")
def advise_life_event(req: LifeEventRequest):
    event_labels = {
        "marriage": "Marriage",
        "baby": "New Baby",
        "job_change": "Job Change",
        "bonus": "Bonus/Windfall",
        "retirement": "Retirement",
        "home_purchase": "Home Purchase",
    }
    event_label = event_labels.get(req.event_type, req.event_type)

    user_prompt = f"""Life Event: {event_label}

Financial Snapshot:
- Age: {req.age}
- Monthly Income: ₹{req.monthly_income:,.0f}
- Monthly Expenses: ₹{req.monthly_expenses:,.0f}
- Current Savings: ₹{req.current_savings:,.0f}
- Existing Investments: ₹{req.existing_investments:,.0f}
- Emergency Fund: {"Yes" if req.has_emergency_fund else "No — urgent priority"}
- Partner Income: ₹{req.partner_income:,.0f}
{'- Event Amount: ₹' + f'{req.event_amount:,.0f}' if req.event_amount > 0 else ''}
{'- Additional Context: ' + req.additional_context if req.additional_context else ''}

Provide a comprehensive 30/60/90 day financial action plan for this life event."""

    return chat_structured(life_event_prompts.SYSTEM, user_prompt, life_event_prompts.SCHEMA)
