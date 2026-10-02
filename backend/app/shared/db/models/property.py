import uuid
from datetime import datetime
from sqlalchemy import DateTime, Enum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.shared.db.config.base import Base
from app.shared.db.enums import VerificationStatus


def generate_uuid() -> str:
    return str(uuid.uuid4())


class Property(Base):
    __tablename__ = "properties"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    owner_id: Mapped[str] = mapped_column(String(36), ForeignKey("app_users.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    timezone: Mapped[str | None] = mapped_column(String(100), default="UTC", nullable=True)
    verification_status: Mapped[VerificationStatus] = mapped_column(
        Enum(VerificationStatus, native_enum=False), default=VerificationStatus.PENDING, nullable=False
    )
    # subscription_plan_id: Mapped[str | None] = mapped_column(
    #     String(36), ForeignKey("subscription_plans.id"), nullable=True, index=True
    # )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    owner = relationship("AppUser", back_populates="owned_properties")
    spaces = relationship("Space", back_populates="property")
    master_images = relationship("MasterImage", back_populates="property")
    schedules = relationship("InspectionSchedule", back_populates="property")
