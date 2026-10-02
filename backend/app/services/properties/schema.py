from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from app.shared.db.enums import VerificationStatus


class PropertyCreateRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Name of the property or branch")
    address: str | None = Field(default=None, description="Physical address or building location")
    city: str
    state: str
    country: str
    pincode: str


class PropertyResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    owner_id: str
    name: str
    address: str | None
    timezone: str | None
    verification_status: VerificationStatus
    subscription_plan_id: str | None = None
    created_at: datetime

