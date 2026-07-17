from pydantic import BaseModel
from app.schemas.message import Message
from uuid import UUID


class LLMChatRequest(BaseModel):
    conversation_id: UUID
    messages: list[Message]


class LLMChatResponse(BaseModel):
    response: str