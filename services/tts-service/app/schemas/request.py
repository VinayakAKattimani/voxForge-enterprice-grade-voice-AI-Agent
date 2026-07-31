from pydantic import BaseModel, Field


class TTSRequest(BaseModel):
    text: str = Field(
        ...,
        min_length=1,
        description="Text to convert into speech"
    )

    voice: str | None = Field(
        default=None,
        description="Voice identifier"
    )

    language: str = Field(
        default="en",
        description="Speech language"
    )