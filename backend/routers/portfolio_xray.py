from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from backend.llm_client import chat_structured
from backend.prompts import portfolio_prompts
from backend.services.xirr_calculator import xirr
from backend.services.portfolio_analyzer import analyze_overlap, calculate_expense_drag
from backend.services.pdf_parser import parse_cams_statement
import json
from pathlib import Path

router = APIRouter()

@router.post("/portfolio-xray/analyze")
async def analyze_portfolio(
    use_sample: bool = Form(False),
    cams_pdf: Optional[UploadFile] = File(None),
):
    sample_path = Path(__file__).parent.parent / "sample_data" / "sample_portfolio.json"
    with open(sample_path) as f:
        sample_data = json.load(f)

    if use_sample or not cams_pdf:
        holdings = sample_data["holdings"]
        transactions = sample_data["transactions"]
    else:
        pdf_bytes = await cams_pdf.read()
        transactions = parse_cams_statement(pdf_bytes)
        holdings = sample_data["holdings"]  # fallback for holdings

    # XIRR calculation
    cashflows = [
        {"date": t["date"], "amount": t["amount"]}
        for t in transactions
        if t.get("type") in ("purchase", "current_value", None)
    ]
    xirr_value = xirr(cashflows)

    fund_names = [h["fund_name"] for h in holdings]
    overlap = analyze_overlap(fund_names)
    expense_analysis = calculate_expense_drag(holdings)

    total_value = sum(h["current_value"] for h in holdings)
    total_invested = sum(h["invested"] for h in holdings)
    absolute_return = round((total_value - total_invested) / total_invested * 100, 2) if total_invested > 0 else 0

    user_prompt = f"""Portfolio Analysis:
Total Invested: ₹{total_invested:,.0f}
Current Value: ₹{total_value:,.0f}
Absolute Return: {absolute_return}%
XIRR (Annualized): {xirr_value}%

Holdings:
{json.dumps(holdings, indent=2)}

Overlap Analysis:
{json.dumps(overlap, indent=2)}

Expense Analysis:
- Annual Expense Drag: ₹{expense_analysis['total_annual_expense']:,.0f}
- Savings if Direct Plans: ₹{expense_analysis['savings_if_direct']:,.0f}
- Effective Expense Ratio: {expense_analysis['effective_expense_ratio']}%

Provide portfolio rating, key issues, and actionable rebalancing plan."""

    llm_result = chat_structured(portfolio_prompts.SYSTEM, user_prompt, portfolio_prompts.SCHEMA)

    return {
        "xirr": xirr_value,
        "total_invested": total_invested,
        "total_current_value": total_value,
        "absolute_return": absolute_return,
        "holdings": holdings,
        "overlap_analysis": overlap,
        "expense_analysis": expense_analysis,
        **llm_result,
    }
