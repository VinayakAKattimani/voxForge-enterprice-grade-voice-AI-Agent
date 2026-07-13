from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.models.message import Message
from app.repositories.base_repository import BaseRepository


class MessageRepository(BaseRepository[Message]):
    def __init__(self, db: Session):
        super().__init__(Message, db)

    def get_by_conversation_id(
        self,
        conversation_id: UUID,
    ) -> list[Message]:
        result = self.db.execute(
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.asc())
        )

        return list(result.scalars().all())