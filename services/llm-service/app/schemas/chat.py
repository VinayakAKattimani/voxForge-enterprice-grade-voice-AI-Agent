from enum import Enum
from pydantic import BaseModel


class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class ChatMessage(BaseModel):
    role: MessageRole
    content: str


class ChatRequest(BaseModel):
    conversation_id: str
    messages: list[ChatMessage]


class ChatResponse(BaseModel):
    response: str