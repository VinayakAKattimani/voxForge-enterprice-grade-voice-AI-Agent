from pydantic import BaseModel


class TranscriptionOptions(BaseModel):

    language: str | None = None