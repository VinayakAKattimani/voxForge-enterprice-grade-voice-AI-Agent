from uuid import UUID

from fastapi import APIRouter, Depends, Request

from app.dependencies.message import get_message_service
from app.schemas.message import MessageCreate, MessageResponse
from app.services.message_service import MessageService

router = APIRouter(
    prefix="/conversations/{conversation_id}/messages",
    tags=["Messages"],
)


@router.post(
    "",
    response_model=MessageResponse,
)
def create_message(
    conversation_id: UUID,
    request: MessageCreate,
    http_request: Request,
    service: MessageService = Depends(get_message_service),
):
    return service.create_message(
        conversation_id=conversation_id,
        message=request,
        request_id=http_request.state.request_id,
    )

@router.get(
    "",
    response_model=list[MessageResponse],
)
def get_messages(
    conversation_id: UUID,
    service: MessageService = Depends(get_message_service),
):
    return service.get_messages(
        conversation_id
    )