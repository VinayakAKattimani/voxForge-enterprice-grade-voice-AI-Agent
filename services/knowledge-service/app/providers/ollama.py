from httpx import AsyncClient

from app.core.config import settings
from app.providers.base import BaseEmbeddingProvider


class OllamaEmbeddingProvider(BaseEmbeddingProvider):

    async def generate_embedding(
        self,
        text: str,
    ) -> list[float]:

        async with AsyncClient() as client:

            response = await client.post(
                f"{settings.OLLAMA_BASE_URL}/api/embeddings",
                json={
                    "model": settings.OLLAMA_EMBEDDING_MODEL,
                    "prompt": text,
                },
            )

            response.raise_for_status()

            data = response.json()

            return data["embedding"]