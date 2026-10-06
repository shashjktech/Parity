from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.dependencies import require_worker
from app.shared.db.config.session import get_db
from app.shared.db.enums import CaptureStatus
from app.shared.db.models import AppUser, InspectionCapture

from app.services.Inspection.service import InspectionService
from app.services.Inspection.schema import (
    InspectionChecklistResponse,
    InspectionPropertyResponse,
    InspectionSpaceResponse,
    CaptureUploadResponse,
)

router = APIRouter(
    prefix="/inspection",
    tags=["Inspection"],
)


# ============================================================
# GET INSPECTION CHECKLIST
# ============================================================

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

                # ------------------------------------------------
                # USE LATEST INSPECTION CAPTURE IMAGE
                # ------------------------------------------------
                imageUrl=(
                    f"/v1/inspection/properties/{property_id}"
                    f"/spaces/{space.id}"
                    f"/captures/{capture.id}/image"
                    if capture is not None and capture.capture_image_url
                    else None
                ),

                # ------------------------------------------------
                # USE ACTUAL CAPTURE STATUS
                # ------------------------------------------------
                status=_checklist_capture_status(capture),
            )
            for space, capture in spaces
        ],
    )


def _checklist_capture_status(capture: InspectionCapture | None) -> str:
    if capture is None:
        return "pending"
    if capture.capture_status in (CaptureStatus.PENDING, CaptureStatus.PROCESSING):
        return "processing"
    if capture.capture_status == CaptureStatus.OK:
        return "completed"
    return "rejected"


# ============================================================
# GET MASTER IMAGE
#
# This endpoint is still available because the master image
# may still be needed elsewhere.
#
# It is NO LONGER used by the inspection checklist.
# ============================================================

@router.get(
    "/properties/{property_id}/spaces/{space_id}/master-image",
    response_class=FileResponse,
)
def get_inspection_master_image(
    property_id: str,
    space_id: str,
    current_user: AppUser = Depends(require_worker),
    db: Session = Depends(get_db),
):
    service = InspectionService(db)

    try:
        image_path = service.get_master_image_path(
            user_id=current_user.id,
            property_id=property_id,
            space_id=space_id,
        )

    except (PermissionError, LookupError) as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found or worker is not assigned to this property.",
        ) from exc

    return FileResponse(image_path)


# ============================================================
# UPLOAD INSPECTION CAPTURE
# ============================================================

@router.post(
    "/properties/{property_id}/spaces/{space_id}/capture",
    response_model=CaptureUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_capture(
    property_id: str,
    space_id: str,
    photo: UploadFile = File(...),
    current_user: AppUser = Depends(require_worker),
    db: Session = Depends(get_db),
):
    max_image_size = 15 * 1024 * 1024

    content = await photo.read(max_image_size + 1)

    if len(content) > max_image_size:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="Image file is too large.",
        )

    service = InspectionService(db)

    try:
        capture = service.save_capture(
            user_id=current_user.id,
            property_id=property_id,
            space_id=space_id,
            content=content,
            content_type=photo.content_type,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    except FileExistsError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(exc),
        ) from exc

    except PermissionError as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(exc),
        ) from exc

    except LookupError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    return CaptureUploadResponse(
        captureId=capture.id,
        spaceId=space_id,
        imageUrl=(
            f"/v1/inspection/properties/{property_id}"
            f"/spaces/{space_id}"
            f"/captures/{capture.id}/image"
        ),
        status=_checklist_capture_status(capture),
        capturedAt=capture.capture_time,
    )


# ============================================================
# GET INSPECTION CAPTURE IMAGE
# ============================================================

@router.get(
    "/properties/{property_id}/spaces/{space_id}/captures/{capture_id}/image",
    response_class=FileResponse,
)
def get_capture_image(
    property_id: str,
    space_id: str,
    capture_id: str,
    current_user: AppUser = Depends(require_worker),
    db: Session = Depends(get_db),
):
    service = InspectionService(db)

    try:
        image_path = service.get_capture_image_path(
            user_id=current_user.id,
            property_id=property_id,
            space_id=space_id,
            capture_id=capture_id,
        )

    except PermissionError as exc:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(exc),
        ) from exc

    except LookupError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        ) from exc

    return FileResponse(image_path)