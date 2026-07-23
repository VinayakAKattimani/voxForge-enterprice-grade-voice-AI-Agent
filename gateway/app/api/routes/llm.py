from fastapi import APIRouter, Request

from app.services.proxy import proxy_request

router = APIRouter(
    prefix="/llm",
    tags=["LLM"],
)


@router.api_route(
    "/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
)
async def llm_proxy(
    path: str,
    request: Request,
):
    return await proxy_request(
        service_name="llm",
        request=request,
        target_path=f"/api/v1/{path}",
    )