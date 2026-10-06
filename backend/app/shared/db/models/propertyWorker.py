from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    String,
    DateTime,
    ForeignKey,
    Index,
    Enum as SQLEnum,
)
from sqlalchemy.orm import relationship

from app.shared.db.config.base import Base
from app.shared.db.enums import PropertyWorkerStatus


class PropertyWorker(Base):
    __tablename__ = "property_worker"

    user_id = Column(
        String(36),
        ForeignKey("app_users.id"),
        primary_key=True,
    )

    property_id = Column(
        String(36),
        ForeignKey("properties.id"),
        nullable=False,
    )

    worker_status = Column(
        SQLEnum(PropertyWorkerStatus),
        default=PropertyWorkerStatus.PENDING,
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # AppUser relationship
    user = relationship(
        "AppUser",
        back_populates="property_assignments",
    )

    # Property relationship
    property = relationship(
        "Property",
        back_populates="worker_assignments",
    )

    __table_args__ = (
        Index(
            "idx_property_worker_status",
            "property_id",
            "worker_status",
        ),
    )