from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str
    APP_VERSION: str
    API_V1_STR: str

    POSTGRES_SERVER: str
    POSTGRES_PORT: int
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

    UPLOAD_DIR: str
    TRANSCRIPT_DIR: str

    MAX_AUDIO_SIZE_MB: int

    ALLOWED_AUDIO_TYPES: str

    STT_PROVIDER: str

    WHISPER_MODEL: str
    DEVICE: str
    COMPUTE_TYPE: str

    KAFKA_BOOTSTRAP_SERVERS: str

    WHISPER_MODEL: str = "small"
    WHISPER_DEVICE: str = "cpu"
    WHISPER_COMPUTE_TYPE: str = "int8"

    MAX_FILE_SIZE_MB: int = 100

    ALLOWED_AUDIO_EXTENSIONS: str = "mp3,wav,m4a,flac,ogg,webm"

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql://{self.POSTGRES_USER}:"
            f"{self.POSTGRES_PASSWORD}@"
            f"{self.POSTGRES_SERVER}:"
            f"{self.POSTGRES_PORT}/"
            f"{self.POSTGRES_DB}"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()