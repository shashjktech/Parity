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


class MasterImage(Base):
    __tablename__ = 'master_images'

    id = Column(String(36), primary_key=True, default=generate_id())
    property_id = Column(String(36), ForeignKey('properties.id'), nullable=False)
    space_id = Column(String(36), ForeignKey('spaces.id'), nullable=False)
    space_view_id = Column(String(36), ForeignKey('space_views.id'), nullable=False)
    master_image_url = Column(Text, nullable=False)
    prompt_id = Column(String(36), ForeignKey('prompts.id'))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    property = relationship("Property", back_populates="master_images")
    space = relationship("Space", back_populates="master_images")
    space_view = relationship("SpaceView", back_populates="master_images")
    prompt = relationship("Prompt", back_populates="master_images")