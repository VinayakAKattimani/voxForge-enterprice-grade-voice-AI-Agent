from app.core.config import settings
from app.providers.kokoro_provider import KokoroProvider


_provider = None


def create_tts_provider():

    global _provider

    if _provider is None:

        if settings.TTS_PROVIDER == "kokoro":
            _provider = KokoroProvider()

        else:
            raise ValueError(
                f"Unsupported provider {settings.TTS_PROVIDER}"
            )

    return _provider