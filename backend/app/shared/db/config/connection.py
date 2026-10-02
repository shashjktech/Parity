
import os 
from sqlalchemy import create_engine
from ....core.config import settings


DATABASE_URL = settings.DATABASE_URL

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set; check app/.env")


engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)