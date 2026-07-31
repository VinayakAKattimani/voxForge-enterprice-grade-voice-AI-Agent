from pydantic import BaseModel


class TTSResponse(BaseModel):
    message: str
    provider: str
    audio_path: str | None = None


class VoiceResponse(BaseModel):
    id: str
    language: str
    gender: str
    description: str