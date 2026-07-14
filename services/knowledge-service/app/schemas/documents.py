from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.models.enums import DocumentStatus


class DocumentResponse(BaseModel):
    id: UUID
    title: str
    filename: str
    file_path: str
    content_type: str
    file_size: int
    status: DocumentStatus
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True,
    }


class DocumentListResponse(BaseModel):
    documents: list[DocumentResponse]