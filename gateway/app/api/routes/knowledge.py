from fastapi import APIRouter

router = APIRouter(
    prefix="/knowledge",
    tags=["Knowledge"],
)


@router.api_route(
    "/{path:path}",
    methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
)
async def knowledge_proxy(path: str):
    return {
        "service": "knowledge",
        "path": path,
    }