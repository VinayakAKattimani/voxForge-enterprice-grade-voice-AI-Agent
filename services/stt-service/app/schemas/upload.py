from pydantic import BaseModel


class UploadResult(BaseModel):
    original_filename: str
    stored_filename: str
    file_path: str
    file_size: int
    mime_type: str