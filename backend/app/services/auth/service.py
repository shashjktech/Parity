from datetime import datetime, timedelta, timezone
import logging
from typing import Optional
import secrets
from fastapi import status
from sqlalchemy import or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session as DBSession

from app.core.config import settings
from app.core.exceptions import AppError
from app.core.firebase import verify_phone_token
from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
)
from app.services.auth.schema import (
    AvailabilityCheckRequest,
    AvailabilityResponse,
    LoginRequest,
    RefreshTokenRequest,
    SignupRequest,
    TokenResponse,
)
from app.shared.db.models.user import AppUser
from app.shared.db.models.user_session import UserSession

logger = logging.getLogger(__name__)


def generate_id() -> str:
    return f"{secrets.randbelow(10**6):06d}"


class AuthService:
    @staticmethod
    def check_availability(db: DBSession, data: AvailabilityCheckRequest) -> AvailabilityResponse:
        existing_user = db.query(AppUser).filter(
            or_(AppUser.email == data.email, AppUser.phone == data.phone)
        ).first()

        if existing_user:
            if existing_user.email == data.email:
                logger.info("Account availability conflict: email is already registered")
                return AvailabilityResponse(
                    is_available=False,
                    detail="This email is already registered.",
                    conflict_field="email",
                )
            logger.info("Account availability conflict: phone is already registered")
            return AvailabilityResponse(
                is_available=False,
                detail="This phone number is already registered.",
                conflict_field="phone",
            )

        return AvailabilityResponse(is_available=True)
    
    @classmethod
    def logout(cls, db: DBSession, data: RefreshTokenRequest) -> None:
        session = (
            db.query(UserSession)
            .filter(UserSession.refresh_token == data.refresh_token)
            .first()
        )
        
        # If the session exists, mark it as revoked to invalidate it
        if session:
            session.is_revoked = True
            try:
                db.commit()
            except Exception as exc:
                db.rollback()
                logger.error("Logout failed while revoking session (%s)", type(exc).__name__)
                raise AppError(
                    "LOGOUT_FAILED",
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "Unable to sign out right now.",
                ) from None
            logger.info("Logout succeeded; session revoked")
        else:
            logger.info("Logout requested for an unknown or previously rotated refresh token")

    @classmethod
    def register(
        cls, 
        db: DBSession, 
        data: SignupRequest,
        ip_address: Optional[str] = None,
        device_info: Optional[str] = None,
    ) -> TokenResponse:
        # 1. Final duplicate check to prevent race conditions
        availability = cls.check_availability(
            db, AvailabilityCheckRequest(email=data.email, phone=data.phone)
        )
        if not availability.is_available:
            cls.raise_availability_error(availability)

        
        print("payload from frontend", data)
        # 2. Verify Firebase OTP Token against the provided phone
        #verify_phone_token(id_token=data.firebaseIdToken, expected_phone=data.phone)

        # 3. Create User
        new_user = AppUser(
            id=generate_id(),
            firstName=data.firstName,
            lastName=data.lastName,
            email=data.email,
            phone=data.phone,
            isPhoneVerified=True,
            passwordHash=hash_password(data.password),
            userRole=data.role,
        )

        db.add(new_user)
        try:
            db.flush()
            db.refresh(new_user)
        except IntegrityError:
            db.rollback()
            availability = cls.check_availability(
                db, AvailabilityCheckRequest(email=data.email, phone=data.phone)
            )
            if not availability.is_available:
                logger.warning(
                    "Signup blocked by a database uniqueness conflict: field=%s",
                    availability.conflict_field,
                )
                cls.raise_availability_error(availability)
            logger.error("Signup database insert failed with an integrity error")
            raise AppError(
                "SIGNUP_FAILED",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                "Unable to create the account right now.",
            ) from None
        except Exception as exc:
            db.rollback()
            logger.error("Signup database insert failed (%s)", type(exc).__name__)
            raise AppError(
                "SIGNUP_FAILED",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                "Unable to create the account right now.",
            ) from None

        # 4. Log the user in immediately upon successful registration
        logger.info("Signup user record staged; creating authentication session")
        return cls.create_or_rotate_session(db, new_user, ip_address, device_info)

    @classmethod
    def login(
        cls,
        db: DBSession,
        data: LoginRequest,
        ip_address: Optional[str] = None,
        device_info: Optional[str] = None,
    ) -> TokenResponse:


        stmt = select(AppUser).where(
            or_(
                AppUser.email == data.login_id,
                AppUser.phone == data.login_id
                )
            )
        
        user = db.scalar(stmt)

        if not user or not user.passwordHash or not verify_password(data.password, user.passwordHash):
            logger.warning("Login rejected: credentials did not match")
            raise AppError(
                "INVALID_CREDENTIALS",
                status.HTTP_401_UNAUTHORIZED,
                "Invalid credentials provided.",
            )

        return cls.create_or_rotate_session(
            db=db,
            user=user,
            ip_address=ip_address,
            device_info=device_info,
        )

    @staticmethod
    def create_or_rotate_session(
        db: DBSession,
        user: AppUser,
        ip_address: Optional[str] = None,
        device_info: Optional[str] = None,
        existing_session: Optional[UserSession] = None,
    ) -> TokenResponse:
        role_value = (
            user.userRole.value
            if hasattr(user.userRole, "value")
            else str(user.userRole)
        )

        new_refresh_token = create_refresh_token()
        refresh_expires = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(
            days=settings.REFRESH_TOKEN_EXPIRE_DAYS
        )

        if existing_session:
            session_id = existing_session.id
            existing_session.refresh_token = new_refresh_token
            existing_session.expires_at = refresh_expires
            if ip_address:
                existing_session.ip_address = ip_address
            if device_info:
                existing_session.device_info = device_info
        else:
            new_session = UserSession(
                id=generate_id(),
                user_id=user.id,
                refresh_token=new_refresh_token,
                device_info=device_info,
                ip_address=ip_address,
                is_revoked=False,
                expires_at=refresh_expires,
            )
            db.add(new_session)
            session_id = new_session.id

        access_token = create_access_token(
            data={"sub": user.id, "role": role_value, "sid": session_id}
        )

        response = TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token,
            user=user,
        )
        print("Response :" , response)
        try:
            db.commit()
        except Exception as exc:
            db.rollback()
            logger.error("Authentication session persistence failed (%s)", type(exc).__name__)
            raise AppError(
                "SESSION_PERSISTENCE_FAILED",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                "Unable to create the authentication session right now.",
            ) from None

        logger.info("Authentication session created or rotated")
        return response

    @classmethod
    def rotate_refresh_token(
        cls,
        db: DBSession,
        data: RefreshTokenRequest,
        ip_address: Optional[str] = None,
        device_info: Optional[str] = None,
    ) -> TokenResponse:
        session = (
            db.query(UserSession)
            .filter(UserSession.refresh_token == data.refresh_token)
            .first()
        )

        if not session or session.is_revoked:
            logger.warning("Refresh rejected: token is missing or revoked")
            raise AppError(
                "INVALID_REFRESH_TOKEN",
                status.HTTP_401_UNAUTHORIZED,
                "Invalid or revoked refresh token.",
            )

        current_time = datetime.utcnow()
        if session.expires_at < current_time:
            logger.warning("Refresh rejected: token has expired")
            raise AppError(
                "REFRESH_TOKEN_EXPIRED",
                status.HTTP_401_UNAUTHORIZED,
                "Refresh token expired. Please sign in again.",
            )

        user = db.query(AppUser).filter(AppUser.id == session.user_id).first()
        if not user:
            logger.error("Refresh failed: session references a missing user")
            raise AppError(
                "USER_NOT_FOUND",
                status.HTTP_404_NOT_FOUND,
                "Your account could not be found.",
            )

        return cls.create_or_rotate_session(
            db=db,
            user=user,
            ip_address=ip_address,
            device_info=device_info,
            existing_session=session,
        )

    @staticmethod
    def raise_availability_error(availability: AvailabilityResponse) -> None:
        field = availability.conflict_field
        if field == "email":
            raise AppError(
                "EMAIL_TAKEN",
                status.HTTP_409_CONFLICT,
                availability.detail or "This email is already registered.",
            )
        if field == "phone":
            raise AppError(
                "PHONE_TAKEN",
                status.HTTP_409_CONFLICT,
                availability.detail or "This phone number is already registered.",
            )
        raise AppError(
            "ACCOUNT_CONFLICT",
            status.HTTP_409_CONFLICT,
            "An account with these details is already registered.",
        )
        