from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path
from pydantic import computed_field


class Settings(BaseSettings):
    APP_NAME: str
    APP_VERSION: str
    API_V1_STR: str

    POSTGRES_SERVER: str
    POSTGRES_PORT: int
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

    @computed_field
    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql://{self.POSTGRES_USER}:"
            f"{self.POSTGRES_PASSWORD}@"
            f"{self.POSTGRES_SERVER}:"
            f"{self.POSTGRES_PORT}/"
            f"{self.POSTGRES_DB}"
        )

    UPLOAD_DIR: str
    MAX_FILE_SIZE_MB: int
    ALLOWED_FILE_TYPES: str

    EMBEDDING_PROVIDER: str
    OLLAMA_BASE_URL: str
    OLLAMA_EMBEDDING_MODEL: str

    QDRANT_HOST: str
    QDRANT_PORT: int
    QDRANT_COLLECTION: str
    SEARCH_SCORE_THRESHOLD: float = 0.65

    KAFKA_BOOTSTRAP_SERVERS: str

    KAFKA_BOOTSTRAP_SERVERS: str


    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )



print("=" * 80)
print("Current working directory:", Path.cwd())
print("Expected .env:", Path(".env").resolve())
print("Exists:", Path(".env").exists())
print("=" * 80)

settings = Settings()