from pydantic import BaseModel


class DocumentStatsResponse(BaseModel):

    total_documents: int
    pending: int
    processing: int
    completed: int
    failed: int
    total_chunks: int