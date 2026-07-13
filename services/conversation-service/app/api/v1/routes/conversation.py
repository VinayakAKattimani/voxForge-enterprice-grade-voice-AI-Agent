from uuid import UUID

from fastapi import APIRouter, Depends

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
    service: ConversationService = Depends(
        get_conversation_service
    ),
):
    # TODO: Replace with authenticated user ID
    user_id = UUID("00000000-0000-0000-0000-000000000001")

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
    service: ConversationService = Depends(
        get_conversation_service
    ),
):
    return service.get_conversation(
        conversation_id,
    )


@router.get(
    "",
    response_model=list[ConversationResponse],
)
def get_user_conversations(
    service: ConversationService = Depends(
        get_conversation_service
    ),
):
    # TODO: Replace with authenticated user ID
    user_id = UUID("00000000-0000-0000-0000-000000000001")

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
    service: ConversationService = Depends(
        get_conversation_service
    ),
    ):
    return service.update_conversation(
        conversation_id,
        request.title,
    )

