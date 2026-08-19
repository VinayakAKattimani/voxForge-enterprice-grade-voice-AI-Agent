from uuid import UUID

from pydantic import BaseModel

from app.schemas.message import Message


class LLMChatRequest(BaseModel):
    conversation_id: UUID
    user_id: UUID
    messages: list[Message]
    context: str | None = None


class LLMChatResponse(BaseModel):
    response: str