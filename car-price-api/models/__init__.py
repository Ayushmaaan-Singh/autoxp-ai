from .user import UserCreate, UserLogin, UserUpdate, UserPublic, TokenResponse
from .listing import ListingCreate, ListingUpdate, ListingOut
from .prediction import PredictionLog, CarInputV3

def to_str_id(doc: dict) -> dict:
    """Convert MongoDB _id ObjectId → string 'id' field."""
    if doc and "_id" in doc:
        doc["id"] = str(doc.pop("_id"))
    return doc
