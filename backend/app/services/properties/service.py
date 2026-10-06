from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from app.shared.db.enums import VerificationStatus, PropertyWorkerStatus
from app.shared.db.models.property import Property
from app.shared.db.models import AppUser, PropertyWorker
from app.services.properties.schema import PropertyCreateRequest
from app.shared.utils.generate_property_id import generate_property_code

class PropertyService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def get_property_details(self, owner_id: str, property_id: str) -> Property:
        try:
            property = self.db.scalar(
                select(Property).where(
                    Property.id == property_id,
                    Property.owner_id == owner_id,
                )
            )
        except SQLAlchemyError as err:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve property details.",
            ) from err

        if property is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Property not found.",
            )

        return property

    def get_owner_properties(self, owner_id: str) -> list[Property]:
        try:
            properties = self.db.scalars(
                select(Property)
                .where(Property.owner_id == owner_id)
                .order_by(Property.created_at.desc())
            ).all()
        except SQLAlchemyError as err:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve properties.",
            ) from err

        return list(properties)
    
    def get_workers_by_property(self, property_id: str):
    
            assignments = self.db.scalars(
                select(PropertyWorker)
                .options(joinedload(PropertyWorker.user))
                .where(
                    PropertyWorker.property_id == property_id,
                    PropertyWorker.worker_status == PropertyWorkerStatus.ACTIVE,
                )
            ).all()
    
            return assignments

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
                
                verification_status=VerificationStatus.VERIFIED,
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