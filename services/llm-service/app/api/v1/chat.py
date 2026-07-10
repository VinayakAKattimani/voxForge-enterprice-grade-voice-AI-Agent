from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.schemas.chat import (ChatRequest, ChatResponse)
from app.services.llm_service import LLMService

from app.utils.sse import format_sse

router = APIRouter()

llm_service = LLMService()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):

    return await llm_service.generate(
        message=request.message,
        conversation_id=request.conversation_id
    )

@router.post("/chat/stream")
async def chat_stream(request: ChatRequest):

    async def event_generator():

        async for chunk in llm_service.stream_generate(
            message=request.message,
            conversation_id=request.conversation_id
        ):

            yield format_sse(
                {
                    "token": chunk
                }
            )

        yield format_sse(
            {
                "done": True
            }
        )


    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream"
    )

@router.get("/models")
async def get_models():
    return await llm_service.get_models()

