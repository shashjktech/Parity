from app.shared.db.config.base import Base
from app.shared.db.config.connection import engine
from app.shared.db.config.session import SessionLocal
from sqlalchemy import inspect, text


def init_db() -> None:
    import app.shared.db.models

    Base.metadata.create_all(bind=engine)
    with engine.begin() as connection:
        space_columns = {
            column["name"] for column in inspect(connection).get_columns("spaces")
        }
        if "description" not in space_columns:
            connection.execute(text("ALTER TABLE spaces ADD COLUMN description TEXT"))