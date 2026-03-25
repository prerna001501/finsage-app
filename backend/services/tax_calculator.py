"""FY 2024-25 Indian Income Tax Calculator — Old vs New Regime."""

def calculate_old_regime(
    gross_salary: float,
    hra_received: float = 0,
    rent_paid: float = 0,
    city_metro: bool = False,
    section_80c: float = 0,
    section_80d: float = 0,
    section_80ccd_nps: float = 0,
    home_loan_interest: float = 0,
    other_deductions: float = 0,
) -> dict:
    """Old tax regime with all deductions."""
    # Standard deduction
    std_deduction = 50000

    # HRA exemption (least of three)
    if hra_received > 0 and rent_paid > 0:
        basic = gross_salary * 0.4  # approximate basic as 40% of gross
        hra_cap1 = hra_received
        hra_cap2 = rent_paid - (0.1 * basic)
        hra_cap3 = 0.5 * basic if city_metro else 0.4 * basic
        hra_exempt = max(0, min(hra_cap1, hra_cap2, hra_cap3))
    else:
        hra_exempt = 0

    # Section 80C — max 1.5L
    deduction_80c = min(section_80c, 150000)
    # Section 80D — max 25K self + 25K parents (simplified)
    deduction_80d = min(section_80d, 50000)
    # NPS 80CCD(1B) — extra 50K
    deduction_nps = min(section_80ccd_nps, 50000)
    # Home loan interest 24(b) — max 2L
    deduction_home_loan = min(home_loan_interest, 200000)

    taxable_income = (
        gross_salary
        - std_deduction
        - hra_exempt
        - deduction_80c
        - deduction_80d
        - deduction_nps
        - deduction_home_loan
        - other_deductions
    )
    taxable_income = max(0, taxable_income)

    tax = _old_regime_slab(taxable_income)
    cess = tax * 0.04
    total_tax = tax + cess

    return {
        "taxable_income": round(taxable_income),
        "tax_before_cess": round(tax),
        "cess": round(cess),
        "total_tax": round(total_tax),
        "effective_rate": round(total_tax / gross_salary * 100, 2) if gross_salary > 0 else 0,
        "deductions_claimed": round(
            std_deduction + hra_exempt + deduction_80c + deduction_80d + deduction_nps + deduction_home_loan + other_deductions
        ),
    }


def _old_regime_slab(taxable_income: float) -> float:
    """Old regime tax slabs FY 2024-25."""
    tax = 0
    if taxable_income <= 250000:
        tax = 0
    elif taxable_income <= 500000:
        tax = (taxable_income - 250000) * 0.05
    elif taxable_income <= 1000000:
        tax = 12500 + (taxable_income - 500000) * 0.20
    else:
        tax = 112500 + (taxable_income - 1000000) * 0.30
    # Section 87A rebate — if taxable <= 5L, rebate up to 12500
    if taxable_income <= 500000:
        tax = max(0, tax - 12500)
    return tax


def calculate_new_regime(gross_salary: float) -> dict:
    """New tax regime FY 2024-25 — standard deduction 75K, no other deductions."""
    std_deduction = 75000
    taxable_income = max(0, gross_salary - std_deduction)

    tax = _new_regime_slab(taxable_income)
    cess = tax * 0.04
    total_tax = tax + cess

    return {
        "taxable_income": round(taxable_income),
        "tax_before_cess": round(tax),
        "cess": round(cess),
        "total_tax": round(total_tax),
        "effective_rate": round(total_tax / gross_salary * 100, 2) if gross_salary > 0 else 0,
        "deductions_claimed": std_deduction,
    }


def _new_regime_slab(taxable_income: float) -> float:
    """New regime tax slabs FY 2024-25."""
    slabs = [
        (300000, 0),
        (600000, 0.05),
        (900000, 0.10),
        (1200000, 0.15),
        (1500000, 0.20),
        (float("inf"), 0.30),
    ]
    tax = 0
    prev = 0
    for limit, rate in slabs:
        if taxable_income <= prev:
            break
        slab_income = min(taxable_income, limit) - prev
        tax += slab_income * rate
        prev = limit
    # Section 87A rebate — if taxable <= 7L, rebate up to 25000
    if taxable_income <= 700000:
        tax = max(0, tax - 25000)
    return tax


def compare_regimes(old: dict, new: dict) -> dict:
    old_tax = old["total_tax"]
    new_tax = new["total_tax"]
    savings = old_tax - new_tax
    recommended = "new" if new_tax < old_tax else "old"
    return {
        "old_regime_tax": old_tax,
        "new_regime_tax": new_tax,
        "savings": abs(savings),
        "recommended": recommended,
        "savings_direction": "new regime saves more" if recommended == "new" else "old regime saves more",
    }
