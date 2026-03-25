from fastapi import APIRouter
from pydantic import BaseModel
from backend.llm_client import get_client
from backend.config import get_settings
from backend.prompts import chat_prompts

router = APIRouter()
settings = get_settings()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    question: str
    history: list[ChatMessage] = []

@router.post("/chat/ask")
def ask_chat(req: ChatRequest):
    client = get_client()
    messages = [{"role": "system", "content": chat_prompts.SYSTEM}]
    # Add recent history (last 6 messages for context)
    for msg in req.history[-6:]:
        messages.append({"role": msg.role, "content": msg.content})
    messages.append({"role": "user", "content": req.question})

    response = client.chat.completions.create(
        model=settings.model_name,
        messages=messages,
        temperature=0.4,
        max_tokens=1024,
    )
    return {"answer": response.choices[0].message.content}
