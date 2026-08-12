from fastapi import APIRouter, Depends

from app.dependencies.services import get_tts_service
from app.services.tts_service import TTSService

router = APIRouter()


@router.get("/health")
async def health(
    service: TTSService = Depends(get_tts_service),
):
    health = service.health()

    return {
        "status": "healthy",
        "service": "tts-service",
        "provider": health["provider"],
        "model_loaded": health["model_loaded"],
        "version": "1.0.0",
    }