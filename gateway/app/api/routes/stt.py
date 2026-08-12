from fastapi import APIRouter, Request, UploadFile, File, Form

from app.services.proxy import proxy_request


router = APIRouter(
    prefix="/stt",
    tags=["Speech-to-Text"],
)


@router.post("/transcriptions/")
async def upload_audio(
    request: Request,
    file: UploadFile = File(...),
    language: str | None = Form(None),
):
    return await proxy_request(
        service_name="stt",
        request=request,
        target_path="/api/v1/transcriptions/",
        multipart_file=file,
        multipart_data={
            "language": language,
        } if language else None,
    )


@router.get("/transcriptions/")
async def get_transcriptions(
    request: Request,
):
    return await proxy_request(
        service_name="stt",
        request=request,
        target_path="/api/v1/transcriptions/",
    )


@router.get("/transcriptions/{job_id}")
async def get_transcription(
    job_id: int,
    request: Request,
):
    return await proxy_request(
        service_name="stt",
        request=request,
        target_path=f"/api/v1/transcriptions/{job_id}",
    )


@router.delete("/transcriptions/{job_id}")
async def delete_transcription(
    job_id: int,
    request: Request,
):
    return await proxy_request(
        service_name="stt",
        request=request,
        target_path=f"/api/v1/transcriptions/{job_id}",
    )

