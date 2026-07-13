from uuid import UUID

from fastapi import HTTPException, status

from app.repositories.conversation_repository import ConversationRepository
from app.repositories.message_repository import MessageRepository
from app.schemas.message import MessageCreate
from app.clients.llm_client import LLMClient
from app.schemas.llm import LLMChatRequest


class MessageService:
    def __init__(
        self,
        message_repository: MessageRepository,
        conversation_repository: ConversationRepository,
        llm_client: LLMClient
    ):
        self.message_repository = message_repository
        self.conversation_repository = conversation_repository
        self.llm_client = llm_client

    def create_message(
        self,
        conversation_id: UUID,
        message: MessageCreate,
        request_id: str | None = None
    ):
        conversation = self.conversation_repository.get_by_id(
            conversation_id
        )

        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found",
            )

        user_message = self.message_repository.create(
            conversation_id=conversation_id,
            role=message.role,
            content=message.content,
        )

        llm_request = LLMChatRequest(
            message=message.content,
            conversation_id=str(conversation_id),
        )

        llm_response = self.llm_client.generate_response(
            llm_request,
            request_id=request_id,
        )

        assistant_message = self.message_repository.create(
            conversation_id=conversation_id,
            role="assistant",
            content=llm_response.response,
        )

        return assistant_message

    def get_messages(
        self,
        conversation_id: UUID,
    ):
        conversation = self.conversation_repository.get_by_id(
        conversation_id
        )

        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found",
            )
        return self.message_repository.get_by_conversation_id(
            conversation_id
        )