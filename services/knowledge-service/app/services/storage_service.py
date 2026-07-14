from pathlib import Path
from uuid import UUID

from fastapi import UploadFile

from app.core.config import settings


class StorageService:
    def __init__(self) -> None:
        self.upload_dir = Path(settings.UPLOAD_DIR)
        self.upload_dir.mkdir(parents=True, exist_ok=True)

    async def save_file(
        self,
        document_id: UUID,
        file: UploadFile,
    ) -> str:
        extension = Path(file.filename).suffix

        filename = f"{document_id}{extension}"

        file_path = self.upload_dir / filename

        content = await file.read()

        with open(file_path, "wb") as f:
            f.write(content)

        return str(file_path)

    def delete_file(self, file_path: str) -> None:
        path = Path(file_path)

        if path.exists():
            path.unlink()

    def file_exists(self, file_path: str) -> bool:
        return Path(file_path).exists()