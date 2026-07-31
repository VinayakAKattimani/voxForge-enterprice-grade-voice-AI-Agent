from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "TTS Service"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "Enterprise Text-to-Speech Service"
    APP_ENV: str = "development"

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8006

    # API
    API_V1_PREFIX: str = "/api/v1"

    # Logging
    LOG_LEVEL: str = "INFO"

    # TTS
    TTS_PROVIDER: str = "kokoro"
    DEFAULT_VOICE: str = "af_heart"
    DEFAULT_LANGUAGE: str = "en"
    DEFAULT_AUDIO_FORMAT: str = "wav"
    DEFAULT_SAMPLE_RATE: int = 24000

    # Storage
    AUDIO_OUTPUT_DIR: str = "generated"

    KOKORO_MODEL_PATH: str = "models/kokoro"
    KOKORO_DEVICE: str = "cpu"

    LOG_DIR: str = "logs"
    LOG_FILE: str = "tts-service.log"

    AUDIO_DIR: str = "storage/audio"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()