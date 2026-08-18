from fastapi import APIRouter, Request

from app.services.proxy import proxy_request

router = APIRouter(
    prefix="/knowledge",
    tags=["Knowledge"],
)


@router.post("/documents")
async def upload_document(
    request: Request,
):
    return await proxy_request(
        service_name="knowledge",
        request=request,
        target_path="/api/v1/documents/upload",
    )


@router.get("/documents")
async def get_documents(
    request: Request,
):
    return await proxy_request(
        service_name="knowledge",
        request=request,
        target_path="/api/v1/documents",
    )


@router.post("/search")
async def search(
    request: Request,
):
    return await proxy_request(
        service_name="knowledge",
        request=request,
        target_path="/api/v1/search",
    )

@router.delete("/documents/{document_id}")
async def delete_document(
    document_id: str,
    request: Request,
):
    return await proxy_request(
        service_name="knowledge",
        request=request,
        target_path=f"/api/v1/documents/{document_id}",
    )

@router.post("/documents/{document_id}/reprocess")
async def reprocess_document(
    document_id: str,
    request: Request,
):
    return await proxy_request(
        service_name="knowledge",
        request=request,
        target_path=f"/api/v1/documents/{document_id}/reprocess",
    )

@router.patch("/documents/{document_id}/visibility")
async def update_document_visibility(
    document_id: str,
    request: Request,
):
    return await proxy_request(
        service_name="knowledge",
        request=request,
        target_path=f"/api/v1/documents/{document_id}/visibility",
    )

@router.get("/documents/{document_id}")
async def get_document(
    document_id: str,
    request: Request,
):
    return await proxy_request(
        service_name="knowledge",
        request=request,
        target_path=f"/api/v1/documents/{document_id}",
    )