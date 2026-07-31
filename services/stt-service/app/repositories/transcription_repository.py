from sqlalchemy.orm import Session

from app.models.transcription_job import TranscriptionJob
from app.utils.enums import TranscriptionStatus


class TranscriptionRepository:

    def create(
        self,
        db: Session,
        job: TranscriptionJob
    ):
        db.add(job)
        db.commit()
        db.refresh(job)

        return job


    def get_by_id(
        self,
        db: Session,
        job_id: int
    ):
        return (
            db.query(TranscriptionJob)
            .filter(
                TranscriptionJob.id == job_id
            )
            .first()
        )


    def update_status(
        self,
        db: Session,
        job_id: int,
        status: TranscriptionStatus
    ):
        job = self.get_by_id(
            db,
            job_id
        )

        if job:
            job.status = status
            db.commit()
            db.refresh(job)

        return job


    def complete(
        self,
        db: Session,
        job_id: int,
        transcript: str,
        duration_seconds: float | None = None,
        processing_time_ms: float | None = None
    ):
        job = self.get_by_id(
            db,
            job_id
        )

        if job:
            job.status = TranscriptionStatus.COMPLETED
            job.transcript = transcript
            job.duration_seconds = duration_seconds
            job.processing_time_ms = processing_time_ms

            db.commit()
            db.refresh(job)

        return job


    def fail(
        self,
        db: Session,
        job_id: int,
        error_message: str
    ):
        job = self.get_by_id(
            db,
            job_id
        )

        if job:
            job.status = TranscriptionStatus.FAILED
            job.error_message = error_message

            db.commit()
            db.refresh(job)

        return job

    def get_all(
        self,
        db: Session
    ):
        return (
            db.query(TranscriptionJob)
            .order_by(
                TranscriptionJob.created_at.desc()
            )
            .all()
        )

    def delete(
        self,
        db: Session,
        job: TranscriptionJob
    ):
        db.delete(job)
        db.commit()