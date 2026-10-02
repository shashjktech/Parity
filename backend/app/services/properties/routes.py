from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
# Database session dependency
from app.shared.db.config.session import get_db

# Owner authentication dependency (adjust to your auth provider)
from app.core.dependencies import get_current_user  # Must verify caller has Owner ('O') role
from app.shared.db.models import AppUser, Property
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
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PropertyResponse:
    """Create a new property entity for the authenticated owner."""
    service = PropertyService(db=db)
    return service.add_property(owner_id=current_user.id, payload=payload)

@router.get(
    "/{property_id}",
    response_model=PropertyResponse,
)
def get_property_details(
    property_id: str,
    db: Session = Depends(get_db),
    current_user: AppUser = Depends(get_current_user),
):
    property = (
        db.query(Property)
        .filter(
            Property.id == property_id,
            Property.owner_id == current_user.id,
        )
        .first()
    )

    if not property:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Property not found.",
        )

    return property


@router.get(
    "",
    response_model=list[PropertyResponse],
    summary="Get owner's properties",
)
def get_my_properties(
    current_user: AppUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    stmt = (
        select(Property)
        .where(Property.owner_id == current_user.id)
        .order_by(Property.created_at.desc())
    )

    return db.scalars(stmt).all()