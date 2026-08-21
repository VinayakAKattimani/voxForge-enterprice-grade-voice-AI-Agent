from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    LLM_PROVIDER: str = "ollama"

    OLLAMA_BASE_URL: str
    OLLAMA_GENERATE_ENDPOINT: str
    OLLAMA_TAGS_ENDPOINT: str
    OLLAMA_MODEL: str
    KNOWLEDGE_SERVICE_URL: str

    GROQ_API_KEY: str | None = None
    GROQ_MODEL: str = "llama-3.1-8b-instant"
    GROQ_BASE_URL: str = "https://api.groq.com/openai/v1"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()