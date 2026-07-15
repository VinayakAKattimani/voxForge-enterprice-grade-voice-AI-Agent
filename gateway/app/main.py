from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI

from app.api.router import api_router
from app.core.config import settings
from app.services.http_client import set_http_client
from app.exceptions.handlers import register_exception_handlers
from app.middleware.request_id import RequestIDMiddleware
from app.middleware.authentication import AuthenticationMiddleware
from app.core.openapi import custom_openapi

@asynccontextmanager
async def lifespan(app: FastAPI):
    client = httpx.AsyncClient(
        timeout=30.0
    )

    set_http_client(client)

    print("HTTP Client initialized.")

    yield

    await client.aclose()

    print("HTTP Client closed.")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
)

app.add_middleware(RequestIDMiddleware)
app.add_middleware(AuthenticationMiddleware)
app.openapi = lambda: custom_openapi(app)

register_exception_handlers(app)

app.include_router(api_router)