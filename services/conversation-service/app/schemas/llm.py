from pydantic import BaseModel


class LLMChatRequest(BaseModel):
    message: str
    conversation_id: str
    user_id: str | None = None
    stream: bool = False


class LLMChatResponse(BaseModel):
    response: str