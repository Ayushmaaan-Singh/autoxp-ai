import os
import sys
from urllib.parse import urlparse
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
AUTOXP_DB = os.getenv("AUTOXP_DB", "autoxp")

client: AsyncIOMotorClient = None


def _safe_uri_label(uri: str) -> str:
    """Return a credential-free representation of the URI for logging."""
    try:
        parsed = urlparse(uri)
        return f"{parsed.scheme}://{parsed.hostname}/{AUTOXP_DB}"
    except Exception:
        return "<mongodb>"


async def connect_db():
    global client
    try:
        client = AsyncIOMotorClient(
            MONGODB_URI,
            maxPoolSize=50,
            minPoolSize=5,
            serverSelectionTimeoutMS=5000,
        )
        # Verify connection without leaking the URI in logs.
        await client.admin.command("ping")
        print(f"[OK] MongoDB connected: {_safe_uri_label(MONGODB_URI)} / db={AUTOXP_DB}")
    except Exception as e:
        # Log a safe message – do NOT print MONGODB_URI which may contain credentials.
        print(f"[FATAL] MongoDB connection failed: {e}", file=sys.stderr)
        raise


async def close_db():
    global client
    if client:
        client.close()
        print("MongoDB connection closed.")


def get_db():
    return client[AUTOXP_DB]
