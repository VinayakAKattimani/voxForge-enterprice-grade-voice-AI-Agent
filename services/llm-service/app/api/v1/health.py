from fastapi import APIRouter

from app.core.config import settings

router = APIRouter()


@router.get("/health")
async def health():

    return {
        "status": "UP",
        "provider": settings.LLM_PROVIDER,
        "model": settings.OLLAMA_MODEL
    }