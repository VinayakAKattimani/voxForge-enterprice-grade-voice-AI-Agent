from pydantic import BaseModel


class ChatResponse(BaseModel):
    response: str


class ModelResponse(BaseModel):
    name: str
    provider: str