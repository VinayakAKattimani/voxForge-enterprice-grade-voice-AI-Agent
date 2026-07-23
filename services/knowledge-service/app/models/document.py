from sqlalchemy import String, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from uuid import UUID, uuid4

from app.models.base import Base, TimestampMixin
from app.models.enums import DocumentStatus
from sqlalchemy import Uuid


class Document(Base, TimestampMixin):
    __tablename__ = "documents"

    id: Mapped[UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid4
    )

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    filename: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    content_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    file_size: Mapped[int] = mapped_column(
        nullable=False
    )

    file_path: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    content_hash: Mapped[str] = mapped_column(
        String(64),
        unique=True,
        nullable=False,
        index=True,
    )

    status: Mapped[DocumentStatus] = mapped_column(
        Enum(DocumentStatus),
        default=DocumentStatus.PENDING,
        nullable=False,
    )

    chunks = relationship(
        "DocumentChunk",
        back_populates="document",
        cascade="all, delete-orphan",
    )