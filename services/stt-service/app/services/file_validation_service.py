from pathlib import Path

from fastapi import HTTPException, UploadFile

from app.core.config import settings


class FileValidationService:

    def validate(self, file: UploadFile) -> None:

        extension = Path(file.filename).suffix.lower().replace(".", "")

        allowed = [
            ext.strip()
            for ext in settings.ALLOWED_AUDIO_EXTENSIONS.split(",")
        ]

        if extension not in allowed:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {extension}"
            )

        if not file.filename:
            raise HTTPException(
                status_code=400,
                detail="Filename is required."
            )