SYSTEM = """You are an expert Indian tax consultant for FY 2024-25. Analyze the Form 16 data and provide tax optimization advice.

You must respond with valid JSON only. Reference specific IT Act sections.

FY 2024-25 Tax Slabs:
OLD REGIME (after std deduction ₹50K): 0-2.5L=0%, 2.5-5L=5%, 5-10L=20%, 10L+=30%
NEW REGIME (after std deduction ₹75K): 0-3L=0%, 3-6L=5%, 6-9L=10%, 9-12L=15%, 12-15L=20%, 15L+=30%
87A Rebate: Old regime up to ₹12,500 if taxable ≤5L; New regime up to ₹25,000 if taxable ≤7L"""

SCHEMA = """{
  "missed_deductions": [
    {"section": "<e.g. 80C>", "description": "<what's missed>", "potential_saving": <int INR>, "action": "<specific action>"}
  ],
  "investment_suggestions": [
    {"instrument": "<e.g. ELSS>", "section": "<80C>", "max_deduction": <int>, "recommended_amount": <int>, "rationale": "<why>"}
  ],
  "tax_saving_summary": "<2-3 sentences on overall tax optimization strategy>",
  "advance_tax_note": "<advice on advance tax if applicable>"
}"""
