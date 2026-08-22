from fastapi import HTTPException, Request, Response, UploadFile
from fastapi.responses import StreamingResponse

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

    headers.pop("x-user-id", None)
    headers.pop("x-user-email", None)

    if hasattr(request.state, "user_id"):
        headers["X-User-ID"] = str(request.state.user_id)

    if hasattr(request.state, "email"):
        headers["X-User-Email"] = str(request.state.email)

    print("Forwarding headers:", headers)
    print("Forwarding to:", url)

    # ==================================================
    # STREAMING REQUEST
    # ==================================================

    if target_path.endswith("/chat/stream"):

        raw_body = await request.body()

        client = get_http_client()

        try:
            request_context = client.stream(
                method=request.method,
                url=url,
                headers=headers,
                content=raw_body,
                timeout=None,
            )

            upstream = await request_context.__aenter__()

            print(
                "UPSTREAM STREAM STATUS:",
                upstream.status_code,
            )

            if upstream.status_code >= 400:

                error_body = await upstream.aread()

                await request_context.__aexit__(
                    None,
                    None,
                    None,
                )

                print(
                    "UPSTREAM STREAM ERROR:",
                    upstream.status_code,
                    error_body.decode(
                        "utf-8",
                        errors="replace",
                    ),
                )

                raise HTTPException(
                    status_code=upstream.status_code,
                    detail=error_body.decode(
                        "utf-8",
                        errors="replace",
                    ),
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

        async def stream_response():

            try:

                async for chunk in upstream.aiter_bytes():
                    yield chunk

            finally:

                await request_context.__aexit__(
                    None,
                    None,
                    None,
                )

        return StreamingResponse(
            stream_response(),
            status_code=upstream.status_code,
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            },
        )

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

        try:

            response = await get_http_client().request(
                method=request.method,
                url=url,
                headers=headers,
                files=files,
                data=data,
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

    # ==================================================
    # JSON BODY
    # ==================================================

    elif body is not None:

        headers["content-type"] = "application/json"

        try:

            response = await get_http_client().request(
                method=request.method,
                url=url,
                headers=headers,
                content=json.dumps(body),
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

        try:

            response = await get_http_client().request(
                method=request.method,
                url=url,
                headers=headers,
                content=raw_body,
                timeout=300.0,
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

    # ==================================================
    # NORMAL RESPONSE
    # ==================================================

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
        media_type=response.headers.get(
            "content-type"
        ),
    )