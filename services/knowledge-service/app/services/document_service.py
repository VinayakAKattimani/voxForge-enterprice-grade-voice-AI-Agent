from pathlib import Path
from uuid import UUID, uuid4
from sqlalchemy import func
from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
from app.core.config import settings
from app.models.document import Document
from app.models.enums import DocumentStatus
from app.services.storage_service import StorageService
from app.services.document_processor_service import DocumentProcessorService
from app.models.document_chunk import DocumentChunk

class DocumentService:

    def __init__(self, db: Session):
        self.db = db
        self.storage_service = StorageService()

    async def upload_document(
        self,
        file: UploadFile,
    ) -> Document:

        self._validate_file(file)

        document_id = uuid4()

        file_path = await self.storage_service.save_file(
            document_id,
            file,
        )

        document = Document(
            id=document_id,
            title=Path(file.filename).stem,
            filename=file.filename,
            file_path=file_path,
            content_type=file.content_type,
            file_size=Path(file_path).stat().st_size,
            status=DocumentStatus.PENDING,
        )

        try:
            self.db.add(document)
            self.db.commit()
            self.db.refresh(document)



        except Exception:
            self.db.rollback()
            self.storage_service.delete_file(file_path)

            raise

        return document

    def _validate_file(self, file: UploadFile) -> None:

        allowed_types = {
            item.strip()
            for item in settings.ALLOWED_FILE_TYPES.split(",")
        }

        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail="Unsupported file type.",
            )
        
    def get_documents(self) -> list[Document]:
        return self.db.query(Document).all()
    
    def get_document(
        self,
        document_id: UUID,
    ) -> Document:
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

        return document
    
    def delete_document(
        self,
        document_id: UUID,
    ) -> dict[str, str]:
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

        try:
            self.storage_service.delete_file(
                document.file_path
            )

            self.db.delete(document)
            self.db.commit()

        except Exception:
            self.db.rollback()

            raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete document.",
            )

        return {
            "message": "Document deleted successfully"
        }
    
    def download_document(
        self,
        document_id: UUID,
    ) -> FileResponse:

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

        return FileResponse(
            path=document.file_path,
            filename=document.filename,
            media_type=document.content_type,
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
    
    def reprocess_document(
        self,
        document_id: UUID,
    ) -> Document:
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

        processor = DocumentProcessorService(self.db)

        processor.delete_chunks(document_id)

        document.status = DocumentStatus.PROCESSING
        self.db.commit()
        self.db.refresh(document)

        return document
    
    def get_stats(self):

        return {
            "total_documents": self.db.query(Document).count(),

            "pending": self.db.query(Document).filter(
                Document.status == DocumentStatus.PENDING
            ).count(),

            "processing": self.db.query(Document).filter(
                Document.status == DocumentStatus.PROCESSING
            ).count(),

            "completed": self.db.query(Document).filter(
                Document.status == DocumentStatus.COMPLETED
            ).count(),

            "failed": self.db.query(Document).filter(
                Document.status == DocumentStatus.FAILED
            ).count(),

            "total_chunks": self.db.query(DocumentChunk).count(),
        }