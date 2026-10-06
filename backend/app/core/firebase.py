import logging

import firebase_admin
from firebase_admin import auth, credentials
from app.core.config import settings
from app.shared.utils.phone import normalize_phone

logger = logging.getLogger(__name__)


def init_firebase() -> None:
    if not firebase_admin._apps:
        cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
        firebase_admin.initialize_app(cred)


def verify_phone_token(id_token: str, expected_phone: str) -> bool:
    if not id_token:
        logger.warning("Phone verification rejected: Firebase ID token is missing")
        return False

    # Mock OTP tokens are accepted only in development.
    if settings.ENVIRONMENT == "development" and id_token in {
        "dev-bypass-token",
        "mock-firebase-id-token",
    }:
        logger.info("Phone verification accepted using a development mock token")
        return True

    try:
        decoded_token = auth.verify_id_token(id_token)
    except Exception as exc:
        logger.warning(
            "Firebase ID token rejected (%s): %s",
            type(exc).__name__,
            str(exc),
        )
        return False

    firebase_phone = decoded_token.get("phone_number")
    if not firebase_phone:
        logger.warning("Phone verification rejected: token has no phone_number claim")
        return False
    try:
        normalized_firebase_phone = normalize_phone(firebase_phone)
    except ValueError as exc:
        logger.warning("Phone verification rejected: token phone is not valid E.164 with 10 national digits")
        return False

    if normalized_firebase_phone != expected_phone:
        logger.warning("Phone verification rejected: verified phone does not match submitted phone")
        return False

    logger.info("Phone verification succeeded")
    return True