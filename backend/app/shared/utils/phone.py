import re

import phonenumbers
from phonenumbers import PhoneNumberFormat


def normalize_phone(value: object) -> str:
    if not isinstance(value, str):
        raise ValueError("Phone number must be a string.")

    if not re.fullmatch(r"\+[1-9]\d{10,12}", value):
        raise ValueError(
            "Phone number must use E.164 format: +, country code, and 10 national digits."
        )

    try:
        parsed_number = phonenumbers.parse(value, None)
    except phonenumbers.NumberParseException as exc:
        raise ValueError("Phone number must include a valid country calling code.") from exc

    if len(phonenumbers.national_significant_number(parsed_number)) != 10:
        raise ValueError("Phone number must contain exactly 10 digits after the country code.")
    if not phonenumbers.is_valid_number(parsed_number):
        raise ValueError("Phone number is not valid for the specified country code.")

    if phonenumbers.format_number(parsed_number, PhoneNumberFormat.E164) != value:
        raise ValueError("Phone number must be in canonical E.164 format.")

    return value