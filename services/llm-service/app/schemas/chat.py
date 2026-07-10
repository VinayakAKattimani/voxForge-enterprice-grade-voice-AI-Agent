from pydantic import BaseModel, Field, field_validator


class ChatRequest(BaseModel):
    message: str = Field(
        ...,
        min_length=1,
        max_length=4000,
        description="User message"
    )

    conversation_id: str = Field(
        ...,
        min_length=1,
        max_length=100
    )

    user_id: str | None = None

    stream: bool = False
    
    @field_validator("message")
    @classmethod
    def validate_message(cls, value: str):

        if not value.strip():
            raise ValueError("Message cannot be empty.")

        return value.strip()


class ChatResponse(BaseModel):
    response: str   