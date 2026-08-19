from uuid import UUID

from pydantic import BaseModel


class KnowledgeSearchRequest(BaseModel):

    query: str

    limit: int = 5


class KnowledgeSearchResult(BaseModel):

    chunk_id: UUID

    document_id: UUID

    text: str

    score: float