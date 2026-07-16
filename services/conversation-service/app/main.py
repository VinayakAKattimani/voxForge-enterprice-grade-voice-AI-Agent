from fastapi import FastAPI
from fastapi.routing import APIRoute

from app.api.v1.router import api_router
from app.middleware.request_logging import request_logging_middleware

app = FastAPI(
    title="Conversation Service",
    version="1.0.0",
)

app.middleware("http")(request_logging_middleware)

app.include_router(api_router, prefix="/api/v1")

for route in app.routes:
    if isinstance(route, APIRoute):
        print(route.path, route.methods)

@app.get("/")
def root():
    return {
        "service": "conversation-service",
        "status": "running",
    }