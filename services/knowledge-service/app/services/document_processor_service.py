from uuid import UUID

from sqlalchemy.orm import Session
import traceback
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

            print("=" * 80)
            print(f"TOTAL CHUNKS: {len(chunks)}")

            for index, chunk in enumerate(chunks):
                print("=" * 80)
                print(f"CHUNK {index}")
                print(chunk)


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
                document_id=document.id,
                owner_id=document.owner_id,
                filename=document.filename,
                title=document.title,
                is_public=document.is_public,
                chunk_ids=[chunk.id for chunk in saved_chunks],
                chunks=[chunk.chunk_text for chunk in saved_chunks],
                embeddings=embeddings,
            )

            document.status = DocumentStatus.COMPLETED

            self.db.commit()

        except Exception as e:
            print("=" * 80)
            print("DOCUMENT PROCESSING FAILED")
            print(e)
            traceback.print_exc()
            print("=" * 80)

            self.db.rollback()

            document.status = DocumentStatus.FAILED
            self.db.commit()

            raise 

    def delete_chunks(
        self,
        document_id: UUID,
    ):

        # 1. Delete vectors from Qdrant
        self.qdrant_provider.delete_document_vectors(
            document_id
        )

        # 2. Delete chunks from PostgreSQL
        (
            self.db.query(DocumentChunk)
            .filter(
                DocumentChunk.document_id == document_id
            )
            .delete()
        )

        self.db.commit()    