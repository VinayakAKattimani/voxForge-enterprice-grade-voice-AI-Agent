from pydantic import BaseModel
from uuid import UUID

class SearchRequest(BaseModel):
    query: str
    limit: int = 5
    document_id: UUID | None = None

class SearchResultResponse(BaseModel):
    chunk_id: UUID
    document_id: UUID
    text: str
    score: float