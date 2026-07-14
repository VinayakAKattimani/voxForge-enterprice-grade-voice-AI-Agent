from uuid import UUID

from sqlalchemy.orm import Session

from app.models.document import Document
from app.models.enums import DocumentStatus
from app.services.chunk_service import ChunkService
from app.services.chunking_service import ChunkingService
from app.services.parser_service import ParserService
from app.models.document_chunk import DocumentChunk
from app.providers.ollama import OllamaEmbeddingProvider
from app.providers.qdrant_provider import QdrantProvider

class DocumentProcessorService:

    def __init__(self, db: Session):
        self.db = db
        self.parser_service = ParserService()
        self.chunking_service = ChunkingService()
        self.chunk_service = ChunkService(db)

        self.embedding_provider = OllamaEmbeddingProvider()
        self.qdrant_provider = QdrantProvider()

    async def process_document(
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

            saved_chunks = self.chunk_service.save_chunks(
                document.id,
                chunks,
            )
            embeddings = []

            for chunk in saved_chunks:
                embedding = await self.embedding_provider.generate_embedding(
                    chunk.chunk_text
                )

                embeddings.append(embedding)

            self.qdrant_provider.upsert_vectors(
                document.id,
                [chunk.id for chunk in saved_chunks],
                [chunk.chunk_text for chunk in saved_chunks],
                embeddings,
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