from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.shared.db.enums import VerificationStatus
from app.shared.db.enums import PropertyWorkerStatus



class PropertyResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    address: str | None
    timezone: str | None
    verification_status: VerificationStatus

class WorkerAssignedPropertyResponse(BaseModel):
    property: PropertyResponse | None

class WorkerResponse(BaseModel):
    workerId: str
    workerName: str
    property: PropertyResponse | None


