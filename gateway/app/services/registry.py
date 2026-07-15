from app.core.config import settings


SERVICE_REGISTRY = {
    "auth": settings.auth_service_url,
    "conversation": settings.conversation_service_url,
    "knowledge": settings.knowledge_service_url,
    "llm": settings.llm_service_url,
}