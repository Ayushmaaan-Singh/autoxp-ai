from bson import ObjectId
from database import get_db
from typing import Optional

class UserRepository:
    @staticmethod
    async def get_by_id(user_id: str) -> Optional[dict]:
        db = get_db()
        try:
            user = await db["users"].find_one({"_id": ObjectId(user_id)})
            if user:
                user["id"] = str(user.pop("_id"))
                return user
        except Exception:
            pass
        return None

    @staticmethod
    async def get_by_email(email: str) -> Optional[dict]:
        db = get_db()
        user = await db["users"].find_one({"email": email})
        if user:
            user["id"] = str(user.pop("_id"))
            return user
        return None

    @staticmethod
    async def create(user_data: dict) -> str:
        db = get_db()
        result = await db["users"].insert_one(user_data)
        return str(result.inserted_id)

    @staticmethod
    async def update(user_id: str, updates: dict) -> Optional[dict]:
        db = get_db()
        try:
            await db["users"].update_one(
                {"_id": ObjectId(user_id)},
                {"$set": updates}
            )
            return await UserRepository.get_by_id(user_id)
        except Exception:
            return None
