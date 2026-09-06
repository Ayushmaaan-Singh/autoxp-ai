from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from services.security import decode_access_token
from repositories.user import UserRepository

bearer_scheme = HTTPBearer(auto_error=False)

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
):
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = decode_access_token(credentials.credentials)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = await UserRepository.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
):
    """Like get_current_user but returns None instead of raising if unauthenticated."""
    if not credentials:
        return None
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None
