from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import require_worker
from app.shared.db.config.session import get_db
from app.shared.db.models import AppUser

from app.services.Inspection.service import InspectionService
from app.services.Inspection.schema import (
    InspectionChecklistResponse,
    InspectionPropertyResponse,
    InspectionSpaceResponse,
)


router = APIRouter(
    prefix="/inspection",
    tags=["Inspection"],
)


@router.get(
    "/properties/{property_id}/inspection-checklist",
    response_model=InspectionChecklistResponse,
)
def get_inspection_checklist(
    property_id: str,
    current_user: AppUser = Depends(require_worker),
    db: Session = Depends(get_db),
):
    service = InspectionService(db)

    result = service.get_inspection_checklist(
        user_id=current_user.id,
        property_id=property_id,
    )

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found or worker is not assigned to this property.",
        )

    property_obj, spaces = result

    return InspectionChecklistResponse(
        property=InspectionPropertyResponse(
            id=property_obj.id,
            name=property_obj.name,
            imageUrl=None,
        ),
        spaces=[
            InspectionSpaceResponse(
                id=space.id,
                type=space.space_type.value.lower(),
                name=space.name,
                location="Ground Floor",
                imageUrl=master_image_url,
                status="pending",
            )
            for space, master_image_url in spaces
        ],
    )