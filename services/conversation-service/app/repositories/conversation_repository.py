from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models.conversation import Conversation
from app.repositories.base_repository import BaseRepository


class ConversationRepository(BaseRepository[Conversation]):
    def __init__(self, db: Session):
        super().__init__(Conversation, db)

    def get_by_user_id(
        self,
        user_id: UUID,
    ) -> list[Conversation]:
        result = self.db.execute(
            select(Conversation)
            .where(Conversation.user_id == user_id)
            .order_by(Conversation.created_at.desc())
        )

        return list(result.scalars().all())