from datetime import datetime, timezone
from fastapi import HTTPException
from repositories.user import UserRepository
from models.user import TokenResponse, UserPublic, UserCreate, UserLogin, UserUpdate
from services.security import hash_password, verify_password, create_access_token

class AuthService:
    @staticmethod
    async def register_user(body: UserCreate) -> TokenResponse:
        existing_user = await UserRepository.get_by_email(body.email)
        if existing_user:
            raise HTTPException(status_code=409, detail="Email already registered")

        doc = {
            "displayName": body.displayName,
            "email": body.email,
            "passwordHash": hash_password(body.password),
            "location": None,
            "phone": None,
            "createdAt": datetime.now(timezone.utc),
        }
        user_id = await UserRepository.create(doc)

        token = create_access_token(user_id, body.email)
        user_public = UserPublic(
            id=user_id,
            displayName=body.displayName,
            email=body.email,
            createdAt=doc["createdAt"],
        )
        return TokenResponse(access_token=token, user=user_public)

    @staticmethod
    async def login_user(body: UserLogin) -> TokenResponse:
        # Get by email returns the DB doc including passwordHash
        user = await UserRepository.get_by_email(body.email)
        
        # We need to verify if UserRepository get_by_email returned the passwordHash.
        # Since it fetched the whole doc, it should contain "passwordHash".
        # Let's get it from the database if not present, but it should be present.
        # However, UserRepository populates the dict directly from MongoDB find_one.
        # Let's check repositories/user.py to be sure:
        # user = await db["users"].find_one({"email": email})
        # Yes, find_one returns all fields.
        if not user or not user.get("passwordHash") or not verify_password(body.password, user["passwordHash"]):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        token = create_access_token(user["id"], user["email"])
        user_public = UserPublic(
            id=user["id"],
            displayName=user["displayName"],
            email=user["email"],
            location=user.get("location"),
            phone=user.get("phone"),
            createdAt=user.get("createdAt"),
        )
        return TokenResponse(access_token=token, user=user_public)

    @staticmethod
    async def update_user(user_id: str, body: UserUpdate) -> UserPublic:
        updates = {k: v for k, v in body.model_dump().items() if v is not None}
        updated = await UserRepository.update(user_id, updates)
        if not updated:
            raise HTTPException(status_code=404, detail="User not found")
        return UserPublic(
            id=updated["id"],
            displayName=updated["displayName"],
            email=updated["email"],
            location=updated.get("location"),
            phone=updated.get("phone"),
            createdAt=updated.get("createdAt"),
        )
