from app.shared.db.config.base import Base
from app.shared.db.config.connection import engine
from app.shared.db.config.session import SessionLocal


def init_db() -> None:
    import app.shared.db.models

    Base.metadata.create_all(bind=engine)