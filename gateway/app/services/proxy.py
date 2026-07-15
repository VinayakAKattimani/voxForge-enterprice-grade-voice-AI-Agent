from fastapi import HTTPException, Request, Response
import httpx
import json

from app.services.http_client import get_http_client
from app.services.registry import SERVICE_REGISTRY

print("LOADING PROXY FROM:", __file__)
async def proxy_request(
    service_name: str,
    request: Request,
    target_path: str,
    body: None,
):
    print("LOADED PROXY VERSION WITH DEFAULT BODY")
    base_url = SERVICE_REGISTRY.get(service_name)

    if base_url is None:
        raise HTTPException(
            status_code=404,
            detail=f"Unknown service: {service_name}",
        )

    url = f"{base_url}{target_path}"

    if request.url.query:
        url += f"?{request.url.query}"

    if body is None:
        body = await request.body()
    else:
        body = json.dumps(body)

    headers = dict(request.headers)
    headers.pop("host", None)
    headers.pop("X-User-ID", None)
    headers.pop("X-User-Email", None)

    if hasattr(request.state, "user_id"):
        headers["X-User-ID"] = request.state.user_id

    if hasattr(request.state, "email"):
        headers["X-User-Email"] = request.state.email

    print("Forwarding headers:")
    print(headers)

    response = await get_http_client().request(
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