from uuid import UUID

from fastapi import APIRouter, Request

from app.services.proxy import proxy_request

router = APIRouter(
    prefix="/conversations/{conversation_id}/messages",
    tags=["Messages"],
)


@router.post("")
async def create_message(
    conversation_id: UUID,
    request: Request,
):
    return await proxy_request(
        service_name="conversation",
        request=request,
        target_path=f"/api/v1/conversations/{conversation_id}/messages",
    )


@router.get("")
async def get_messages(
    conversation_id: UUID,
    request: Request,
):
    return await proxy_request(
        service_name="conversation",
        request=request,
        target_path=f"/api/v1/conversations/{conversation_id}/messages",
    )