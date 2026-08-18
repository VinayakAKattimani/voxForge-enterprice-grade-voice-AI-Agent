from datetime import datetime
from uuid import UUID

from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
    FilterSelector,
)

from app.core.config import settings


class QdrantProvider:

    def __init__(self):
        print("Qdrant Provider Started")

        self.client = QdrantClient(
            host=settings.QDRANT_HOST,
            port=settings.QDRANT_PORT,
        )

        self.create_collection()

    # ==================================================
    # CREATE COLLECTION
    # ==================================================

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

    # ==================================================
    # UPSERT VECTORS
    # ==================================================

    def upsert_vectors(
        self,
        document_id: UUID,
        owner_id: UUID,
        filename: str,
        title: str,
        is_public: bool,
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
                        "owner_id": str(owner_id),
                        "chunk_id": str(chunk_id),
                        "filename": filename,
                        "title": title,
                        "text": chunk,
                        "uploaded_at": datetime.utcnow().isoformat(),
                        "is_public": is_public,
                    },
                )
            )

        print(f"UPSERTING {len(points)} POINTS")

        self.client.upsert(
            collection_name=settings.QDRANT_COLLECTION,
            points=points,
        )

    # ==================================================
    # SEARCH VECTORS
    # ==================================================

    def search_vectors(
        self,
        query_embedding: list[float],
        owner_id: UUID,
        limit: int = 5,
        document_id: UUID | None = None,
    ):

        must_conditions = []

        # ----------------------------------------------
        # Optional document filter
        # ----------------------------------------------

        if document_id:

            must_conditions.append(
                FieldCondition(
                    key="document_id",
                    match=MatchValue(
                        value=str(document_id),
                    ),
                )
            )

    # ----------------------------------------------
    # Access control
    #
    # User can retrieve:
    # 1. Their own documents
    # 2. Any public document
    #
    # owner_id == current user
    # OR
    # is_public == True
    # ----------------------------------------------

        access_filter = Filter(
            should=[
                Filter(
                    must=[
                        FieldCondition(
                            key="owner_id",
                            match=MatchValue(
                                value=str(owner_id),
                            ),
                        )
                    ]
                ),
                Filter(
                    must=[
                        FieldCondition(
                            key="is_public",
                            match=MatchValue(
                                value=True,
                            ),
                        )
                    ]
                ),
            ]
        )

    # ----------------------------------------------
    # Combine document filter + access control
    # ----------------------------------------------

        if must_conditions:

            query_filter = Filter(
                must=must_conditions,
                should=access_filter.should,
            )

        else:

            query_filter = access_filter

        print("OWNER FILTER:", owner_id)
        print("DOCUMENT FILTER:", document_id)
        print("QUERY FILTER:", query_filter)

        results = self.client.query_points(
            collection_name=settings.QDRANT_COLLECTION,
            query=query_embedding,
            limit=limit,
            query_filter=query_filter,
        )

        return results.points

    # ==================================================
    # DELETE DOCUMENT VECTORS
    # ==================================================

    def delete_document_vectors(
        self,
        document_id: UUID,
    ):

        self.client.delete(
            collection_name=settings.QDRANT_COLLECTION,
            points_selector=FilterSelector(
                filter=Filter(
                    must=[
                        FieldCondition(
                            key="document_id",
                            match=MatchValue(
                                value=str(document_id),
                            ),
                        )
                    ]
                )
            ),
        )

        print(
            f"Deleted Qdrant vectors for document: {document_id}"
        )

    # ==================================================
    # UPDATE DOCUMENT VISIBILITY
    # ==================================================

    def update_document_visibility(
        self,
        document_id: UUID,
        is_public: bool,
    ):

        self.client.set_payload(
            collection_name=settings.QDRANT_COLLECTION,
            payload={
                "is_public": is_public,
            },
            points=Filter(
                must=[
                    FieldCondition(
                        key="document_id",
                        match=MatchValue(
                            value=str(document_id),
                        ),
                    )
                ]
            ),
        )

        print(
            f"Updated Qdrant visibility for document "
            f"{document_id}: {is_public}"
        )