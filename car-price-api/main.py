import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import uvicorn
from dotenv import load_dotenv
from database import connect_db, close_db
from controllers import auth_router, listings_router, predictions_router
from services.predictions import PredictionService

load_dotenv()

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
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "https://frontend-five-mu-60.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

@app.options("/{rest_of_path:path}")
async def preflight_handler(rest_of_path: str, request: Request):
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": request.headers.get("origin", "*"),
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": "true",
        },
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
    if not PredictionService.is_model_loaded():
        raise HTTPException(status_code=503, detail="ML model is unavailable.")
    return {"status": "ok", "version": "3.0.0"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)