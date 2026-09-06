from datetime import datetime, timezone
from fastapi import HTTPException
from repositories.listing import ListingRepository
from models.listing import ListingCreate, ListingUpdate, ListingOut
from typing import List

class ListingService:
    @staticmethod
    async def get_listings() -> List[ListingOut]:
        listings = await ListingRepository.get_all()
        return [ListingOut(**item) for item in listings]

    @staticmethod
    async def create_listing(body: ListingCreate, current_user: dict) -> ListingOut:
        doc = body.model_dump()
        doc["seller"] = current_user.get("displayName", "Unknown")
        doc["seller_id"] = current_user["id"]
        doc["views"] = 0
        doc["createdAt"] = datetime.now(timezone.utc)

        if not doc.get("img"):
            doc["img"] = "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=700&q=80"

        listing_id = await ListingRepository.create(doc)
        doc["id"] = listing_id
        return ListingOut(**doc)

    @staticmethod
    async def update_listing(listing_id: str, body: ListingUpdate, current_user: dict) -> ListingOut:
        existing = await ListingRepository.get_by_id(listing_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Listing not found")
        if existing.get("seller_id") != current_user["id"]:
            raise HTTPException(status_code=403, detail="Not your listing")

        updates = {k: v for k, v in body.model_dump().items() if v is not None}
        updated = await ListingRepository.update(listing_id, updates)
        if not updated:
            raise HTTPException(status_code=404, detail="Listing not found")
        return ListingOut(**updated)

    @staticmethod
    async def delete_listing(listing_id: str, current_user: dict):
        existing = await ListingRepository.get_by_id(listing_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Listing not found")
        if existing.get("seller_id") != current_user["id"]:
            raise HTTPException(status_code=403, detail="Not your listing")

        await ListingRepository.delete(listing_id)

    @staticmethod
    async def increment_views(listing_id: str) -> bool:
        return await ListingRepository.increment_views(listing_id)
