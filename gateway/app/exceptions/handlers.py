import httpx

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

async def connect_error_handler(
    request: Request,
    exc: httpx.ConnectError,
):
    return JSONResponse(
        status_code=503,
        content={
            "detail": "Requested service is currently unavailable."
        },
    )

async def timeout_handler(
    request: Request,
    exc: httpx.ReadTimeout,
):
    return JSONResponse(
        status_code=504,
        content={
            "detail": "Gateway request timed out."
        },
    )

async def http_error_handler(
    request: Request,
    exc: httpx.HTTPError,
):
    return JSONResponse(
        status_code=502,
        content={
            "detail": "Gateway failed to communicate with downstream service."
        },
    )

def register_exception_handlers(app: FastAPI):
    app.add_exception_handler(
        httpx.ConnectError,
        connect_error_handler,
    )

    app.add_exception_handler(
        httpx.ReadTimeout,
        timeout_handler,
    )

    app.add_exception_handler(
        httpx.HTTPError,
        http_error_handler,
    )