import os
import sys
from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext
from dotenv import load_dotenv
from fastapi import HTTPException, status

load_dotenv()

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# ---------------------------------------------------------------------------
# JWT secret – required in production; a clearly-marked fallback is
# accepted in development only so local runs work without a .env file.
# ---------------------------------------------------------------------------
_DEV_FALLBACK = "dev-only-insecure-fallback-do-not-use-in-production!"
SECRET_KEY = os.getenv("JWT_SECRET", "")

if not SECRET_KEY:
    if ENVIRONMENT == "production":
        print("[FATAL] JWT_SECRET environment variable is not set. "
              "A strong secret is required in production.", file=sys.stderr)
        sys.exit(1)
    # Development: use the clearly-labelled fallback and warn loudly.
    SECRET_KEY = _DEV_FALLBACK
    print("[WARN] JWT_SECRET not set – using insecure development fallback. "
          "Set JWT_SECRET before deploying to production.", file=sys.stderr)
elif len(SECRET_KEY) < 32:
    if ENVIRONMENT == "production":
        print("[FATAL] JWT_SECRET is too short (< 32 chars). "
              "Use a cryptographically random secret in production.", file=sys.stderr)
        sys.exit(1)
    print("[WARN] JWT_SECRET is shorter than 32 characters – "
          "use a longer secret in production.", file=sys.stderr)

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 72

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(user_id: str, email: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    payload = {"sub": user_id, "email": email, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
