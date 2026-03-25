"""Portfolio analysis: overlap, expense ratio, benchmark comparison."""

POPULAR_FUNDS = {
    "Axis Bluechip Fund": {"category": "Large Cap", "expense_direct": 0.54, "expense_regular": 1.72},
    "Mirae Asset Large Cap": {"category": "Large Cap", "expense_direct": 0.51, "expense_regular": 1.63},
    "HDFC Mid-Cap Opportunities": {"category": "Mid Cap", "expense_direct": 0.79, "expense_regular": 1.83},
    "Nippon India Small Cap": {"category": "Small Cap", "expense_direct": 0.68, "expense_regular": 1.55},
    "Parag Parikh Flexi Cap": {"category": "Flexi Cap", "expense_direct": 0.63, "expense_regular": 1.58},
    "Mirae Asset Emerging Bluechip": {"category": "Large & Mid Cap", "expense_direct": 0.68, "expense_regular": 1.73},
    "SBI Small Cap Fund": {"category": "Small Cap", "expense_direct": 0.74, "expense_regular": 1.75},
    "Axis Small Cap Fund": {"category": "Small Cap", "expense_direct": 0.60, "expense_regular": 1.68},
    "ICICI Pru Bluechip Fund": {"category": "Large Cap", "expense_direct": 0.88, "expense_regular": 1.72},
    "Kotak Flexi Cap Fund": {"category": "Flexi Cap", "expense_direct": 0.56, "expense_regular": 1.67},
}

FUND_TOP_HOLDINGS = {
    "Axis Bluechip Fund": ["HDFC Bank", "ICICI Bank", "Infosys", "TCS", "Kotak Bank"],
    "Mirae Asset Large Cap": ["HDFC Bank", "ICICI Bank", "Infosys", "Reliance", "TCS"],
    "HDFC Mid-Cap Opportunities": ["Cholamandalam", "Persistent Systems", "Tube Investments", "Suzuki", "Mphasis"],
    "Nippon India Small Cap": ["KPIT Technologies", "Dixon Technologies", "Karur Vysya", "Laurus Labs", "Atul"],
    "Parag Parikh Flexi Cap": ["HDFC Bank", "ICICI Bank", "Coal India", "ITC", "Power Grid"],
    "Mirae Asset Emerging Bluechip": ["HDFC Bank", "ICICI Bank", "Axis Bank", "Bajaj Finance", "Infosys"],
    "SBI Small Cap Fund": ["Kalpataru Projects", "Blue Star", "Equitas Holdings", "Chalet Hotels", "NLC India"],
    "Axis Small Cap Fund": ["Carborundum Universal", "Krishna Institute", "Dodla Dairy", "Fine Organic", "Medplus"],
    "ICICI Pru Bluechip Fund": ["HDFC Bank", "ICICI Bank", "Infosys", "Reliance", "Larsen & Toubro"],
    "Kotak Flexi Cap Fund": ["HDFC Bank", "ICICI Bank", "Infosys", "TCS", "Axis Bank"],
}

BENCHMARK_RETURNS = {
    "Large Cap": {"1y": 8.5, "3y": 12.3, "5y": 14.1},
    "Mid Cap": {"1y": 16.2, "3y": 21.5, "5y": 23.8},
    "Small Cap": {"1y": 18.7, "3y": 24.1, "5y": 27.3},
    "Flexi Cap": {"1y": 12.4, "3y": 16.8, "5y": 18.5},
    "Large & Mid Cap": {"1y": 13.1, "3y": 18.2, "5y": 20.4},
}


def analyze_overlap(fund_names: list[str]) -> dict:
    """Compute pairwise overlap between funds based on top holdings."""
    overlaps = []
    for i in range(len(fund_names)):
        for j in range(i + 1, len(fund_names)):
            f1 = fund_names[i]
            f2 = fund_names[j]
            h1 = set(FUND_TOP_HOLDINGS.get(f1, []))
            h2 = set(FUND_TOP_HOLDINGS.get(f2, []))
            if h1 and h2:
                overlap_pct = round(len(h1 & h2) / len(h1 | h2) * 100, 1)
            else:
                overlap_pct = 0
            overlaps.append({"fund1": f1, "fund2": f2, "overlap_pct": overlap_pct, "high": overlap_pct > 30})
    return {"pairs": overlaps}


def calculate_expense_drag(holdings: list[dict]) -> dict:
    """
    holdings: [{"fund_name": str, "current_value": float, "plan": "direct"|"regular"}]
    Returns annual expense drag in rupees.
    """
    total_value = sum(h["current_value"] for h in holdings)
    total_expense = 0
    savings_if_direct = 0

    for h in holdings:
        fund_data = POPULAR_FUNDS.get(h["fund_name"], {"expense_direct": 0.5, "expense_regular": 1.5})
        plan = h.get("plan", "regular")
        expense_pct = fund_data["expense_regular"] if plan == "regular" else fund_data["expense_direct"]
        annual_drag = h["current_value"] * expense_pct / 100
        total_expense += annual_drag
        if plan == "regular":
            savings_if_direct += h["current_value"] * (fund_data["expense_regular"] - fund_data["expense_direct"]) / 100

    return {
        "total_annual_expense": round(total_expense),
        "savings_if_direct": round(savings_if_direct),
        "effective_expense_ratio": round(total_expense / total_value * 100, 2) if total_value > 0 else 0,
    }
