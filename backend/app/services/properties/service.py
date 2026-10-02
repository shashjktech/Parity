from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.shared.db.enums import VerificationStatus
from app.shared.db.models.property import Property
from app.shared.db.models.user import AppUser
from app.services.properties.schema import PropertyCreateRequest
from app.shared.utils.generate_property_id import generate_property_code

class PropertyService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def add_property(
        self,
        owner_id: str,
        payload: PropertyCreateRequest,
        max_attempts: int = 5,
    ) -> Property:
        if max_attempts < 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="max_attempts must be at least 1.",
            )

        owner = self.db.query(AppUser).filter(AppUser.id == owner_id).first()
        if not owner:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"User with ID '{owner_id}' not found or account is inactive.",
            )

        for _ in range(max_attempts):
            property_code = generate_property_code(6)
            code_exists = (
                self.db.query(Property.id)
                .filter(Property.id == property_code)
                .first()
            )
            if code_exists:
                continue

            new_property = Property(
                id=property_code,
                owner_id=owner.id,
                name=payload.name.strip(),
                address= f"{payload.address}, {payload.city}, {payload.state}, {payload.country}, {payload.pincode}",
                
                verification_status=VerificationStatus.PENDING,
            )

            try:
                self.db.add(new_property)
                self.db.commit()
                self.db.refresh(new_property)
                return new_property
            except IntegrityError as err:
                self.db.rollback()
                code_exists = (
                    self.db.query(Property.id)
                    .filter(Property.id == property_code)
                    .first()
                )
                if code_exists:
                    continue
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to create property due to a database error: {err}",
                ) from err
            except Exception as err:
                self.db.rollback()
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to create property due to a database error: {err}",
                ) from err

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not generate a unique property code after {max_attempts} attempts.",
        )