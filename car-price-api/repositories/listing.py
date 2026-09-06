from bson import ObjectId
from database import get_db
from typing import List, Optional

class ListingRepository:
    @staticmethod
    async def get_all() -> List[dict]:
        db = get_db()
        cursor = db["listings"].find().sort("createdAt", -1)
        results = []
        async for doc in cursor:
            doc["id"] = str(doc.pop("_id"))
            results.append(doc)
        return results

    @staticmethod
    async def get_by_id(listing_id: str) -> Optional[dict]:
        db = get_db()
        try:
            doc = await db["listings"].find_one({"_id": ObjectId(listing_id)})
            if doc:
                doc["id"] = str(doc.pop("_id"))
                return doc
        except Exception:
            pass
        return None

    @staticmethod
    async def create(listing_data: dict) -> str:
        db = get_db()
        result = await db["listings"].insert_one(listing_data)
        return str(result.inserted_id)

    @staticmethod
    async def update(listing_id: str, updates: dict) -> Optional[dict]:
        db = get_db()
        try:
            await db["listings"].update_one(
                {"_id": ObjectId(listing_id)},
                {"$set": updates}
            )
            return await ListingRepository.get_by_id(listing_id)
        except Exception:
            return None

    @staticmethod
    async def delete(listing_id: str) -> bool:
        db = get_db()
        try:
            result = await db["listings"].delete_one({"_id": ObjectId(listing_id)})
            return result.deleted_count > 0
        except Exception:
            return False

    @staticmethod
    async def increment_views(listing_id: str) -> bool:
        db = get_db()
        try:
            result = await db["listings"].update_one(
                {"_id": ObjectId(listing_id)},
                {"$inc": {"views": 1}}
            )
            return result.modified_count > 0
        except Exception:
            return False
