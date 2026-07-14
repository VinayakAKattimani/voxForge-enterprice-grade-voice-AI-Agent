from uuid import UUID

from sqlalchemy.orm import Session

from app.models.document import Document
from app.models.enums import DocumentStatus
from app.services.chunk_service import ChunkService
from app.services.chunking_service import ChunkingService
from app.services.parser_service import ParserService
from app.models.document_chunk import DocumentChunk


class DocumentProcessorService:

    def __init__(self, db: Session):
        self.db = db
        self.parser_service = ParserService()
        self.chunking_service = ChunkingService()
        self.chunk_service = ChunkService(db)

    def process_document(
        self,
        document_id: UUID,
    ):

        document = (
            self.db.query(Document)
            .filter(Document.id == document_id)
            .first()
        )

        if not document:
            return

        try:
            document.status = DocumentStatus.PROCESSING
            self.db.commit()
            self.db.refresh(document)

            text = self.parser_service.extract_text(
                document.file_path
            )

            chunks = self.chunking_service.chunk_text(
                text
            )

            self.chunk_service.save_chunks(
                document.id,
                chunks,
            )

            document.status = DocumentStatus.COMPLETED

            self.db.commit()

        except Exception:
            self.db.rollback()

            document.status = DocumentStatus.FAILED

            self.db.commit()

            raise 

    def delete_chunks(
        self,
        document_id: UUID,
    ):

        (
            self.db.query(DocumentChunk)
            .filter(
                DocumentChunk.document_id == document_id
            )
            .delete()
        )

        self.db.commit()