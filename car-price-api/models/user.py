from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    displayName: str = Field(..., min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    displayName: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None


class UserPublic(BaseModel):
    id: str
    displayName: str
    email: str
    location: Optional[str] = None
    phone: Optional[str] = None
    createdAt: Optional[datetime] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic
