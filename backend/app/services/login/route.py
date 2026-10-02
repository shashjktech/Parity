from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.shared.db.config.session import get_db

from app.services.login.loginPayLoad import (
    SigninRequest,
    SigninResponse,
    RefreshRequest,
    RefreshResponse
)

from app.services.login.service import AuthService


router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@router.post(
    "/signin",
    response_model=SigninResponse
)
def signin(
    data: SigninRequest,
    db: Session = Depends(get_db)
):
    return AuthService.signin(
        db=db,
        data=data
    )

@router.post(
    "/refresh",
    response_model=RefreshResponse
)
def refresh(
    data: RefreshRequest,
    db: Session = Depends(get_db)
):
    return AuthService.refresh(
        db=db,
        data=data
    )