from typing import List
from uuid import UUID

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    UploadFile,
    status,
)
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.dependencies.db import get_db
from app.schemas.document_chunks import DocumentChunkResponse
from app.schemas.document_stats import DocumentStatsResponse
from app.schemas.documents import DocumentResponse
from app.services.document_processor_service import DocumentProcessorService
from app.services.document_service import DocumentService

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


@router.post(
    "/upload",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    document_service = DocumentService(db)

    document = await document_service.upload_document(file)

    processor = DocumentProcessorService(db)

    background_tasks.add_task(
        processor.process_document,
        document.id,
    )

    return document


@router.get(
    "",
    response_model=List[DocumentResponse],
)
def get_documents(
    db: Session = Depends(get_db),
):
    document_service = DocumentService(db)

    return document_service.get_documents()


@router.get(
    "/stats",
    response_model=DocumentStatsResponse,
)
def get_stats(
    db: Session = Depends(get_db),
):
    document_service = DocumentService(db)

    return document_service.get_stats()


@router.get(
    "/{document_id}/download",
)
def download_document(
    document_id: UUID,
    db: Session = Depends(get_db),
) -> FileResponse:
    document_service = DocumentService(db)

    return document_service.download_document(
        document_id
    )


@router.get(
    "/{document_id}/chunks",
    response_model=List[DocumentChunkResponse],
)
def get_document_chunks(
    document_id: UUID,
    db: Session = Depends(get_db),
):
    document_service = DocumentService(db)

    return document_service.get_document_chunks(
        document_id
    )


@router.post(
    "/{document_id}/reprocess",
    response_model=DocumentResponse,
)
def reprocess_document(
    document_id: UUID,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    document_service = DocumentService(db)

    document = document_service.reprocess_document(
        document_id
    )

    processor = DocumentProcessorService(db)

    background_tasks.add_task(
        processor.process_document,
        document_id,
    )

    return document


@router.get(
    "/{document_id}",
    response_model=DocumentResponse,
)
def get_document(
    document_id: UUID,
    db: Session = Depends(get_db),
):
    document_service = DocumentService(db)

    return document_service.get_document(
        document_id
    )


@router.delete(
    "/{document_id}",
)
def delete_document(
    document_id: UUID,
    db: Session = Depends(get_db),
):
    document_service = DocumentService(db)

    return document_service.delete_document(
        document_id
    )