from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import require_worker
from app.shared.db.config.session import get_db
from app.shared.db.models.user import AppUser

from app.services.worker.schema import (
    WorkerAssignedPropertyResponse,
    PropertyResponse,
    WorkerResponse,
)
from app.services.worker.service import WorkerService


router = APIRouter(
    prefix="/worker",
    tags=["Worker"],
)

@router.get(
    "/assigned-property",
    response_model=WorkerResponse,
)
def get_worker_profile(
    current_user: AppUser = Depends(require_worker),
    db: Session = Depends(get_db),
):
    service = WorkerService(db)

    assignment = service.get_worker(
        user_id=current_user.id
    )

    property_response = None

    if assignment is not None:
        property_response = PropertyResponse.model_validate(
            assignment.property
        )

    worker_name = " ".join(
        part
        for part in [
            current_user.firstName,
            current_user.lastName,
        ]
        if part
    )

    return WorkerResponse(
        workerId=current_user.id,
        workerName=worker_name,
        property=property_response,
    )



@router.get(
    "/properties/{propertyId}",
    response_model=PropertyResponse,
)
def get_property_details(
    propertyId: str,
    current_user: AppUser = Depends(require_worker),
    db: Session = Depends(get_db),
):
    worker_service = WorkerService(db)

    property_obj = worker_service.get_property_details(
        user_id=current_user.id,
        property_id=propertyId,
    )

    return PropertyResponse.model_validate(property_obj)


# @router.get(
#     "/assigned-property",
#     response_model=WorkerAssignedPropertyResponse,
# )
# def get_assigned_property(
#     current_user: AppUser = Depends(require_worker),
#     db: Session = Depends(get_db),
# ):
#     service = WorkerService(db)

#     property_obj = service.get_assigned_property(
#         worker_id=current_user.id
#     )

#     return WorkerAssignedPropertyResponse(
#         property=WorkerPropertyResponse.model_validate(property_obj)
#     )