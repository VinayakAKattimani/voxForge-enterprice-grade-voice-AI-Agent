from uuid import UUID

from fastapi import APIRouter, Depends, Header

from app.dependencies.conversation import get_conversation_service
from app.schemas.conversation import (
    ConversationCreate,
    ConversationResponse,
    ConversationUpdate
)
from app.services.conversation_service import ConversationService

router = APIRouter(
    prefix="/conversations",
    tags=["Conversations"],
)


@router.post(
    "",
    response_model=ConversationResponse,
)
def create_conversation(
    conversation: ConversationCreate,
    x_user_id: str = Header(...),
    service: ConversationService = Depends(
        get_conversation_service
    ),
):
    user_id = UUID(x_user_id)

    return service.create_conversation(
        user_id=user_id,
        conversation=conversation,
    )


@router.get(
    "/{conversation_id}",
    response_model=ConversationResponse,
)
def get_conversation(
    conversation_id: UUID,
    x_user_id: str = Header(...),
    service: ConversationService = Depends(
        get_conversation_service
    ),
):
    return service.get_conversation(
        conversation_id=conversation_id,
        user_id=UUID(x_user_id),
    )


@router.get(
    "",
    response_model=list[ConversationResponse],
)
def get_user_conversations(
    x_user_id: str = Header(...),
    service: ConversationService = Depends(
        get_conversation_service
    ),
):
    user_id = UUID(x_user_id)

    return service.get_user_conversations(
        user_id,
    )

@router.patch(
    "/{conversation_id}",
    response_model=ConversationResponse,
)
def update_conversation(
    conversation_id: UUID,
    request: ConversationUpdate,
    x_user_id: str = Header(...),
    service: ConversationService = Depends(
        get_conversation_service
    ),
):
    return service.update_conversation(
        conversation_id=conversation_id,
        user_id=UUID(x_user_id),
        title=request.title,
    )

