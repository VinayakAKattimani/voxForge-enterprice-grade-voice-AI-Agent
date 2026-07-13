from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.repositories.conversation_repository import ConversationRepository
from app.services.conversation_service import ConversationService


def get_conversation_repository(
    db: AsyncSession = Depends(get_db),
) -> ConversationRepository:
    return ConversationRepository(db)


def get_conversation_service(
    repository: ConversationRepository = Depends(
        get_conversation_repository
    ),
) -> ConversationService:
    return ConversationService(repository)