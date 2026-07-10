from app.core.config import settings
from app.providers.base import LLMProvider
from app.providers.ollama_provider import OllamaProvider


class ProviderFactory:

    @staticmethod
    def get_provider() -> LLMProvider:

        if settings.LLM_PROVIDER.lower() == "ollama":
            return OllamaProvider()

        raise ValueError(
            f"Unsupported LLM provider: {settings.LLM_PROVIDER}"
        )