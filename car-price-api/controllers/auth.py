from fastapi import APIRouter, Depends
from models.user import UserCreate, UserLogin, UserUpdate, UserPublic, TokenResponse
from services.auth import AuthService
from controllers.deps import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(body: UserCreate):
    return await AuthService.register_user(body)

@router.post("/login", response_model=TokenResponse)
async def login(body: UserLogin):
    return await AuthService.login_user(body)

@router.get("/me", response_model=UserPublic)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserPublic(
        id=current_user["id"],
        displayName=current_user["displayName"],
        email=current_user["email"],
        location=current_user.get("location"),
        phone=current_user.get("phone"),
        createdAt=current_user.get("createdAt"),
    )

@router.patch("/me", response_model=UserPublic)
async def update_me(body: UserUpdate, current_user: dict = Depends(get_current_user)):
    return await AuthService.update_user(current_user["id"], body)
