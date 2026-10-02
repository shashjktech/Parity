from datetime import datetime
import logging

from fastapi import Depends, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session as DBSession

from app.core.config import settings
from app.core.exceptions import AppError
from app.shared.db.enums import Role
from app.shared.db.config.session import get_db
from app.shared.db.models.user import AppUser
from app.shared.db.models.user_session import UserSession

logger = logging.getLogger(__name__)

security = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: DBSession = Depends(get_db),
) -> AppUser:
    if credentials is None:
        logger.warning("Access rejected: authorization credentials are missing")
        raise AppError(
            "UNAUTHORIZED",
            status.HTTP_401_UNAUTHORIZED,
            "Please sign in to continue.",
        )

    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError as exc:
        logger.warning("Access rejected: JWT validation failed (%s)", type(exc).__name__)
        raise AppError(
            "UNAUTHORIZED",
            status.HTTP_401_UNAUTHORIZED,
            "Your session is invalid or expired. Please sign in again.",
        )

    user_id = payload.get("sub")
    session_id = payload.get("sid")
    if payload.get("type") != "access" or not isinstance(user_id, str) or not isinstance(session_id, str):
        logger.warning("Access rejected: JWT is missing a valid access type, subject, or session ID")
        raise AppError(
            "UNAUTHORIZED",
            status.HTTP_401_UNAUTHORIZED,
            "Your session is invalid. Please sign in again.",
        )

    session = (
        db.query(UserSession)
        .filter(UserSession.id == session_id, UserSession.user_id == user_id)
        .first()
    )
    if not session or session.is_revoked:
        logger.warning("Access rejected: session is missing or revoked")
        raise AppError(
            "UNAUTHORIZED",
            status.HTTP_401_UNAUTHORIZED,
            "Your session is invalid or has been revoked. Please sign in again.",
        )
    if session.expires_at <= datetime.utcnow():
        logger.warning("Access rejected: backing session has expired")
        raise AppError(
            "UNAUTHORIZED",
            status.HTTP_401_UNAUTHORIZED,
            "Your session has expired. Please sign in again.",
        )

    user = db.query(AppUser).filter(AppUser.id == user_id).first()
    if not user:
        logger.warning("Access rejected: token subject does not identify an existing user")
        raise AppError(
            "UNAUTHORIZED",
            status.HTTP_401_UNAUTHORIZED,
            "Your account could not be found. Please sign in again.",
        )
    return user


def require_owner(current_user: AppUser = Depends(get_current_user)) -> AppUser:
    if current_user.userRole != Role.OWNER:
        raise AppError(
            "FORBIDDEN",
            status.HTTP_403_FORBIDDEN,
            "An owner account is required for this action.",
        )
    return current_user


def require_worker(current_user: AppUser = Depends(get_current_user)) -> AppUser:
    if current_user.userRole != Role.WORKER:
        raise AppError(
            "FORBIDDEN",
            status.HTTP_403_FORBIDDEN,
            "A worker account is required for this action.",
        )
    return current_user