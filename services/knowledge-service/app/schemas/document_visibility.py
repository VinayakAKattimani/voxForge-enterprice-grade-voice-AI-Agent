from pydantic import BaseModel


class DocumentVisibilityUpdate(BaseModel):
    is_public: bool