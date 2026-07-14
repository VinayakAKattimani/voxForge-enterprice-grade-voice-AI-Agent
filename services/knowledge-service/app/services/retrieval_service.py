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
        limit: int = 5,
    ):

        query_embedding = await self.embedding_provider.generate_embedding(
            query
        )

        results = self.qdrant_provider.search_vectors(
            query_embedding,
            limit,
        )

        response = []

        for result in results:
            print("=" * 50)
            print(result.score)
            print(result.payload["text"][:150])

            if result.score < settings.SEARCH_SCORE_THRESHOLD:
                continue
            # if result.score < 0.4:
            #     continue

            response.append(
                SearchResultResponse(
                    chunk_id=result.payload["chunk_id"],
                    document_id=result.payload["document_id"],
                    text=result.payload["text"],
                    score=result.score,
                )
            )

        return response