from uuid import UUID

from fastapi import APIRouter, Header

from app.schemas.search import (
    SearchRequest,
    SearchResultResponse,
)
from app.services.retrieval_service import RetrievalService


router = APIRouter(
    prefix="/search",
    tags=["Search"],
)


@router.post(
    "",
    response_model=list[SearchResultResponse],
)
async def search(
    request: SearchRequest,
    x_user_id: UUID = Header(...),
):
    retrieval_service = RetrievalService()

    return await retrieval_service.search(
        query=request.query,
        owner_id=x_user_id,
        limit=request.limit,
        document_id=request.document_id,
    )