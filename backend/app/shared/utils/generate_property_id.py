import secrets

from typing import Optional
 
# 28-character unambiguous alphabet (No 0, O, 1, I, L, 8, B)

SAFE_ALPHABET = "2345679ACDEFGHJKMNPQRSTVWXYZ"
 
 
def generate_property_code(length: int = 6, prefix: Optional[str] = None) -> str:

    """Generates a secure, unambiguous property or invitation code.
 
    Examples:

        generate_property_code(6, 'PROP') -> 'PROP-7KX-9M2'

        generate_property_code(6)         -> 'X4N-8M3'

    """

    # Select cryptographically secure random characters from the alphabet

    code = "".join(secrets.choice(SAFE_ALPHABET) for _ in range(length))
 
    # Format 6-character codes as XXX-XXX for improved readability

    if length == 6:

        code = f"{code[:3]}-{code[3:]}"
 
    return f"{prefix.upper()}-{code}" if prefix else code
 
 
 