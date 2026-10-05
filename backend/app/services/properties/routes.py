from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
# Database session dependency
from app.shared.db.config.session import get_db

# Owner authentication dependency (adjust to your auth provider)
from app.core.dependencies import get_current_user,require_owner  # Must verify caller has Owner ('O') role
from app.shared.db.models import AppUser
# Schemas and Service
from app.services.properties.schema import PropertyCreateRequest, PropertyResponse
from app.services.properties.service import PropertyService

router = APIRouter(prefix="/properties", tags=["Properties"])


@router.post(
    "/add",
    response_model=PropertyResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new property",
    description="Accessible by Owners ('O'). Creates a new property under the authenticated user.",
)
def add_property(
    payload: PropertyCreateRequest,
    current_user=Depends(require_owner),
    db: Session = Depends(get_db),
) -> PropertyResponse:
    """Create a new property entity for the authenticated owner."""
    service = PropertyService(db=db)
    property_obj = service.add_property(owner_id=current_user.id, payload=payload)
    return PropertyResponse.model_validate(property_obj)

@router.get(
    "/{property_id}",
    response_model=PropertyResponse,
)
def get_property_details(
    property_id: str,
    db: Session = Depends(get_db),
    current_user: AppUser = Depends(require_owner),
):
    service = PropertyService(db=db)
    return service.get_property_details(
        owner_id=current_user.id,
        property_id=property_id,
    )


@router.get(
    "",
    response_model=list[PropertyResponse],
    summary="Get owner's properties",
)
def get_my_properties(
    current_user: AppUser = Depends(require_owner),
    db: Session = Depends(get_db),
):
    service = PropertyService(db=db)
    return service.get_owner_properties(owner_id=current_user.id)