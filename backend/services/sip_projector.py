"""Monthly SIP corpus projector."""

def project_corpus(
    current_age: int,
    fire_age: int,
    current_corpus: float,
    monthly_sip: float,
    annual_return_pct: float = 12.0,
    annual_step_up_pct: float = 10.0,
) -> list[dict]:
    """
    Project corpus growth year by year.
    Returns list of {year, age, corpus, invested} dicts.
    """
    monthly_rate = annual_return_pct / 100 / 12
    years = fire_age - current_age
    results = []
    corpus = current_corpus
    sip = monthly_sip
    total_invested = current_corpus

    for year in range(1, years + 1):
        # 12 months of SIP with compounding
        for month in range(12):
            corpus = corpus * (1 + monthly_rate) + sip
            total_invested += sip
        # Step up SIP annually
        sip = sip * (1 + annual_step_up_pct / 100)
        results.append({
            "year": current_age + year,
            "age": current_age + year,
            "corpus": round(corpus),
            "invested": round(total_invested),
        })

    return results


def calculate_required_sip(
    target_corpus: float,
    current_corpus: float,
    years: int,
    annual_return_pct: float = 12.0,
) -> float:
    """Calculate monthly SIP needed to reach target corpus."""
    if years <= 0:
        return 0
    monthly_rate = annual_return_pct / 100 / 12
    months = years * 12
    # FV of current corpus
    fv_current = current_corpus * ((1 + monthly_rate) ** months)
    remaining = target_corpus - fv_current
    if remaining <= 0:
        return 0
    # PMT formula: remaining = sip * [((1+r)^n - 1) / r]
    fv_factor = ((1 + monthly_rate) ** months - 1) / monthly_rate
    sip = remaining / fv_factor
    return round(sip)
