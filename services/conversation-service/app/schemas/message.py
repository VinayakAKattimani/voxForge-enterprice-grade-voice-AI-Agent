from enum import Enum
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


# Incoming API request
class MessageCreate(BaseModel):
    role: MessageRole
    content: str


# Sending messages to LLM service
class Message(BaseModel):
    role: MessageRole
    content: str


# API response
class MessageResponse(BaseModel):
    id: UUID
    conversation_id: UUID
    role: MessageRole
    content: str

    model_config = ConfigDict(
        from_attributes=True
    )