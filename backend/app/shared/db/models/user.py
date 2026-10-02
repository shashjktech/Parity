from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.shared.db.config.base import Base
from app.shared.db.enums import Role


class AppUser(Base):
    __tablename__ = "app_users"
    __table_args__ = (UniqueConstraint("phone", name="uq_app_users_phone"),)

    id: Mapped[str] = mapped_column(String, primary_key=True)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    passwordHash: Mapped[str | None] = mapped_column("password_hash", String, nullable=True)
    phone: Mapped[str | None] = mapped_column(String, nullable=True)
    isPhoneVerified: Mapped[bool] = mapped_column(
        "is_phone_verified", Boolean, default=False, nullable=False
    )
    firstName: Mapped[str | None] = mapped_column("first_name", String, nullable=True)
    lastName: Mapped[str | None] = mapped_column("last_name", String, nullable=True)
    userRole: Mapped[Role] = mapped_column("user_role", Enum(Role), nullable=False)
    createdAt: Mapped[datetime] = mapped_column(
        "created_at", DateTime, default=datetime.utcnow, nullable=False
    )
    updatedAt: Mapped[datetime] = mapped_column(
        "updated_at",
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )
    sessions = relationship("UserSession", back_populates="user")
    owned_properties = relationship("Property", back_populates="owner")
    inspection_captures = relationship("InspectionCapture", back_populates="worker")
