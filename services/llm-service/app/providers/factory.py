from app.core.config import settings
from app.providers.base import LLMProvider
from app.providers.ollama_provider import OllamaProvider
from app.providers.groq_provider import GroqProvider


class ProviderFactory:

    @staticmethod
    def get_provider() -> LLMProvider:

        provider = settings.LLM_PROVIDER.lower()

        if provider == "ollama":
            return OllamaProvider()

        if provider == "groq":
            return GroqProvider()

        raise ValueError(
            f"Unsupported LLM provider: {settings.LLM_PROVIDER}"
        )