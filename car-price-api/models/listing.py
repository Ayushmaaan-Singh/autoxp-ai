from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ListingCreate(BaseModel):
    brand: str
    model: str
    year: int
    km: int
    fuel: str
    trans: str
    engine: Optional[str] = "1200cc"
    power: Optional[str] = "100 bhp"
    seats: Optional[int] = 5
    owner: Optional[str] = "1st Owner"
    price: int
    city: str
    badge: Optional[str] = "New Arrival"
    img: Optional[str] = None


class ListingUpdate(BaseModel):
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    km: Optional[int] = None
    fuel: Optional[str] = None
    trans: Optional[str] = None
    engine: Optional[str] = None
    power: Optional[str] = None
    seats: Optional[int] = None
    owner: Optional[str] = None
    price: Optional[int] = None
    city: Optional[str] = None
    badge: Optional[str] = None
    img: Optional[str] = None


class ListingOut(BaseModel):
    id: str
    brand: str
    model: str
    year: int
    km: int
    fuel: str
    trans: str
    engine: Optional[str] = None
    power: Optional[str] = None
    seats: Optional[int] = None
    owner: Optional[str] = None
    seller: Optional[str] = None
    seller_id: Optional[str] = None
    price: int
    city: str
    badge: Optional[str] = None
    views: int = 0
    img: Optional[str] = None
    createdAt: Optional[datetime] = None
