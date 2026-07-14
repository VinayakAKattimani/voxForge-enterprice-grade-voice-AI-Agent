from uuid import UUID, uuid4

from sqlalchemy import ForeignKey, Integer, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin



class DocumentChunk(Base, TimestampMixin):
    __tablename__ = "document_chunks"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)

    document_id: Mapped[UUID] = mapped_column(
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=False,
    )

    chunk_index: Mapped[int] = mapped_column(Integer, nullable=False)

    chunk_text: Mapped[str] = mapped_column(Text, nullable=False)

    document = relationship("Document", back_populates="chunks")