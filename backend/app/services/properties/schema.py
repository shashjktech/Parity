from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from app.shared.db.enums import VerificationStatus, PropertyWorkerStatus


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
    created_at: datetime

class WorkerGetResponse(BaseModel):
    workerId: str
    workerFirstName: str
    workerLastName: str
    isOnline: bool
    status: PropertyWorkerStatus
    createdAt: datetime



