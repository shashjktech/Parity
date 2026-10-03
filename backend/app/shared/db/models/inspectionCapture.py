from sqlalchemy import DateTime, Enum as SQLEnum, Float, ForeignKey, Integer, String, Text, Column
from sqlalchemy.orm import  mapped_column, relationship
from sqlalchemy.sql import func
from app.shared.db.enums import CaptureStatus

import secrets


from app.shared.db.config.base import Base

def generate_id() -> str:
    return f"{secrets.randbelow(10**6):06d}"


class InspectionCapture(Base):
    __tablename__ = 'inspection_captures'

    id = Column(String(36), primary_key=True, default=generate_id)
    worker_id = Column(String(36), ForeignKey('app_users.id'), nullable=False)
    schedule_id = Column(String(36), ForeignKey('inspection_schedules.id'), nullable=False)
    space_view_id = Column(String(36), ForeignKey('space_views.id'), nullable=False)
    capture_image_url = Column(Text, nullable=False)
    capture_status = Column(SQLEnum(CaptureStatus), default=CaptureStatus.PENDING)
    capture_time = Column(DateTime, default=func.now())
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    worker = relationship("AppUser", back_populates="inspection_captures")
    schedule = relationship("InspectionSchedule", back_populates="captures")
    space_view = relationship("SpaceView", back_populates="inspection_captures")
    #issues = relationship("IssueTicket", back_populates="capture")