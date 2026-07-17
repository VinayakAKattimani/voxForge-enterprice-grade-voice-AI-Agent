from fastapi import APIRouter

from app.api.routes.auth import router as auth_router
from app.api.routes.conversation import router as conversation_router
from app.api.routes.health import router as health_router
from app.api.routes.knowledge import router as knowledge_router
from app.api.routes.message import router as message_router
from app.api.routes.auth import router as auth_router


api_router = APIRouter(prefix="/api/v1")

api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(conversation_router)
api_router.include_router(knowledge_router)
api_router.include_router(message_router)