from fastapi import APIRouter, Request

from app.schemas.tts import TTSRequest
from app.services.proxy import proxy_request


router = APIRouter(
    prefix="/tts",
    tags=["Text-to-Speech"],
)


@router.post("/synthesize")
async def synthesize(
    tts_request: TTSRequest,
    request: Request,
):
    return await proxy_request(
        service_name="tts",
        request=request,
        target_path="/api/v1/tts/synthesize",
        body=tts_request.model_dump(),
    )


@router.get("/voices")
async def get_voices(
    request: Request,
):
    return await proxy_request(
        service_name="tts",
        request=request,
        target_path="/api/v1/tts/voices",
    )
