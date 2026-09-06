from pydantic import BaseModel
from datetime import datetime

class PredictionLog(BaseModel):
    id: str
    user_id: str
    brand: str
    model_name: str
    vehicle_age: float
    km_driven: float
    fuel: str
    transmission: str
    estimated_price_inr: float
    createdAt: datetime


class CarInputV3(BaseModel):
    vehicle_age: float
    km_driven: float
    mileage: float
    engine: float
    max_power: float
    seats: float
    brand: str
    model: str
    seller_type: str
    fuel: str
    transmission: str
    owner: str

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "vehicle_age": 9.0,
                    "km_driven": 120000.0,
                    "mileage": 19.7,
                    "engine": 796.0,
                    "max_power": 46.3,
                    "seats": 5.0,
                    "brand": "Maruti",
                    "model": "Alto",
                    "seller_type": "Individual",
                    "fuel": "Petrol",
                    "transmission": "Manual",
                    "owner": "Second Owner"
                }
            ]
        }
    }
