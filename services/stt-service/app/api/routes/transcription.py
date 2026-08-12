from pathlib import Path

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
    BackgroundTasks
)
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.transcription_job import TranscriptionJob
from app.repositories.transcription_repository import (
    TranscriptionRepository,
)
from app.schemas.transcription import (
    TranscriptionResponse,
)
from app.services.transcription_service import (
    TranscriptionService,
)
from app.utils.enums import TranscriptionStatus
from uuid import uuid4
from pathlib import Path
from app.core.logger import logger
from app.schemas.job import JobResponse


router = APIRouter(
    prefix="/transcriptions",
    tags=["Transcription"]
)

repository = TranscriptionRepository()
service = TranscriptionService()


@router.post(
    "/",
    response_model=JobResponse,
    status_code=202
)
def upload_audio(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    logger.info(
        f"Received upload: {file.filename}"
    )
    # Validate MIME type
    if file.content_type not in settings.ALLOWED_AUDIO_TYPES.split(","):
        raise HTTPException(
            status_code=400,
            detail="Unsupported audio format."
        )

    # Read uploaded file
    contents = file.file.read()

    # Validate file size
    max_size = settings.MAX_FILE_SIZE_MB * 1024 * 1024

    if len(contents) > max_size:
        raise HTTPException(
            status_code=400,
            detail="File size exceeds limit."
        )

    # Save file
    extension = Path(file.filename).suffix

    stored_filename = f"{uuid4()}{extension}"

    file_location = (
        f"storage/uploads/{stored_filename}"
    )

    with open(file_location, "wb") as buffer:
        buffer.write(contents)

    # Create transcription job
    job = TranscriptionJob(
        filename=file.filename,
        file_path=file_location,
        file_size=len(contents),
        mime_type=file.content_type,
        status=TranscriptionStatus.PENDING
    )

    job = repository.create(
        db,
        job
    )

    background_tasks.add_task(
        service.transcribe,
        job.id
    )

    logger.info(
        f"Created transcription job: {job.id}"
    )

    return JobResponse(
        job_id=job.id,
        status=job.status,
        message="Transcription started successfully."
    )


@router.get(
    "/",
    response_model=list[TranscriptionResponse]
)
def get_transcriptions(
    db: Session = Depends(get_db)
):
    return repository.get_all(db)


@router.get(
    "/{job_id}",
    response_model=TranscriptionResponse
)
def get_transcription(
    job_id: int,
    db: Session = Depends(get_db)
):
    job = repository.get_by_id(
        db=db,
        job_id=job_id
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Transcription job not found."
        )

    return job


@router.delete("/{job_id}")
def delete_transcription(
    job_id: int,
    db: Session = Depends(get_db),
):
    job = repository.get_by_id(db, job_id)

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Transcription job not found",
        )

    logger.info(f"Deleting transcription job: {job.id}")

    repository.delete(db, job)

    return {
        "success": True,
        "message": "Transcription deleted successfully",
        "job_id": job_id,
    }
