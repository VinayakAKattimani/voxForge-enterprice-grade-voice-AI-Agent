from uuid import UUID

from app.repositories.conversation_repository import ConversationRepository
from app.schemas.conversation import (
    ConversationCreate,
)


class ConversationService:
    def __init__(
        self,
        conversation_repository: ConversationRepository,
    ):
        self.conversation_repository = conversation_repository

    def create_conversation(
        self,
        user_id: UUID,
        conversation: ConversationCreate,
    ):
        return self.conversation_repository.create(
            user_id=user_id,
            title=conversation.title,
        )

    def get_conversation(
        self,
        conversation_id: UUID,
    ):
        return self.conversation_repository.get_by_id(
            conversation_id
        )

    def get_user_conversations(
        self,
        user_id: UUID,
    ):
        return self.conversation_repository.get_by_user_id(
            user_id
        )
    
    def update_conversation(
        self,
        conversation_id: UUID,
        title: str,
    ):
        conversation = self.conversation_repository.get_by_id(
            conversation_id
        )

        if not conversation:
            raise HTTPException(
                status_code=404,
                detail="Conversation not found",
            )

        return self.conversation_repository.update(
            conversation,
            title=title,
        )