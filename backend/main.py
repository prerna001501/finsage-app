from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import get_settings
from backend.routers import health_score, fire_planner, tax_wizard, portfolio_xray, life_events, couple_planner, chat

settings = get_settings()

app = FastAPI(title="FinSage API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(health_score.router, prefix="/api/v1")
app.include_router(fire_planner.router, prefix="/api/v1")
app.include_router(tax_wizard.router, prefix="/api/v1")
app.include_router(portfolio_xray.router, prefix="/api/v1")
app.include_router(life_events.router, prefix="/api/v1")
app.include_router(couple_planner.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")

@app.get("/api/v1/health")
def health():
    return {"status": "ok", "model": settings.model_name, "version": "2.0.0"}
