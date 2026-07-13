from fastapi import FastAPI

from app.api.v1.router import api_router
from app.middleware.request_logging import request_logging_middleware

app = FastAPI(
    title="Conversation Service",
    version="1.0.0",
)

app.middleware("http")(
    request_logging_middleware
)

app.include_router(
    api_router,
    prefix="/api/v1",
)


@app.get("/")
def root():
    return {
        "service": "conversation-service",
        "status": "running",
    }