from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct, Filter, FieldCondition, MatchValue
from app.core.config import settings
from uuid import UUID


class QdrantProvider:

    def __init__(self):
        print("Qdrant Provider Started")
        self.client = QdrantClient(
            host=settings.QDRANT_HOST,
            port=settings.QDRANT_PORT,
        )
        self.create_collection()

    def create_collection(self):

        collections = self.client.get_collections()

        names = [
            collection.name
            for collection in collections.collections
        ]

        if settings.QDRANT_COLLECTION not in names:

            self.client.create_collection(
                collection_name=settings.QDRANT_COLLECTION,
                vectors_config=VectorParams(
                    size=768,
                    distance=Distance.COSINE,
                ),
            )

    def upsert_vectors(
        self,
        document_id: UUID,
        chunk_ids: list[UUID],
        chunks: list[str],
        embeddings: list[list[float]],
    ):

        points = []

        for chunk_id, chunk, embedding in zip(
            chunk_ids,
            chunks,
            embeddings,
        ):

            points.append(
                PointStruct(
                    id=str(chunk_id),
                    vector=embedding,
                    payload={
                        "document_id": str(document_id),
                        "chunk_id": str(chunk_id),
                        "text": chunk,
                    },
                )
            )

        self.client.upsert(
            collection_name=settings.QDRANT_COLLECTION,
            points=points,
        )

    def search_vectors(
        self,
        query_embedding: list[float],
        limit: int = 5,
        document_id: UUID | None = None,
    ):

        query_filter = None

        if document_id:
            query_filter = Filter(
                must=[
                    FieldCondition(
                        key="document_id",
                        match=MatchValue(
                            value=str(document_id),
                        ),
                    )
                ]
            )

        results = self.client.query_points(
            collection_name=settings.QDRANT_COLLECTION,
            query=query_embedding,
            limit=limit,
            query_filter=query_filter,
        )

        return results.points