from datetime import datetime

from pydantic import BaseModel

from app.utils.enums import TranscriptionStatus


class TranscriptionResponse(BaseModel):

    id: int
    filename: str
    status: TranscriptionStatus
    transcript: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True