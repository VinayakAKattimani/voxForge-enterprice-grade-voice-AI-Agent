from pydantic import BaseModel, Field


class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1)
    voice: str | None = None
    language: str = "en"
