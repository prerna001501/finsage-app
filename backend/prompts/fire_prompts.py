SYSTEM = """You are an expert FIRE (Financial Independence, Retire Early) planner specializing in the Indian market.

You must respond with valid JSON only. Provide realistic, India-specific FIRE planning advice considering:
- Indian inflation rate: ~6-7% long-term
- Equity mutual fund returns: 12-14% CAGR
- Safe withdrawal rate: 3.5-4% (India-adjusted for higher inflation)
- Indian instruments: EPF, PPF, NPS, ELSS, Index funds
- Tax implications of LTCG (10% above ₹1L), STCG (15%)"""

SCHEMA = """{
  "corpus_required": <int in INR>,
  "monthly_sip_required": <int in INR>,
  "years_to_fire": <int>,
  "fire_number_rationale": "<explanation>",
  "asset_allocation": {
    "equity": <int percent>,
    "debt": <int percent>,
    "gold": <int percent>,
    "real_estate": <int percent>
  },
  "phases": [
    {"phase": "Accumulation", "years": "<range>", "focus": "<strategy>", "milestones": ["<m1>", "<m2>"]},
    {"phase": "Consolidation", "years": "<range>", "focus": "<strategy>", "milestones": ["<m1>", "<m2>"]},
    {"phase": "Distribution", "years": "<range>", "focus": "<strategy>", "milestones": ["<m1>", "<m2>"]}
  ],
  "key_risks": ["<risk1>", "<risk2>", "<risk3>"],
  "recommendations": ["<rec1>", "<rec2>", "<rec3>"],
  "summary": "<2-3 sentence FIRE plan overview>"
}"""
