from fastapi import HTTPException, Request, Response
import httpx

from app.services.http_client import http_client
from app.services.registry import SERVICE_REGISTRY


async def proxy_request(
    service_name: str,
    request: Request,
    target_path: str,
):
    base_url = SERVICE_REGISTRY.get(service_name)

    if not base_url:
        raise HTTPException(
            status_code=404,
            detail=f"Unknown service: {service_name}",
        )

    url = f"{base_url}{target_path}"

    if request.url.query:
        url += f"?{request.url.query}"

    body = await request.body()

    headers = dict(request.headers)
    headers.pop("host", None)

    response = await http_client.request(
        method=request.method,
        url=url,
        headers=headers,
        content=body,
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