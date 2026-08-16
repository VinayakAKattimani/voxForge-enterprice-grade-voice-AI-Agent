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

        logger.info(
            f"Loading Whisper model: {settings.WHISPER_MODEL}"
        )

        self.model = WhisperModel(
            settings.WHISPER_MODEL,
            device=settings.WHISPER_DEVICE,
            compute_type=settings.WHISPER_COMPUTE_TYPE,
        )

        logger.info("Whisper model loaded successfully")

    def transcribe(
        self,
        job_id: int
    ):
        db = SessionLocal()
        job = None

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

            logger.info(
                f"Transcribing file: {job.file_path}"
            )

            segments, info = self.model.transcribe(
                job.file_path,

                # --------------------------------------------------
                # LANGUAGE
                # --------------------------------------------------
                # Our current MVP is English-first.
                # Explicitly specifying English avoids unnecessary
                # language detection on short microphone recordings.
                language="en",

                # --------------------------------------------------
                # BEAM SEARCH
                # --------------------------------------------------
                # Higher beam size generally improves accuracy at
                # the cost of some inference time.
                beam_size=5,

                # --------------------------------------------------
                # TEMPERATURE
                # --------------------------------------------------
                # Start deterministic for normal speech.
                temperature=0.0,

                # --------------------------------------------------
                # VAD
                # --------------------------------------------------
                # Ignore silence/background noise.
                vad_filter=True,

                vad_parameters={
                    "min_silence_duration_ms": 500,
                },

                # --------------------------------------------------
                # CONDITIONING
                # --------------------------------------------------
                # Helps Whisper use previous text context between
                # segments, while still resetting appropriately.
                condition_on_previous_text=True,

                # --------------------------------------------------
                # HALLUCINATION CONTROL
                # --------------------------------------------------
                # Avoid aggressively accepting extremely low
                # probability segments.
                no_speech_threshold=0.6,

                log_prob_threshold=-1.0,

                compression_ratio_threshold=2.4,
            )

            # ------------------------------------------------------
            # BUILD TRANSCRIPT
            # ------------------------------------------------------

            transcript_parts = []

            for segment in segments:

                text = segment.text.strip()

                if not text:
                    continue

                logger.info(
                    f"STT SEGMENT [{segment.start:.2f}s - "
                    f"{segment.end:.2f}s]: {text}"
                )

                transcript_parts.append(text)

            transcript = " ".join(
                transcript_parts
            ).strip()

            processing_time = (
                time.time() - start_time
            ) * 1000

            logger.info(
                f"STT RESULT job_id={job.id}: "
                f"'{transcript}'"
            )

            logger.info(
                f"STT detected language: {info.language}"
            )

            logger.info(
                f"STT language probability: "
                f"{info.language_probability:.4f}"
            )

            logger.info(
                f"STT duration: {info.duration:.2f}s"
            )

            logger.info(
                f"STT processing time: "
                f"{processing_time:.2f}ms"
            )

            # ------------------------------------------------------
            # EMPTY TRANSCRIPT
            # ------------------------------------------------------

            if not transcript:

                logger.warning(
                    f"No speech detected for job_id={job.id}"
                )

                self.repository.complete(
                    db=db,
                    job_id=job.id,
                    transcript="",
                    duration_seconds=info.duration,
                    processing_time_ms=processing_time
                )

                return

            # ------------------------------------------------------
            # COMPLETE JOB
            # ------------------------------------------------------

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
                f"Transcription failed for "
                f"job_id={job_id}: {exc}"
            )

            if job:
                self.repository.fail(
                    db=db,
                    job_id=job.id,
                    error_message=str(exc)
                )

        finally:
            db.close()
