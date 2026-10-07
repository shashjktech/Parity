from datetime import datetime
from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey, String, Text, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
import secrets

from app.shared.db.config.base import Base
from app.shared.db.enums import IssueStatus


def generate_id() -> str:
    return f"{secrets.randbelow(10**6):06d}"


class IssueTicket(Base):
    __tablename__ = "issue_tickets"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_id)

    capture_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("inspection_captures.id"), nullable=False
    )
    space_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("spaces.id"), nullable=False
    )
    property_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("properties.id"), nullable=False
    )

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

   
    status: Mapped[IssueStatus] = mapped_column(
        SQLEnum(IssueStatus), default=IssueStatus.OPEN
    )

    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())

    capture = relationship("InspectionCapture", back_populates="issues")
    space = relationship("Space", back_populates="issue_tickets")
    property = relationship("Property", back_populates="issue_tickets")


    __table_args__ = (
        Index("idx_ticket_property", "property_id"),
        Index("idx_ticket_capture", "capture_id"),

    )