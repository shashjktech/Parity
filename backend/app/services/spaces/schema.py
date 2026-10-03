from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict, field_validator
from app.shared.db.enums import SpaceType


class SpaceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    property_id: str
    type: str
    name: str
    description: str | None = None
    image_url: str | None = None
    created_at: datetime


class SpaceCreateRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    type: SpaceType
    name: str = Field(
        ...,
        min_length=1,
        max_length=255,
    )

    description: str | None = None

    prompt_id: str | None = Field(
        default=None,
        alias="promptId",
    )

    @field_validator("type", mode="before")
    @classmethod
    def normalize_type(cls, value):
        if isinstance(value, str):
            normalized = value.strip().upper()
            return "ASSETS" if normalized == "ASSET" else normalized

        return value

class SpaceCreateResponse(BaseModel):
    space_id: str
    master_image_id: str
    property_id: str
    name: str
    type: str
    prompt_id: str | None


class MasterImageUploadResponse(BaseModel):
    image_path: str