from fastapi import FastAPI

from app.core.config import settings
from app.api.routes.health import router as health_router
from app.api.routes.transcription import router as transcription_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)

app.include_router(
    health_router,
    prefix=settings.API_V1_STR,
)

app.include_router(
    transcription_router,
    prefix=settings.API_V1_STR,
)