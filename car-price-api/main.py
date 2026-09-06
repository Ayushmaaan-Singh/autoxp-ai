import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv

from database import connect_db, close_db
from controllers import auth_router, listings_router, predictions_router
from services.predictions import PredictionService

load_dotenv()

# ---------------------------------------------------------------------------
# CORS – never use allow_origins=["*"] with allow_credentials=True.
# Set ALLOWED_ORIGINS to a comma-separated list of permitted frontend URLs.
# ---------------------------------------------------------------------------
_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5174,http://localhost:5173")
allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="AutoXP API",
    description="Car price prediction + marketplace backend with MongoDB",
    version="3.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
      allow_origins=[
        "http://localhost:5173",          # Vite dev server
        "http://localhost:3000",          # fallback
        "https://frontend-five-mu-60.vercel.app",                              # temporary: allow all (for testing)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(listings_router)
app.include_router(predictions_router)


@app.get("/")
def read_root():
    return {"message": "AutoXP API v3 is active. Go to /docs for testing."}


@app.get("/health")
async def health_check():
    """Lightweight health probe – safe to expose publicly."""
    if not PredictionService.is_model_loaded():
        raise HTTPException(status_code=503, detail="ML model is unavailable.")
    return {"status": "ok", "version": "3.0.0"}


if __name__ == "__main__":
    # Development only – production must use: uvicorn main:app --host 0.0.0.0 --port 8000
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
