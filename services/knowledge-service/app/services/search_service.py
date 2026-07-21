from app.providers.ollama import OllamaEmbeddingProvider
from app.providers.qdrant_provider import QdrantProvider
from app.schemas.search import (
    SearchRequest,
    SearchResultResponse,
)


class SearchService:

    def __init__(self):
        self.embedding_provider = OllamaEmbeddingProvider()
        self.qdrant_provider = QdrantProvider()

    async def search(
        self,
        request: SearchRequest,
    ):

        query_embedding = await self.embedding_provider.generate_embedding(
            request.query
        )

        results = self.qdrant_provider.search_vectors(
            query_embedding=query_embedding,
            limit=request.limit,
            document_id=request.document_id,
        )

        response = []

        for point in results:

            response.append(
                SearchResultResponse(
                    chunk_id=point.payload["chunk_id"],
                    document_id=point.payload["document_id"],
                    text=point.payload["text"],
                    score=point.score,
                )
            )

        return response