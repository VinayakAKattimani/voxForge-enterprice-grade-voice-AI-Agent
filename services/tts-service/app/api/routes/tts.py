from fastapi import APIRouter, Depends

from app.dependencies.services import get_tts_service
from app.schemas.request import TTSRequest
from app.services.tts_service import TTSService
from fastapi.responses import FileResponse

router = APIRouter(
    prefix="/tts",
    tags=["TTS"]
)


@router.post("/synthesize")
async def synthesize(
    request: TTSRequest,
    service: TTSService = Depends(get_tts_service),
):

    result = await service.synthesize(request)

    return FileResponse(
        path=result["audio_path"],
        media_type="audio/wav"
    )

@router.get("/voices")
async def get_voices(
    service: TTSService = Depends(get_tts_service)
):

    return await service.get_voices()