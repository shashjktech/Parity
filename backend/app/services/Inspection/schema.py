from pydantic import BaseModel
from datetime import datetime

class InspectionPropertyResponse(BaseModel):
    id: str
    name: str
    imageUrl: str | None = None


class InspectionSpaceResponse(BaseModel):
    id: str
    type: str
    name: str
    location: str | None = None
    imageUrl: str | None = None
    status: str
    captureId: str | None = None


class InspectionChecklistResponse(BaseModel):
    property: InspectionPropertyResponse
    spaces: list[InspectionSpaceResponse]
    
class CaptureUploadResponse(BaseModel):
    captureId: str
    spaceId: str
    imageUrl: str
    status: str
    capturedAt: datetime


class LatestCaptureResponse(BaseModel):
    captureId: str
    spaceId: str
    imageUrl: str
    status: str
    capturedAt: datetime


class InspectionIssueResponse(BaseModel):
    id: str
    title: str
    category: str
    description: str | None = None


class InspectionCaptureResultResponse(BaseModel):
    captureId: str
    spaceId: str
    status: str
    masterImageUrl: str | None = None
    currentImageUrl: str | None = None
    issues: list[InspectionIssueResponse]