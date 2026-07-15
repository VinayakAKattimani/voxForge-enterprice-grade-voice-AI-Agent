from jose import JWTError

from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from fastapi.responses import JSONResponse

from app.core.public_routes import PUBLIC_ROUTES
from app.core.jwt import verify_token


class AuthenticationMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next):
        print(request.method, request.url.path)
        route = (request.method, request.url.path)
        route = (request.method, request.url.path)

        print("CURRENT ROUTE:", route)
        print("PUBLIC ROUTES:", PUBLIC_ROUTES)
        print("IS PUBLIC:", route in PUBLIC_ROUTES)
        
        # Allow public routes
        if route in PUBLIC_ROUTES:
            return await call_next(request)

        authorization = request.headers.get("Authorization")

        if authorization is None:
            return JSONResponse(
                status_code=401,
                content={"detail": "Authorization header missing."},
            )

        # Check Bearer scheme
        if not authorization.startswith("Bearer "):
            return JSONResponse(
                status_code=401,
                content={"detail": "Invalid authorization header."},
            )

        token = authorization.split(" ", 1)[1]

        try:
            payload = verify_token(token)

            # Store user info for later use
            request.state.user_id = payload["sub"]
            request.state.email = payload["email"]

        except JWTError:
            return JSONResponse(
                status_code=401,
                content={"detail": "Invalid or expired token."},
            )

        return await call_next(request)