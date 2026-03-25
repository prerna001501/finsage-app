from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
import json
from backend.llm_client import chat_structured
from backend.prompts import tax_prompts
from backend.services.tax_calculator import calculate_old_regime, calculate_new_regime, compare_regimes
from backend.services.pdf_parser import parse_form16

router = APIRouter()

@router.post("/tax-wizard/analyze")
async def analyze_tax(
    use_sample: bool = Form(False),
    gross_salary: float = Form(0),
    hra_received: float = Form(0),
    rent_paid: float = Form(0),
    city_metro: bool = Form(False),
    section_80c: float = Form(0),
    section_80d: float = Form(0),
    section_80ccd_nps: float = Form(0),
    home_loan_interest: float = Form(0),
    form16_pdf: Optional[UploadFile] = File(None),
):
    if use_sample or form16_pdf:
        if form16_pdf:
            pdf_bytes = await form16_pdf.read()
            form16_data = parse_form16(pdf_bytes)
        else:
            from pathlib import Path
            sample_path = Path(__file__).parent.parent / "sample_data" / "sample_form16.json"
            with open(sample_path) as f:
                form16_data = json.load(f)
        gross_salary = form16_data.get("gross_salary", gross_salary)
        hra_received = form16_data.get("hra_received", hra_received)
        rent_paid = form16_data.get("rent_paid", rent_paid)
        city_metro = form16_data.get("city_metro", city_metro)
        section_80c = form16_data.get("section_80c_invested", section_80c)
        section_80d = form16_data.get("section_80d_paid", section_80d)
        missed_deductions_hint = form16_data.get("missed_deductions", [])
    else:
        missed_deductions_hint = []

    old = calculate_old_regime(gross_salary, hra_received, rent_paid, city_metro, section_80c, section_80d, section_80ccd_nps, home_loan_interest)
    new = calculate_new_regime(gross_salary)
    comparison = compare_regimes(old, new)

    user_prompt = f"""Tax Analysis for FY 2024-25:
Gross Salary: ₹{gross_salary:,.0f}
HRA Received: ₹{hra_received:,.0f}, Rent Paid: ₹{rent_paid:,.0f}, Metro City: {city_metro}
80C Invested: ₹{section_80c:,.0f} (shortfall: ₹{max(0, 150000-section_80c):,.0f})
80D Premium: ₹{section_80d:,.0f}
NPS (80CCD 1B): ₹{section_80ccd_nps:,.0f}
Home Loan Interest: ₹{home_loan_interest:,.0f}

OLD REGIME: Taxable Income ₹{old['taxable_income']:,.0f}, Tax ₹{old['total_tax']:,.0f} ({old['effective_rate']}%)
NEW REGIME: Taxable Income ₹{new['taxable_income']:,.0f}, Tax ₹{new['total_tax']:,.0f} ({new['effective_rate']}%)
Recommended: {comparison['recommended'].upper()} regime saves ₹{comparison['savings']:,.0f}

Known missed deductions: {json.dumps(missed_deductions_hint)}

Provide missed deductions analysis and investment suggestions to minimize tax."""

    llm_result = chat_structured(tax_prompts.SYSTEM, user_prompt, tax_prompts.SCHEMA)

    return {
        "old_regime": old,
        "new_regime": new,
        "comparison": comparison,
        "gross_salary": gross_salary,
        **llm_result,
    }
