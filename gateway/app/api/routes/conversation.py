from uuid import UUID

from fastapi import APIRouter, Request

from app.services.proxy import proxy_request

router = APIRouter(
    prefix="/conversations",
    tags=["Conversations"],
)


@router.post("")
async def create_conversation(request: Request):
    return await proxy_request(
        service_name="conversation",
        request=request,
        target_path="/api/v1/conversations",
    )


@router.get("")
async def get_user_conversations(request: Request):
    return await proxy_request(
        service_name="conversation",
        request=request,
        target_path="/api/v1/conversations",
    )


@router.get("/{conversation_id}")
async def get_conversation(
    conversation_id: UUID,
    request: Request,
):
    return await proxy_request(
        service_name="conversation",
        request=request,
        target_path=f"/api/v1/conversations/{conversation_id}",
    )


@router.patch("/{conversation_id}")
async def update_conversation(
    conversation_id: UUID,
    request: Request,
):
    return await proxy_request(
        service_name="conversation",
        request=request,
        target_path=f"/api/v1/conversations/{conversation_id}",
    )


# @router.get("/me")
# async def get_current_user(request: Request):
#     return await proxy_request(
#         service_name="conversation",
#         request=request,
#         target_path="/api/v1/conversations/me",
#     )