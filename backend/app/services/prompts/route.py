from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.shared.db.config.session import get_db
from app.shared.db.models import AppUser
from app.core.dependencies import get_current_user

from .schema import PromptCreateRequest, PromptResponse
from .service import PromptService


router = APIRouter(
    prefix="/properties",
    tags=["Prompts"],
)


@router.get(
    "/{property_id}/prompts",
    response_model=list[PromptResponse],
    status_code=status.HTTP_200_OK,
)
def get_property_prompts(
    property_id: str,
    current_user: AppUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = PromptService(db)

    try:
        return service.get_prompts_by_property(
            property_id=property_id,
            user_id=current_user.id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

    except PermissionError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        )

    except LookupError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )


@router.post(
    "/{property_id}/prompts/add",
    response_model=PromptResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_property_prompt(
    property_id: str,
    payload: PromptCreateRequest,
    current_user: AppUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = PromptService(db)

    try:
        return service.add_prompt(
            property_id=property_id,
            name=payload.name,
            user_id=current_user.id,
            prompt_text=payload.promptText,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )

    except PermissionError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
        )

    except LookupError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )