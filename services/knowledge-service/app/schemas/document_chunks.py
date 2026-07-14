from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict
from app.models.document_chunk import DocumentChunk

class DocumentChunkResponse(BaseModel):

    id: UUID
    document_id: UUID
    chunk_index: int
    chunk_text: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )

    def get_document_chunks(
        self,
        document_id: UUID,
    ):

        document = (
            self.db.query(Document)
            .filter(Document.id == document_id)
            .first()
        )

        if not document:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Document not found",
            )

        return (
            self.db.query(DocumentChunk)
            .filter(
                DocumentChunk.document_id == document_id
            )
            .order_by(
                DocumentChunk.chunk_index
            )
            .all()
        )