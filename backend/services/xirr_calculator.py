"""XIRR calculator using pure Python Newton-Raphson — no scipy needed."""
from datetime import date


def xirr(cashflows: list[dict]) -> float:
    """
    Calculate XIRR.
    cashflows: list of {"date": "YYYY-MM-DD", "amount": float}
    Negative = investment (outflow), positive = redemption/current value.
    Returns annualized rate as percentage (e.g. 14.5 for 14.5%).
    """
    if not cashflows or len(cashflows) < 2:
        return 0.0

    dates = [date.fromisoformat(cf["date"]) for cf in cashflows]
    amounts = [cf["amount"] for cf in cashflows]
    base_date = dates[0]
    years = [(d - base_date).days / 365.0 for d in dates]

    def npv(rate):
        if rate <= -1:
            return float("inf")
        return sum(a / ((1 + rate) ** t) for a, t in zip(amounts, years))

    def npv_deriv(rate):
        if rate <= -1:
            return 0.0
        return sum(-t * a / ((1 + rate) ** (t + 1)) for a, t in zip(amounts, years))

    rate = 0.1
    for guess in [0.1, 0.2, 0.5, -0.1, 0.01]:
        rate = guess
        for _ in range(200):
            f = npv(rate)
            df = npv_deriv(rate)
            if abs(df) < 1e-12:
                break
            new_rate = rate - f / df
            new_rate = max(-0.999, min(new_rate, 100.0))
            if abs(new_rate - rate) < 1e-8:
                rate = new_rate
                break
            rate = new_rate
        if abs(npv(rate)) < 1e-4:
            return round(rate * 100, 2)

    return round(rate * 100, 2)
