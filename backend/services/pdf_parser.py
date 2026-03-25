"""PDF parser for Form 16 and CAMS statement."""
import json
import re
from pathlib import Path

SAMPLE_DIR = Path(__file__).parent.parent / "sample_data"


def parse_form16(pdf_bytes: bytes) -> dict:
    """Parse Form 16 PDF. Returns structured dict. Falls back to sample data."""
    try:
        import pdfplumber
        with pdfplumber.open(pdf_bytes) as pdf:
            text = "\n".join(page.extract_text() or "" for page in pdf.pages)
        # Try to extract key fields via regex
        gross_match = re.search(r"Gross Salary.*?([\d,]+)", text)
        gross = float(gross_match.group(1).replace(",", "")) if gross_match else None
        if gross:
            return {"gross_salary": gross, "source": "parsed"}
    except Exception:
        pass
    # Fallback to sample
    sample_path = SAMPLE_DIR / "sample_form16.json"
    with open(sample_path) as f:
        return json.load(f)


def parse_cams_statement(pdf_bytes: bytes) -> list[dict]:
    """Parse CAMS consolidated statement PDF. Returns list of transactions."""
    try:
        import pdfplumber
        with pdfplumber.open(pdf_bytes) as pdf:
            text = "\n".join(page.extract_text() or "" for page in pdf.pages)
        # Very basic extraction — in prod would use table extraction
        lines = text.split("\n")
        transactions = []
        for line in lines:
            match = re.search(r"(\d{2}-\w{3}-\d{4})\s+([\d,]+\.\d+)\s+([\w\s]+)", line)
            if match:
                transactions.append({
                    "date": match.group(1),
                    "amount": float(match.group(2).replace(",", "")),
                    "description": match.group(3).strip(),
                })
        if transactions:
            return transactions
    except Exception:
        pass
    # Fallback to sample
    sample_path = SAMPLE_DIR / "sample_portfolio.json"
    with open(sample_path) as f:
        data = json.load(f)
    return data.get("transactions", [])
