from sqlalchemy import DateTime, Enum as SQLEnum, Float, ForeignKey, Integer, String, Text, Column
from sqlalchemy.orm import  mapped_column, relationship
from sqlalchemy.sql import func
from app.shared.db.enums import ScheduleType,RecurrenceType

import secrets


from app.shared.db.config.base import Base

def generate_id() -> str:
    return f"{secrets.randbelow(10**6):06d}"


class InspectionSchedule(Base):
    __tablename__ = 'inspection_schedules'

    id = Column(String(36), primary_key=True, default=generate_id)
    property_id = Column(String(36), ForeignKey('properties.id'), nullable=False)
    name = Column(String(255), nullable=False)
    schedule_type = Column(SQLEnum(ScheduleType), nullable=False)
    recurrence_type = Column(SQLEnum(RecurrenceType), nullable=False)
    custom_days = Column(String(255)) 
    start_time_minutes = Column(Integer)
    grace_period_minutes = Column(Integer)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    property = relationship("Property", back_populates="schedules")
    # captures = relationship("InspectionCapture", back_populates="schedule")
