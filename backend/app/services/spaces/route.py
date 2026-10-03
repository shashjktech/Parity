from pathlib import Path
import logging

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from fastapi.responses import FileResponse
from pydantic import ValidationError
from sqlalchemy.orm import Session
# Database session dependency
from app.shared.db.config.session import get_db

# Owner authentication dependency (adjust to your auth provider)
from app.core.dependencies import get_current_user  # Must verify caller has Owner ('O') role
from app.shared.db.models import AppUser
from app.shared.db.enums import SpaceType
# Schemas and Service
from app.services.spaces.schema import (
    SpaceResponse,
    SpaceCreateRequest,
    SpaceCreateResponse,
    MasterImageUploadResponse,
)
from app.services.spaces.service import SpaceService

router = APIRouter(prefix="/properties", tags=["Properties"])
logger = logging.getLogger(__name__)


@router.get(
    "/{property_id}/spaces",
    response_model=list[SpaceResponse],
)
def get_property_spaces(
    property_id: str,
    space_type: SpaceType | None = Query(default=None),
    current_user: AppUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = SpaceService(db)

    try:
        spaces = service.get_spaces_by_property(
            property_id=property_id,
            user_id=current_user.id,
            space_type=space_type,
        )
        return [
            SpaceResponse(
                id=space.id,
                property_id=space.property_id,
                type=(
                    "asset"
                    if space.space_type == SpaceType.ASSETS
                    else space.space_type.name.lower()
                ),
                name=space.name,
                description=space.description,
                image_url=(
                    f"/v1/properties/{property_id}/spaces/{space.id}/master-image"
                    if any(
                        image.master_image_url
                        and Path(image.master_image_url).is_file()
                        for image in space.master_images
                    )
                    else None
                ),
                created_at=space.created_at,
            )
            for space in spaces
        ]

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except PermissionError as exc:
        raise HTTPException(
            status_code=401,
            detail=str(exc),
        )

    except LookupError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )


@router.get(
    "/{property_id}/spaces/{space_id}/master-image",
    response_class=FileResponse,
)
def get_master_image(
    property_id: str,
    space_id: str,
    current_user: AppUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = SpaceService(db)
    try:
        image_path = service.get_master_image_path(
            property_id=property_id,
            space_id=space_id,
            user_id=current_user.id,
        )
        logger.info(
            "Master image served for property_id=%s space_id=%s user_id=%s",
            property_id,
            space_id,
            current_user.id,
        )
        return FileResponse(image_path)
    except ValueError as exc:
        logger.warning("Invalid master image request: %s", exc)
        raise HTTPException(status_code=400, detail=str(exc))
    except PermissionError as exc:
        logger.warning(
            "Unauthorized master image request property_id=%s space_id=%s user_id=%s: %s",
            property_id,
            space_id,
            current_user.id,
            exc,
        )
        raise HTTPException(status_code=401, detail=str(exc))
    except LookupError as exc:
        logger.warning(
            "Master image not found property_id=%s space_id=%s: %s",
            property_id,
            space_id,
            exc,
        )
        raise HTTPException(status_code=404, detail=str(exc))


@router.post(
    "/{property_id}/spaces/add",
    response_model=SpaceCreateResponse,
    status_code=201,
)
async def add_space(
    property_id: str,
    space_type: str = Form(..., alias="type"),
    name: str = Form(...),
    description: str | None = Form(default=None),
    prompt_id: str | None = Form(default=None, alias="promptId"),
    photo: UploadFile | None = File(default=None),
    current_user: AppUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = SpaceService(db)
    logger.info(
        "Space creation requested property_id=%s user_id=%s type=%s has_photo=%s",
        property_id,
        current_user.id,
        space_type,
        photo is not None,
    )

    try:
        try:
            payload = SpaceCreateRequest(
                type=space_type,
                name=name,
                description=description,
                promptId=prompt_id,
            )
        except ValidationError as exc:
            logger.warning(
                "Invalid space creation fields property_id=%s user_id=%s errors=%s",
                property_id,
                current_user.id,
                exc.errors(include_input=False),
            )
            raise HTTPException(
                status_code=422,
                detail="Invalid space details.",
            ) from exc

        image_content = None
        content_type = None
        if photo is not None:
            max_image_size = 15 * 1024 * 1024
            image_content = await photo.read(max_image_size + 1)
            if len(image_content) > max_image_size:
                logger.warning(
                    "Space photo too large property_id=%s user_id=%s bytes=%s",
                    property_id,
                    current_user.id,
                    len(image_content),
                )
                raise HTTPException(status_code=413, detail="Image file is too large.")
            content_type = photo.content_type
            logger.info(
                "Space photo received property_id=%s user_id=%s content_type=%s bytes=%s",
                property_id,
                current_user.id,
                content_type,
                len(image_content),
            )

        result = service.add_space(
            property_id=property_id,
            user_id=current_user.id,
            space_type=payload.type,
            name=payload.name,
            prompt_id=payload.prompt_id,
            description=payload.description,
            image_content=image_content,
            content_type=content_type,
        )

        space = result["space"]
        master_image = result["master_image"]

        logger.info(
            "Space creation succeeded property_id=%s space_id=%s master_image_id=%s user_id=%s has_photo=%s",
            property_id,
            space.id,
            master_image.id,
            current_user.id,
            bool(master_image.master_image_url),
        )
        return SpaceCreateResponse(
            space_id=space.id,
            master_image_id=master_image.id,
            property_id=space.property_id,
            name=space.name,
            type=space.space_type.value,
            prompt_id=master_image.prompt_id,
        )

    except ValueError as exc:
        logger.warning(
            "Space creation rejected property_id=%s user_id=%s: %s",
            property_id,
            current_user.id,
            exc,
        )
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except PermissionError as exc:
        logger.warning(
            "Unauthorized space creation property_id=%s user_id=%s: %s",
            property_id,
            current_user.id,
            exc,
        )
        raise HTTPException(
            status_code=401,
            detail=str(exc),
        )

    except LookupError as exc:
        logger.warning(
            "Space creation resource not found property_id=%s user_id=%s: %s",
            property_id,
            current_user.id,
            exc,
        )
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )
    except HTTPException:
        raise
    except Exception:
        logger.exception(
            "Unexpected space creation failure property_id=%s user_id=%s",
            property_id,
            current_user.id,
        )
        raise


@router.post(
    "/{property_id}/spaces/{space_id}/master-image",
    response_model=MasterImageUploadResponse,
)
async def upload_master_image(
    property_id: str,
    space_id: str,
    photo: UploadFile = File(...),
    current_user: AppUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    
    max_image_size = 15 * 1024 * 1024
    content = await photo.read(max_image_size + 1)
    if len(content) > max_image_size:
        raise HTTPException(status_code=413, detail="Image file is too large.")

    service = SpaceService(db)
    try:
        image_path = service.upload_master_image(
            property_id=property_id,
            space_id=space_id,
            user_id=current_user.id,
            content=content,
            content_type=photo.content_type,
        )
        return MasterImageUploadResponse(image_path=image_path)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except PermissionError as exc:
        raise HTTPException(status_code=401, detail=str(exc))
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc))