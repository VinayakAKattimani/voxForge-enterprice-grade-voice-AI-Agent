from datetime import datetime

from pydantic import BaseModel

from app.utils.enums import TranscriptionStatus


class TranscriptionResponse(BaseModel):

    id: int
    user_id: str | None

    filename: str
    mime_type: str

    language: str | None

    transcript: str | None

    status: TranscriptionStatus

    duration_seconds: float | None
    processing_time_ms: float | None

    error_message: str | None

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True