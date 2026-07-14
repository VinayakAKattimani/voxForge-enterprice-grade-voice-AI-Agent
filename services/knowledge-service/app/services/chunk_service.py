from uuid import UUID

from sqlalchemy.orm import Session

from app.models.document_chunk import DocumentChunk


class ChunkService:

    def __init__(self, db: Session):
        self.db = db

    def save_chunks(
        self,
        document_id: UUID,
        chunks: list[str],
    ) -> list[DocumentChunk]:

        # Delete existing chunks (useful if document is reprocessed)
        (
            self.db.query(DocumentChunk)
            .filter(DocumentChunk.document_id == document_id)
            .delete()
        )

        saved_chunks = []

        for index, chunk in enumerate(chunks):

            document_chunk = DocumentChunk(
                document_id=document_id,
                chunk_index=index,
                chunk_text=chunk,
            )

            self.db.add(document_chunk)
            saved_chunks.append(document_chunk)

        self.db.commit()

        return saved_chunks