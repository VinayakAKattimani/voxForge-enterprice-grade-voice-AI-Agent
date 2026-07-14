from fastapi import APIRouter

from app.schemas.search import SearchRequest, SearchResultResponse
from app.services.retrieval_service import RetrievalService


router = APIRouter(
    prefix="/search",
    tags=["Search"],
)


@router.post("",  response_model=list[SearchResultResponse],)
async def search_documents(
    request: SearchRequest,
):

    service = RetrievalService()

    results = await service.search(
        request.query,
        request.limit,
    )

    return results