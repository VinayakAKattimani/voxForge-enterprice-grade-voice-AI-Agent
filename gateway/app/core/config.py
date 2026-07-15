from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str
    app_version: str

    host: str
    port: int

    auth_service_url: str
    conversation_service_url: str
    llm_service_url: str
    knowledge_service_url: str

    jwt_secret_key: str
    jwt_algorithm: str

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False
    )


settings = Settings()