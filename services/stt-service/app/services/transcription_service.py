import time

from faster_whisper import WhisperModel

from app.core.config import settings
from app.core.logger import logger
from app.db.session import SessionLocal
from app.repositories.transcription_repository import (
    TranscriptionRepository,
)
from app.utils.enums import TranscriptionStatus


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
        job_id: int
    ):

        db = SessionLocal()

        try:
            job = self.repository.get_by_id(
                db=db,
                job_id=job_id
            )

            if not job:
                logger.warning(
                    f"Transcription job not found: job_id={job_id}"
                )
                return

            logger.info(
                f"Starting transcription for job_id={job_id}"
            )

            self.repository.update_status(
                db=db,
                job_id=job.id,
                status=TranscriptionStatus.PROCESSING
            )

            start_time = time.time()

            segments, info = self.model.transcribe(
                job.file_path
            )

            transcript = " ".join(
                segment.text.strip()
                for segment in segments
            )

            processing_time = (
                time.time() - start_time
            ) * 1000

            self.repository.complete(
                db=db,
                job_id=job.id,
                transcript=transcript,
                duration_seconds=info.duration,
                processing_time_ms=processing_time
            )

            logger.info(
                f"Transcription completed for job_id={job.id}"
            )

        except Exception as exc:

            logger.exception(
                f"Transcription failed for job_id={job_id}: {exc}"
            )

            if "job" in locals() and job:
                self.repository.fail(
                    db=db,
                    job_id=job.id,
                    error_message=str(exc)
                )

        finally:
            db.close()