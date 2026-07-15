from jose import JWTError, jwt

from app.core.config import settings


def verify_token(token: str) -> dict:
    return jwt.decode(
        token,
        settings.jwt_secret_key,
        algorithms=[settings.jwt_algorithm],
    )