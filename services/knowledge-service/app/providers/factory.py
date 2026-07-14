from app.core.config import settings
from app.providers.base import BaseEmbeddingProvider
from app.providers.ollama import OllamaEmbeddingProvider


class EmbeddingProviderFactory:

    @staticmethod
    def get_provider() -> BaseEmbeddingProvider:

        provider = settings.EMBEDDING_PROVIDER.lower()

        if provider == "ollama":
            return OllamaEmbeddingProvider()

        raise ValueError(
            f"Unsupported embedding provider: {provider}"
        )