import httpx
import json
from app.providers.base import LLMProvider
from app.core.config import settings
from app.exceptions.llm_exception import LLMException
from app.core.logger import logger


class GroqProvider(LLMProvider):

    async def generate(
        self,
        system_prompt: str,
        user_message: str,
    ) -> str:

        payload = {
            "model": settings.GROQ_MODEL,
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": user_message,
                },
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

    async def stream_generate(
        self,
        system_prompt: str,
        user_message: str,
    ):
        payload = {
            "model": settings.GROQ_MODEL,
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": user_message,
                },
            ],
            "temperature": 0.1,
            "stream": True,
        }

        headers = {
            "Authorization": f"Bearer {settings.GROQ_API_KEY}",
            "Content-Type": "application/json",
        }

        try:
            async with httpx.AsyncClient(timeout=None) as client:

                async with client.stream(
                    "POST",
                    f"{settings.GROQ_BASE_URL}/chat/completions",
                    json=payload,
                    headers=headers,
                ) as response:

                    response.raise_for_status()

                    async for line in response.aiter_lines():

                        if not line:
                            continue

                        if not line.startswith("data:"):
                            continue

                        data = line[5:].strip()

                        if data == "[DONE]":
                            break

                        chunk = json.loads(data)

                        choices = chunk.get("choices", [])

                        if not choices:
                            continue

                        delta = choices[0].get("delta", {})
                        content = delta.get("content")

                        if content:
                            yield content

        except (
            httpx.ConnectError,
            httpx.TimeoutException,
            httpx.HTTPStatusError,
        ) as e:

            logger.error(f"Groq streaming request failed: {e}")
            self._handle_http_exception(e)

    async def get_models(self) -> list[dict]:

        headers = {
            "Authorization": f"Bearer {settings.GROQ_API_KEY}",
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:

                response = await client.get(
                    f"{settings.GROQ_BASE_URL}/models",
                    headers=headers,
                )

                response.raise_for_status()

                data = response.json()

                return [
                    {
                        "name": model["id"],
                        "provider": "groq",
                    }
                    for model in data.get("data", [])
                ]

        except (
            httpx.ConnectError,
            httpx.TimeoutException,
            httpx.HTTPStatusError,
        ) as e:

            logger.error(f"Groq model listing failed: {e}")
            self._handle_http_exception(e)