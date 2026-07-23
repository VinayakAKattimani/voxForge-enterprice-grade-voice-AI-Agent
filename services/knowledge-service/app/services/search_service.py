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
        print("RESULTS:", results)
        print("POINTS COUNT:", len(results))

        response = []

        for point in results:

            print("=" * 50)
            print("Payload:", point.payload)
            print("Chunk ID Type:", type(point.payload["chunk_id"]))
            print("Document ID Type:", type(point.payload["document_id"]))
            print("Score:", point.score)
            print("=" * 50)

            response.append(
                SearchResultResponse(
                    chunk_id=point.payload["chunk_id"],
                    document_id=point.payload["document_id"],
                    text=point.payload["text"],
                    score=point.score,
                )
            )
        print("Response Size:", len(response))
        print(response)

        return response