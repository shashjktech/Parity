import os
from pathlib import Path
from dotenv import load_dotenv

ENV_FILE = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=ENV_FILE)

class Settings:
    APP_NAME = os.getenv("APP_NAME", "Delta Vision")
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development").lower()
    DATABASE_URL = os.getenv("DATABASE_URL")
    SECRET_KEY = os.getenv("SECRET_KEY")
    if ENVIRONMENT == "development":
        SECRET_KEY = SECRET_KEY or "delta-secret-key"
    elif not SECRET_KEY or len(SECRET_KEY) < 32 or SECRET_KEY == "delta-secret-key":
        raise RuntimeError(
            "Set SECRET_KEY to a strong value of at least 32 characters outside development."
        )
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
    GCS_BUCKET_NAME = os.getenv("GCS_BUCKET_NAME", "deltavision-media-raw-dev")
    FIREBASE_FILENAME = os.getenv("Firebase_filename", "firebase_sdk")
    if not FIREBASE_FILENAME.endswith(".json"):
        FIREBASE_FILENAME += ".json"
    FIREBASE_CREDENTIALS_PATH = str(
        Path(__file__).resolve().parents[2] / FIREBASE_FILENAME
    )


settings = Settings()