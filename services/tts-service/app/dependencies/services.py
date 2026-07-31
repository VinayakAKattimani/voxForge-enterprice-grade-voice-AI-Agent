from app.dependencies.providers import get_tts_provider
from app.services.tts_service import TTSService


def get_tts_service():
    provider = get_tts_provider()

    return TTSService(
        provider=provider
    )