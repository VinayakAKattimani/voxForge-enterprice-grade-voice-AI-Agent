from uuid import UUID

from app.providers.ollama import OllamaEmbeddingProvider
from app.providers.qdrant_provider import QdrantProvider
from app.schemas.search import SearchResultResponse
from app.core.config import settings


class RetrievalService:

    def __init__(self):
        self.embedding_provider = OllamaEmbeddingProvider()
        self.qdrant_provider = QdrantProvider()

    async def search(
        self,
        query: str,
        owner_id: UUID,
        limit: int = 5,
        document_id: UUID | None = None,
    ):

        query_embedding = await self.embedding_provider.generate_embedding(
            query
        )

        results = self.qdrant_provider.search_vectors(
            query_embedding=query_embedding,
            limit=limit,
            owner_id=owner_id,
            document_id=document_id,
        )

        response = []

        for result in results:

            print("=" * 50)
            print("SCORE:", result.score)
            print("DOCUMENT:", result.payload["document_id"])
            print("OWNER:", result.payload["owner_id"])
            print("PUBLIC:", result.payload["is_public"])
            print(result.payload["text"][:150])

            if result.score < settings.SEARCH_SCORE_THRESHOLD:
                continue

            response.append(
                SearchResultResponse(
                    chunk_id=result.payload["chunk_id"],
                    document_id=result.payload["document_id"],
                    text=result.payload["text"],
                    score=result.score,
                )
            )

        return response