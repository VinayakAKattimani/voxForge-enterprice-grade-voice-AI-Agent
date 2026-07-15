from fastapi import APIRouter, Request
from app.services.proxy import proxy_request

router = APIRouter(
    prefix="/knowledge",
    tags=["Knowledge"],
)


@router.post("/search")
async def search(request: Request):
    return await proxy_request(
        service_name="knowledge",
        request=request,
        target_path="/knowledge/search",
    )