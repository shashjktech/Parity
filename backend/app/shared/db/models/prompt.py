from datetime import datetime
import secrets

from sqlalchemy import DateTime, String, Text, Column, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.shared.db.config.base import Base


def generate_id() -> str:
    return f"{secrets.randbelow(10**6):06d}"


class Prompt(Base):
    __tablename__ = 'prompts'

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=generate_id
    )

    property_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("properties.id"),
        nullable=False,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    prompt_text: Mapped[str] = mapped_column(
        Text,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=func.now()
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=func.now(),
        onupdate=func.now()
    )
    
    property = relationship(
        "Property",
        back_populates="prompts",
    )

    master_images = relationship(
        "MasterImage",
        back_populates="prompt"
    )