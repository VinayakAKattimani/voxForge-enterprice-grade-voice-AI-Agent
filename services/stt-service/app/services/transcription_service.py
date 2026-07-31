import time
from pathlib import Path

from sqlalchemy.orm import Session
from faster_whisper import WhisperModel

from app.models.transcription_job import TranscriptionJob
from app.repositories.transcription_repository import TranscriptionRepository
from app.utils.enums import TranscriptionStatus
from app.core.config import settings
from app.core.logger import logger

class TranscriptionService:

    def __init__(self):
        self.repository = TranscriptionRepository()

        self.model = WhisperModel(
            settings.WHISPER_MODEL,
            device=settings.WHISPER_DEVICE,
            compute_type=settings.WHISPER_COMPUTE_TYPE
        )


    def transcribe(
        self,
        db: Session,
        job: TranscriptionJob
    ):
        logger.info(
            f"Starting transcription for job_id={job.id}"
        )

        start_time = time.time()

        try:

            self.repository.update_status(
                db,
                job.id,
                TranscriptionStatus.PROCESSING
            )


            segments, info = self.model.transcribe(
                job.file_path
            )


            transcript = " ".join(
                segment.text
                for segment in segments
            )


            processing_time = (
                time.time() - start_time
            ) * 1000

            logger.info(
                f"Transcription completed for job_id={job.id}"
            )


            return self.repository.complete(
                db,
                job.id,
                transcript,
                info.duration,
                processing_time
            )


        except Exception as e:
            logger.exception(
                f"Transcription failed for job_id={job.id}"
            )

            return self.repository.fail(
                db,
                job.id,
                str(e)
            )

    