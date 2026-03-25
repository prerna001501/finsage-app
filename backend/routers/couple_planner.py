from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from backend.llm_client import chat_structured
from backend.prompts import couple_prompts

router = APIRouter()

class PartnerFinancials(BaseModel):
    name: str
    age: int
    monthly_income: float
    monthly_expenses: float
    existing_investments: float = 0
    life_insurance_cover: float = 0
    hra_received: float = 0
    rent_paid: float = 0
    city_metro: bool = False
    section_80c_used: float = 0
    nps_contribution: float = 0

class JointGoal(BaseModel):
    name: str
    target_amount: float
    target_years: int

class CouplePlannerRequest(BaseModel):
    partner_a: PartnerFinancials
    partner_b: PartnerFinancials
    joint_goals: list[JointGoal] = []
    has_children: bool = False
    home_loan_outstanding: float = 0

@router.post("/couple-planner/optimize")
def optimize_couple_plan(req: CouplePlannerRequest):
    pa = req.partner_a
    pb = req.partner_b
    combined_income = pa.monthly_income + pb.monthly_income
    combined_expenses = pa.monthly_expenses + pb.monthly_expenses
    combined_investments = pa.existing_investments + pb.existing_investments

    user_prompt = f"""Couple's Financial Optimization:

Partner A ({pa.name}):
- Age: {pa.age}, Monthly Income: ₹{pa.monthly_income:,.0f}
- Monthly Expenses: ₹{pa.monthly_expenses:,.0f}
- Existing Investments: ₹{pa.existing_investments:,.0f}
- Life Insurance: ₹{pa.life_insurance_cover:,.0f}
- HRA Received: ₹{pa.hra_received:,.0f}, Rent Paid: ₹{pa.rent_paid:,.0f}, Metro: {pa.city_metro}
- 80C Used: ₹{pa.section_80c_used:,.0f}, NPS: ₹{pa.nps_contribution:,.0f}

Partner B ({pb.name}):
- Age: {pb.age}, Monthly Income: ₹{pb.monthly_income:,.0f}
- Monthly Expenses: ₹{pb.monthly_expenses:,.0f}
- Existing Investments: ₹{pb.existing_investments:,.0f}
- Life Insurance: ₹{pb.life_insurance_cover:,.0f}
- HRA Received: ₹{pb.hra_received:,.0f}, Rent Paid: ₹{pb.rent_paid:,.0f}, Metro: {pb.city_metro}
- 80C Used: ₹{pb.section_80c_used:,.0f}, NPS: ₹{pb.nps_contribution:,.0f}

Combined Profile:
- Joint Monthly Income: ₹{combined_income:,.0f}
- Joint Monthly Expenses: ₹{combined_expenses:,.0f}
- Combined Investments: ₹{combined_investments:,.0f}
- Has Children: {req.has_children}
- Home Loan Outstanding: ₹{req.home_loan_outstanding:,.0f}

Joint Goals:
{chr(10).join([f"- {g.name}: ₹{g.target_amount:,.0f} in {g.target_years} years" for g in req.joint_goals]) if req.joint_goals else "- No specific goals defined yet"}

Provide optimal joint financial plan with HRA optimization, NPS strategy, SIP split, and insurance review."""

    return chat_structured(couple_prompts.SYSTEM, user_prompt, couple_prompts.SCHEMA)
