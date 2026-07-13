from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.repositories.message_repository import MessageRepository
from app.repositories.conversation_repository import ConversationRepository
from app.services.message_service import MessageService
from app.clients.llm_client import LLMClient


def get_message_service(
    db: Session = Depends(get_db),
) -> MessageService:
    message_repository = MessageRepository(db)
    conversation_repository = ConversationRepository(db)
    llm_client = LLMClient()

    return MessageService(
        message_repository=message_repository,
        conversation_repository=conversation_repository,
        llm_client=llm_client
    )