from fastapi import APIRouter

from app.api.v1.routes.conversation import router as conversation_router
from app.api.v1.routes.message import router as message_router
from app.api.v1.routes.health import router as health_router

api_router = APIRouter()

api_router.include_router(conversation_router)
api_router.include_router(message_router)
api_router.include_router(health_router)
