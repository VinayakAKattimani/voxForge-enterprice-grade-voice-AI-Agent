from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    LLM_PROVIDER: str = "ollama"

    OLLAMA_BASE_URL: str
    OLLAMA_GENERATE_ENDPOINT: str
    OLLAMA_TAGS_ENDPOINT: str
    OLLAMA_MODEL: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()