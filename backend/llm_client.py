import json
import re
from groq import Groq
from fastapi import HTTPException
from json_repair import repair_json
from backend.config import get_settings

settings = get_settings()

def get_client():
    return Groq(api_key=settings.groq_api_key)

def chat(system: str, user: str) -> str:
    """Simple chat completion returning raw string."""
    client = get_client()
    response = client.chat.completions.create(
        model=settings.model_name,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        temperature=0,
        max_tokens=8192,
    )
    return response.choices[0].message.content

def _extract_json(raw: str) -> str:
    """Strip markdown fences and extract the outermost JSON object."""
    raw = raw.strip()
    # Remove markdown code blocks
    if raw.startswith("```"):
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```\s*$", "", raw)
        raw = raw.strip()
    # Find outermost { ... }
    start = raw.find("{")
    if start == -1:
        return raw
    depth = 0
    for i, ch in enumerate(raw[start:], start):
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return raw[start:i + 1]
    return raw[start:]

def _repair_json(raw: str) -> str:
    """Best-effort repair: replace unescaped newlines inside strings."""
    # Replace literal newlines inside quoted strings with \n
    result = []
    in_string = False
    escaped = False
    for ch in raw:
        if escaped:
            result.append(ch)
            escaped = False
        elif ch == "\\":
            result.append(ch)
            escaped = True
        elif ch == '"':
            result.append(ch)
            in_string = not in_string
        elif in_string and ch == "\n":
            result.append("\\n")
        elif in_string and ch == "\r":
            result.append("\\r")
        else:
            result.append(ch)
    return "".join(result)

def chat_structured(system: str, user: str, schema_hint: str) -> dict:
    """Chat completion that returns parsed JSON dict."""
    system_with_schema = (
        f"{system}\n\n"
        "IMPORTANT: Respond ONLY with a single valid JSON object. "
        "No markdown, no code fences, no explanation before or after. "
        "All string values must have special characters properly escaped. "
        f"Match exactly this schema:\n{schema_hint}"
    )
    raw = chat(system_with_schema, user)
    extracted = _extract_json(raw)
    # First attempt: strict parse
    try:
        return json.loads(extracted)
    except json.JSONDecodeError:
        pass
    # Second attempt: manual repair
    try:
        return json.loads(_repair_json(extracted))
    except json.JSONDecodeError:
        pass
    # Third attempt: json-repair library
    try:
        repaired = repair_json(extracted, return_objects=True)
        if isinstance(repaired, dict):
            return repaired
    except Exception:
        pass
    raise HTTPException(
        status_code=502,
        detail=f"LLM returned unparseable JSON. Raw (first 500 chars): {extracted[:500]}"
    )
