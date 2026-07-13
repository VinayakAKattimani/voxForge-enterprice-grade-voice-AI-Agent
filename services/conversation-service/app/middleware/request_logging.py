import time
import uuid

import structlog
from fastapi import Request


logger = structlog.get_logger()


async def request_logging_middleware(
    request: Request,
    call_next,
):
    request_id = str(uuid.uuid4())
    request.state.request_id = request_id

    start_time = time.time()

    logger.info(
        "request_started",
        request_id=request_id,
        method=request.method,
        path=request.url.path,
    )

    response = await call_next(request)

    process_time = time.time() - start_time

    logger.info(
        "request_completed",
        request_id=request_id,
        status_code=response.status_code,
        process_time=f"{process_time:.4f}s",
    )

    response.headers["X-Request-ID"] = request_id

    return response