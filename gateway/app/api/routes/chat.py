from fastapi import APIRouter

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.api_route(
    "/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
)
async def chat_proxy(path: str):
    return {
        "service": "llm",
        "path": path,
    }