from datetime import datetime
import secrets

from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey, String, Text, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.shared.db.enums import SpaceType
from app.shared.db.config.base import Base


def generate_id() -> str:
    return f"{secrets.randbelow(10**6):06d}"


class Space(Base):
    __tablename__ = 'spaces'

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=generate_id
    )

    property_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey('properties.id'),
        nullable=False
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    space_type: Mapped[SpaceType] = mapped_column(
        SQLEnum(SpaceType),
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=func.now()
    )

    property = relationship(
        "Property",
        back_populates="spaces"
    )

    # views = relationship("SpaceView", back_populates="space")

    master_images = relationship(
        "MasterImage",
        back_populates="space"
    )

    inspection_captures = relationship(
        "InspectionCapture",
        back_populates="space"
    )

    issue_tickets = relationship(
        "IssueTicket",
        back_populates="space"
    )