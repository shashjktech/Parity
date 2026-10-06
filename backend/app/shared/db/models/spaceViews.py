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


class SpaceView(Base):
    __tablename__ = 'space_views'

    id = Column(String(36), primary_key=True, default=generate_id)
    space_id = Column(String(36), ForeignKey('spaces.id'), nullable=False)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=func.now())

    #space = relationship("Space", back_populates="views")
    #master_images = relationship("MasterImage", back_populates="space_view")
    # inspection_captures = relationship("InspectionCapture", back_populates="space_view")
