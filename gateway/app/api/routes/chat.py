from fastapi import APIRouter, Request, Depends
from app.services.proxy import proxy_request
from app.core.security import security
from pydantic import BaseModel

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)

class ChatRequest(BaseModel):
    message: str
    conversation_id: str

@router.post("")
async def chat(body:ChatRequest, request: Request):
    return await proxy_request(
        service_name="llm-service",
        request=request,
        target_path="/api/v1/chat",
        body=body.model_dump(),
    )