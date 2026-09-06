from fastapi import APIRouter, Depends
from typing import List
from models.prediction import CarInputV3, PredictionLog
from services.predictions import PredictionService
from controllers.deps import get_current_user, get_current_user_optional

router = APIRouter(tags=["predictions"])

@router.post("/api/predict")
@router.post("/api/predictions")
@router.post("/predict")
@router.post("/predictions")
async def predict_price(
    car: CarInputV3,
    current_user: dict = Depends(get_current_user_optional),
):
    current_user_id = current_user["id"] if current_user else None
    return await PredictionService.predict_price(car, current_user_id)

@router.get("/api/predictions/history", response_model=List[PredictionLog])
async def get_prediction_history(current_user: dict = Depends(get_current_user)):
    return await PredictionService.get_history(current_user["id"])
