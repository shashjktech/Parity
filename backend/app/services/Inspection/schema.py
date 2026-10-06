from pydantic import BaseModel


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


class InspectionChecklistResponse(BaseModel):
    property: InspectionPropertyResponse
    spaces: list[InspectionSpaceResponse]