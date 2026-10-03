
from sqlalchemy import DateTime, String, Text, Column, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import secrets


from app.shared.db.config.base import Base

def generate_id() -> str:
    return f"{secrets.randbelow(10**6):06d}"


class Prompt(Base):
    __tablename__ = 'prompts'

    id = Column(String(36), primary_key=True, default=generate_id)
    property_id = Column(
        String(36),
        ForeignKey("properties.id"),
        nullable=False,
    )
    name = Column(String(255), nullable=False)
    prompt_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    property = relationship(
        "Property",
        back_populates="prompts",
    )
    master_images = relationship("MasterImage", back_populates="prompt")