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

    DATABASE_URL: str

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


    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()