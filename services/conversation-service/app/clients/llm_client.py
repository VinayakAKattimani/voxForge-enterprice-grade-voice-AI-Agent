import httpx
import structlog
from fastapi import HTTPException, status, Request
from app.core.config import settings
from app.schemas.llm import (
    LLMChatRequest,
    LLMChatResponse,
)

logger = structlog.get_logger()


class LLMClient:

    def generate_response(
        self,
        request: LLMChatRequest,
        request_id: str | None = None,
    ) -> LLMChatResponse:
        
        try:
            logger.info(
                "calling_llm_service",
                conversation_id=request.conversation_id,
            )

            with httpx.Client(timeout=60) as client:
                response = httpx.post(
                    f"{settings.LLM_SERVICE_URL}/api/v1/chat",
                    json=request.model_dump(mode="json"),
                    headers={
                        "X-Request-ID": request_id
                    } if request_id else {},
                    timeout=60,
                )

            response.raise_for_status()
            logger.info(
                "llm_response_received",
                status_code=response.status_code,
            )

            return LLMChatResponse.model_validate(
                response.json()
            )
        
        except httpx.ConnectError:
            logger.error(
                "llm_service_unavailable"
            )
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="LLM service is unavailable",
            )

        except httpx.HTTPStatusError as error:
            raise HTTPException(
                status_code=error.response.status_code,
                detail=error.response.text,
            )

        except httpx.TimeoutException:
            logger.error(
                "llm_service_timeout"
            )
            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="LLM service timeout",
            )