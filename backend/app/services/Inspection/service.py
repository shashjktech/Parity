from sqlalchemy import select
from sqlalchemy.orm import Session

from app.shared.db.enums import PropertyWorkerStatus
from app.shared.db.models import (
    Property,
    PropertyWorker,
    Space,
    MasterImage,
)
from app.services.spaces.service import SpaceService


class InspectionService:

    def __init__(self, db: Session):
        self.db = db

    def get_inspection_checklist(
        self,
        user_id: str,
        property_id: str,
    ):
        # Verify worker is assigned to this property
        assignment = self.db.scalar(
            select(PropertyWorker).where(
                PropertyWorker.user_id == user_id,
                PropertyWorker.property_id == property_id,
                PropertyWorker.worker_status == PropertyWorkerStatus.ACTIVE,
            )
        )

        if assignment is None:
            return None

        # Get property
        property_obj = self.db.scalar(
            select(Property).where(
                Property.id == property_id,
            )
        )

        if property_obj is None:
            return None

        # Get spaces + their master image
        spaces = self.db.execute(
            select(Space, MasterImage.master_image_url)
            .outerjoin(
                MasterImage,
                MasterImage.space_id == Space.id,
            )
            .where(
                Space.property_id == property_id,
            )
            .order_by(Space.created_at)
        ).all()
        return property_obj, spaces

    def get_master_image_path(
        self,
        user_id: str,
        property_id: str,
        space_id: str,
    ):
        assignment = self.db.scalar(
            select(PropertyWorker).where(
                PropertyWorker.user_id == user_id,
                PropertyWorker.property_id == property_id,
                PropertyWorker.worker_status == PropertyWorkerStatus.ACTIVE,
            )
        )
        if assignment is None:
            raise PermissionError("Worker is not assigned to this property.")

        property_obj = self.db.scalar(
            select(Property).where(Property.id == property_id)
        )
        if property_obj is None:
            raise LookupError("Property not found.")

        return SpaceService(self.db).get_master_image_path(
            property_id=property_id,
            space_id=space_id,
            user_id=property_obj.owner_id,
        )