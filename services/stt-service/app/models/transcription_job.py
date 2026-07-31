from sqlalchemy import Column, DateTime, Enum, Float, Integer, String, Text
from sqlalchemy.sql import func

from app.models.base import Base
from app.utils.enums import TranscriptionStatus


class TranscriptionJob(Base):
    __tablename__ = "transcription_jobs"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(String, nullable=True)

    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String, nullable=False)

    language = Column(String, nullable=True)
    transcript = Column(Text, nullable=True)

    status = Column(
        Enum(TranscriptionStatus),
        nullable=False,
        default=TranscriptionStatus.PENDING
    )

    duration_seconds = Column(Float, nullable=True)
    processing_time_ms = Column(Float, nullable=True)

    error_message = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )