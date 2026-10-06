from typing import Literal, Optional

from pydantic import (
    AliasChoices,
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_validator,
    model_validator,
)
from app.shared.db.enums import Role
from app.shared.utils.phone import normalize_phone


class SignupRequest(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    phone: str
    password: str
    role: Role
    firebaseIdToken: str = Field(
        validation_alias=AliasChoices("firebaseIdToken", "firebase_id_token")
    )
    propertyCode: Optional[str] = Field(
        default=None,
        validation_alias=AliasChoices("propertyCode", "property_code"),
    )
    
    @field_validator("propertyCode", mode="before")
    @classmethod
    def normalize_property_code(cls, value: object) -> Optional[str]:
        if value is None:
            return None
        return str(value).strip().upper()
    
    @model_validator(mode="after")
    def require_property_code_for_workers(self):
        if self.role == Role.WORKER and not self.propertyCode:
            raise ValueError("Property code is required for workers.")
        return self

    @field_validator("phone", mode="before")
    @classmethod
    def normalize_phone(cls, value: object) -> str:
        return normalize_phone(value)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    firstName: str
    lastName: str
    email: str
    phone: Optional[str] = None
    role: Role = Field(validation_alias=AliasChoices("role", "userRole"))


class AvailabilityCheckRequest(BaseModel):
    email: EmailStr
    phone: str

    @field_validator("phone", mode="before")
    @classmethod
    def normalize_phone_field(cls, value: object) -> str:
        return normalize_phone(value)


class AvailabilityResponse(BaseModel):
    is_available: bool
    detail: Optional[str] = None
    conflict_field: Optional[Literal["email", "phone"]] = None


class LoginRequest(BaseModel):
    login_id: str
    password: str

    @field_validator("login_id", mode="before")
    @classmethod
    def normalize_login_id(cls, value: object) -> str:
        if value is None:
            raise ValueError("Login ID is required")

        value = str(value).strip()

        if not value:
            raise ValueError("Login ID is required")

        # Normalize phone numbers if login_id looks like a phone number
        if value.replace("+", "").replace(" ", "").replace("-", "").isdigit():
            return normalize_phone(value) or value

        # Otherwise treat it as email
        return value.lower()

    @model_validator(mode="after")
    def check_identifier(self):
        if not self.login_id:
            raise ValueError("Email or phone must be provided for login.")

        return self

class RefreshTokenRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: UserResponse