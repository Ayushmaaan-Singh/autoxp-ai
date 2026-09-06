from fastapi import APIRouter, Depends
from typing import List
from models.listing import ListingCreate, ListingUpdate, ListingOut
from services.listings import ListingService
from controllers.deps import get_current_user

router = APIRouter(prefix="/api/listings", tags=["listings"])

@router.get("", response_model=List[ListingOut])
async def get_listings():
    return await ListingService.get_listings()

@router.post("", response_model=ListingOut, status_code=201)
async def create_listing(body: ListingCreate, 
current_user: dict = Depends(get_current_user)):
    return await ListingService.create_listing(body, current_user)

@router.put("/{listing_id}", response_model=ListingOut)
async def update_listing(
    listing_id: str,
    body: ListingUpdate,
    current_user: dict = Depends(get_current_user),
):
    return await ListingService.update_listing(listing_id, body, current_user)

@router.delete("/{listing_id}", status_code=204)
async def delete_listing(listing_id: str, current_user: dict = Depends(get_current_user)):
    await ListingService.delete_listing(listing_id, current_user)

@router.post("/{listing_id}/view")
async def increment_view(listing_id: str):
    await ListingService.increment_views(listing_id)
    return {"ok": True}
