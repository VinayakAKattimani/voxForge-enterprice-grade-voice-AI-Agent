from fastapi import APIRouter, Request
from app.services.proxy import proxy_request

router = APIRouter(
    prefix="/conversations",
    tags=["Conversations"],
)


@router.post("/")
async def create_conversation(request: Request):
    return await proxy_request(
        service_name="conversation",
        request=request,
        target_path="/conversations",
    )