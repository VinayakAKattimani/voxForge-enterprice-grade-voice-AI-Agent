from fastapi import FastAPI

from app.core.config import settings
from app.api.routes.transcription import router as transcription_router
from app.core.exceptions import (
    register_exception_handlers
)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION
)

register_exception_handlers(app)

app.include_router(
    transcription_router,
    prefix=settings.API_V1_STR
)


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": settings.APP_NAME
    }