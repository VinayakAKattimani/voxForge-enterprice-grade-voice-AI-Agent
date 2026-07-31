from app.providers.base import BaseTTSProvider
from app.schemas.request import TTSRequest


class TTSService:

    def __init__(
        self,
        provider: BaseTTSProvider
    ):
        self.provider = provider


    async def synthesize(
        self,
        request: TTSRequest
    ):
        return await self.provider.synthesize(
            text=request.text,
            voice=request.voice,
            language=request.language,
        )


    async def get_voices(self):
        return await self.provider.get_voices()

    def health(self):

        return {
            "provider": "kokoro",
        "model_loaded": self.provider.is_ready()
        }