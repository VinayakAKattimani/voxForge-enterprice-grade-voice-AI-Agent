import httpx

from app.providers.base import LLMProvider
from app.core.config import settings
from app.exceptions.llm_exception import LLMException
from app.core.logger import logger


class GroqProvider(LLMProvider):

    async def generate(self, message: str) -> str:

        payload = {
            "model": settings.GROQ_MODEL,
            "messages": [
                {
                    "role": "user",
                    "content": message,
                }
            ],
            "temperature": 0.1,
        }

        headers = {
            "Authorization": f"Bearer {settings.GROQ_API_KEY}",
            "Content-Type": "application/json",
        }

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:

                response = await client.post(
                    f"{settings.GROQ_BASE_URL}/chat/completions",
                    json=payload,
                    headers=headers,
                )

                response.raise_for_status()

            data = response.json()

            logger.info("Raw response received from Groq")

            if "choices" not in data or not data["choices"]:
                raise LLMException(
                    "Invalid response received from Groq."
                )

            return data["choices"][0]["message"]["content"]

        except (
            httpx.ConnectError,
            httpx.TimeoutException,
            httpx.HTTPStatusError,
        ) as e:

            logger.error(f"Groq request failed: {e}")

            self._handle_http_exception(e)

    async def stream_generate(self, message: str):
        raise NotImplementedError(
            "Streaming is not implemented for GroqProvider yet."
        )

    async def get_models(self) -> list[dict]:
        raise NotImplementedError(
            "Model listing is not implemented for GroqProvider yet."
        )