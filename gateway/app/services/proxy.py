from fastapi import HTTPException, Request, Response, UploadFile
import httpx
import json

from app.services.http_client import get_http_client
from app.services.registry import SERVICE_REGISTRY


async def proxy_request(
    service_name: str,
    request: Request,
    target_path: str,
    multipart_file: UploadFile | None = None,
    multipart_data: dict | None = None,
    body: dict | None = None,
):
    base_url = SERVICE_REGISTRY.get(service_name)

    print("Service Name:", service_name)
    print("Base URL:", base_url)

    if base_url is None:
        raise HTTPException(
            status_code=404,
            detail=f"Unknown service: {service_name}",
        )

    url = f"{base_url}{target_path}"

    if request.url.query:
        url += f"?{request.url.query}"

    headers = dict(request.headers)

    headers.pop("host", None)
    headers.pop("content-length", None)

    headers.pop("X-User-ID", None)
    headers.pop("X-User-Email", None)

    if hasattr(request.state, "user_id"):
        headers["X-User-ID"] = request.state.user_id

    if hasattr(request.state, "email"):
        headers["X-User-Email"] = request.state.email

    print("Forwarding headers:", headers)
    print("Forwarding to:", url)

    try:

        # ==================================================
        # MULTIPART FILE UPLOAD
        # ==================================================

        if multipart_file is not None:

            file_content = await multipart_file.read()

            files = {
                "file": (
                    multipart_file.filename,
                    file_content,
                    multipart_file.content_type,
                )
            }

            data = multipart_data or {}

            headers.pop("content-type", None)

            response = await get_http_client().request(
                method=request.method,
                url=url,
                headers=headers,
                files=files,
                data=data,
                timeout=150.0,
            )

        # ==================================================
        # JSON BODY
        # ==================================================

        elif body is not None:

            headers["content-type"] = "application/json"

            response = await get_http_client().request(
                method=request.method,
                url=url,
                headers=headers,
                content=json.dumps(body),
                timeout=150.0,
            )

        # ==================================================
        # NORMAL REQUEST
        # ==================================================

        else:

            raw_body = await request.body()

            print("RAW BODY:", raw_body)
            print(
                "CONTENT-TYPE:",
                request.headers.get("content-type"),
            )

            response = await get_http_client().request(
                method=request.method,
                url=url,
                headers=headers,
                content=raw_body,
                timeout=150.0,
            )

    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail={
                "success": False,
                "service": service_name,
                "error": "Service unavailable",
            },
        )

    excluded_headers = {
        "content-length",
        "transfer-encoding",
        "connection",
    }

    response_headers = {
        key: value
        for key, value in response.headers.items()
        if key.lower() not in excluded_headers
    }

    return Response(
        content=response.content,
        status_code=response.status_code,
        headers=response_headers,
        media_type=response.headers.get("content-type"),
    )
