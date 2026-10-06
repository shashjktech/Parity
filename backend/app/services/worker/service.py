from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from sqlalchemy.exc import SQLAlchemyError

from app.shared.db.enums import PropertyWorkerStatus
from app.shared.db.models import PropertyWorker, Property


class WorkerService:

    def __init__(self, db: Session):
        self.db = db

    def get_worker(self, user_id: str):

        assignment = self.db.scalar(
            select(PropertyWorker)
            .options(joinedload(PropertyWorker.user))
            .where(
                PropertyWorker.user_id == user_id,
                PropertyWorker.worker_status == PropertyWorkerStatus.ACTIVE,
            )
        )

        if assignment is None:
            return None

        return assignment
    
    

    def get_property_details(
        self,
        user_id: str,
        property_id: str,
    ) -> Property:

        try:
            property = self.db.scalar(
                select(Property)
                .join(
                    PropertyWorker,
                    PropertyWorker.property_id == Property.id,
                )
                .where(
                    Property.id == property_id,
                    PropertyWorker.user_id == user_id,
                    PropertyWorker.worker_status == PropertyWorkerStatus.ACTIVE,
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
                detail="Property not found or worker is not assigned to this property.",
            )

        return property