import uuid
from datetime import datetime
from sqlalchemy import DateTime, Enum as SQLEnum, Float, ForeignKey, Integer, String, Text, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from app.shared.db.enums import SpaceType
import secrets


from app.shared.db.config.base import Base

def generate_id() -> str:
    return f"{secrets.randbelow(10**6):06d}"

class Space(Base):
    __tablename__ = 'spaces'

    id = Column(String(36), primary_key=True, default=generate_id())
    property_id = Column(String(36), ForeignKey('properties.id'), nullable=False)
    name = Column(String(255), nullable=False)
    space_type = Column(SQLEnum(SpaceType), nullable=False)
    floor_level = Column(String(50))
    created_at = Column(DateTime, default=func.now())

    property = relationship("Property", back_populates="spaces")
    views = relationship("SpaceView", back_populates="space")
    master_images = relationship("MasterImage", back_populates="space")
