from pydantic import BaseModel

from app.utils.enums import TranscriptionStatus


class JobResponse(BaseModel):
    job_id: int
    status: TranscriptionStatus
    message: str