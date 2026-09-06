import joblib
import pandas as pd
import numpy as np
from pathlib import Path
from datetime import datetime, timezone
from fastapi import HTTPException
from models.prediction import CarInputV3, PredictionLog
from repositories.prediction import PredictionRepository
from typing import List, Optional

# ---------------------------------------------------------------------------
# Model loading – done once at startup. Failures are logged clearly.
# ---------------------------------------------------------------------------
model_path = Path(__file__).parent.parent / "car_price_pipeline.joblib"
try:
    model = joblib.load(model_path)
    print("[OK] ML model loaded successfully.")
except FileNotFoundError:
    print("[WARN] ML model file not found. Prediction endpoint will return 503.", flush=True)
    model = None
except Exception as e:
    print(f"[WARN] Failed to load ML model: {type(e).__name__}: {e}", flush=True)
    model = None


class PredictionService:
    @staticmethod
    def is_model_loaded() -> bool:
        return model is not None

    @staticmethod
    async def predict_price(car: CarInputV3, current_user_id: Optional[str] = None) -> dict:
        if model is None:
            raise HTTPException(
                status_code=503,
                detail="ML model is not available. Please try again later.",
            )

        # ── Build input DataFrame ─────────────────────────────────────────────
        try:
            input_data = pd.DataFrame([car.model_dump()])

            # Engineered features – same as training pipeline.
            input_data["km_per_year"] = input_data["km_driven"] / np.maximum(
                input_data["vehicle_age"], 1.0
            )
            input_data["power_to_engine"] = input_data["max_power"] / np.maximum(
                input_data["engine"], 1.0
            )
        except Exception as e:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid input data: {e}",
            )

        # ── Run inference ─────────────────────────────────────────────────────
        try:
            prediction_log = model.predict(input_data)
            predicted_price = float(np.expm1(prediction_log)[0])
        except ValueError as e:
            # Typically caused by unknown categorical values the model was not
            # trained on – return a descriptive 422 rather than a bare 500.
            raise HTTPException(
                status_code=422,
                detail=f"Input contains a value the model cannot process: {e}",
            )
        except Exception as e:
            # Genuine model/server failure – 500 is appropriate here.
            raise HTTPException(
                status_code=500,
                detail="Prediction failed due to an internal error. Please try again later.",
            )

        # ── Sanity-check result ───────────────────────────────────────────────
        if not np.isfinite(predicted_price) or predicted_price <= 0:
            raise HTTPException(
                status_code=422,
                detail="The model produced an invalid prediction for the given inputs. "
                       "Please verify your values and try again.",
            )

        lower_bound = predicted_price * 0.90
        upper_bound = predicted_price * 1.10

        result = {
            "status": "success",
            "estimated_price_inr": round(predicted_price, 2),
            "formatted_price": f"₹{round(predicted_price, 2):,}",
            "valuation_range": {
                "lower_bound": f"₹{round(lower_bound, 2):,}",
                "upper_bound": f"₹{round(upper_bound, 2):,}",
            },
        }

        # ── Persist prediction log if user is logged in ───────────────────────
        if current_user_id:
            try:
                await PredictionRepository.create({
                    "user_id": current_user_id,
                    "brand": car.brand,
                    "model_name": car.model,
                    "vehicle_age": car.vehicle_age,
                    "km_driven": car.km_driven,
                    "fuel": car.fuel,
                    "transmission": car.transmission,
                    "estimated_price_inr": result["estimated_price_inr"],
                    "createdAt": datetime.now(timezone.utc),
                })
            except Exception:
                # Logging failure must not break the prediction response.
                pass

        return result

    @staticmethod
    async def get_history(user_id: str) -> List[PredictionLog]:
        logs = await PredictionRepository.get_history_by_user(user_id)
        return [PredictionLog(**log) for log in logs]
