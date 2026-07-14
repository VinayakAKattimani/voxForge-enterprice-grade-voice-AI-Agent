from httpx import AsyncClient, HTTPError

from app.core.config import settings
from app.core.logger import logger


class KnowledgeClient:

    async def search(
        self,
        query: str,
        limit: int = 5,
    ) -> list:

        try:

            async with AsyncClient(timeout=10) as client:

                response = await client.post(
                    f"{settings.KNOWLEDGE_SERVICE_URL}/api/v1/search",
                    json={
                        "query": query,
                        "limit": limit,
                    },
                )

                response.raise_for_status()

                return response.json()

        except HTTPError as ex:

            logger.error(
                f"Knowledge Service unavailable: {ex}"
            )

            return []

        except Exception as ex:

            logger.exception(
                f"Unexpected error while calling Knowledge Service: {ex}"
            )

            return list()