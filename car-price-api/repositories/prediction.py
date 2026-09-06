from database import get_db
from typing import List

class PredictionRepository:
    @staticmethod
    async def create(prediction_data: dict) -> str:
        db = get_db()
        result = await db["predictions"].insert_one(prediction_data)
        return str(result.inserted_id)

    @staticmethod
    async def get_history_by_user(user_id: str, limit: int = 50) -> List[dict]:
        db = get_db()
        cursor = db["predictions"].find({"user_id": user_id}).sort("createdAt", -1).limit(limit)
        results = []
        async for doc in cursor:
            doc["id"] = str(doc.pop("_id"))
            results.append(doc)
        return results
