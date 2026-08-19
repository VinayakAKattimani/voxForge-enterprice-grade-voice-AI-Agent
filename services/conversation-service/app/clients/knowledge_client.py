import httpx
import structlog

from uuid import UUID
from fastapi import HTTPException, status

from app.core.config import settings
from app.schemas.knowledge import (
    KnowledgeSearchRequest,
    KnowledgeSearchResult,
)


logger = structlog.get_logger()


class KnowledgeClient:

    def search(
        self,
        query: str,
        user_id: UUID,
        request_id: str | None = None,
        limit: int = 5,
    ) -> list[KnowledgeSearchResult]:

        try:

            logger.info(
                "calling_knowledge_service",
                query=query,
                user_id=str(user_id),
            )

            response = httpx.post(
                f"{settings.KNOWLEDGE_SERVICE_URL}/api/v1/search",
                json=KnowledgeSearchRequest(
                    query=query,
                    limit=limit,
                ).model_dump(mode="json"),
                headers={
                    "X-User-ID": str(user_id),
                    **(
                        {"X-Request-ID": request_id}
                        if request_id
                        else {}
                    ),
                },
                timeout=30,
            )

            response.raise_for_status()

            results = response.json()

            logger.info(
                "knowledge_response_received",
                result_count=len(results),
            )

            return [
                KnowledgeSearchResult.model_validate(
                    result
                )
                for result in results
            ]

        except httpx.ConnectError:

            logger.error(
                "knowledge_service_unavailable"
            )

            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Knowledge service is unavailable",
            )

        except httpx.HTTPStatusError as error:

            logger.error(
                "knowledge_service_request_failed",
                status_code=error.response.status_code,
            )

            raise HTTPException(
                status_code=error.response.status_code,
                detail="Knowledge service request failed",
            )

        except httpx.TimeoutException:

            logger.error(
                "knowledge_service_timeout"
            )

            raise HTTPException(
                status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                detail="Knowledge service timeout",
            )