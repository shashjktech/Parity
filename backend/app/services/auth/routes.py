from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session as DBSession

from app.shared.db.config.session import get_db
from app.services.auth.schema import (
    AvailabilityCheckRequest,
    AvailabilityResponse,
    LoginRequest,
    RefreshTokenRequest,
    SignupRequest,
    TokenResponse,
)
from app.services.auth.service import AuthService

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/check-availability", response_model=AvailabilityResponse, status_code=status.HTTP_200_OK)
async def check_availability(data: AvailabilityCheckRequest, db: DBSession = Depends(get_db)):
    return AuthService.check_availability(db=db, data=data)


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    request: Request,
    data: SignupRequest, 
    db: DBSession = Depends(get_db)
):
    ip_address = request.client.host if request.client else None
    device_info = request.headers.get("user-agent")
    return AuthService.register(
        db=db, 
        data=data,
        ip_address=ip_address,
        device_info=device_info,
    )


@router.post("/login", response_model=TokenResponse, status_code=status.HTTP_200_OK)
async def login(
    request: Request,
    data: LoginRequest,
    db: DBSession = Depends(get_db),
):
    ip_address = request.client.host if request.client else None
    device_info = request.headers.get("user-agent")
    return AuthService.login(
        db=db,
        data=data,
        ip_address=ip_address,
        device_info=device_info,
    )


@router.post("/refresh", response_model=TokenResponse, status_code=status.HTTP_200_OK)
async def refresh_token(
    request: Request,
    data: RefreshTokenRequest,
    db: DBSession = Depends(get_db),
):
    ip_address = request.client.host if request.client else None
    device_info = request.headers.get("user-agent")
    return AuthService.rotate_refresh_token(
        db=db,
        data=data,
        ip_address=ip_address,
        device_info=device_info,
    )
    
@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(
    data: RefreshTokenRequest,
    db: DBSession = Depends(get_db),
):
    AuthService.logout(db=db, data=data)
    return {"message": "Successfully logged out."}