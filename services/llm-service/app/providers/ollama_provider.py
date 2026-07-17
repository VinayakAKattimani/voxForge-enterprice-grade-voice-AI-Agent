import httpx
import json
from app.providers.base import LLMProvider
from app.core.config import settings
from app.exceptions.llm_exception import LLMException
from app.core.logger import logger

class OllamaProvider(LLMProvider):

    async def generate(self, message: str) -> str:

        payload = {
            "model": settings.OLLAMA_MODEL,
            "prompt": message,
            "stream": False,
            "options": {
                "temperature": 0
            }
        }


        try:
            async with httpx.AsyncClient(timeout=60.0) as client:

                response = await client.post(
                    f"{settings.OLLAMA_BASE_URL}/api/generate",
                    json=payload
                )

                response.raise_for_status()
            data = response.json()
            logger.info("Raw response received from Ollama")

            if "response" not in data:
                raise LLMException("Invalid response received from Ollama.")


            return data["response"]
        
        except (
            httpx.ConnectError,
            httpx.TimeoutException,
            httpx.HTTPStatusError,
        ) as e:
            logger.error(f"Ollama request failed: {e}")
            self._handle_http_exception(e)
        

    async def get_models(self) -> list[dict]:

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:

                response = await client.get(
                    f"{settings.OLLAMA_BASE_URL}/api/tags"
                )

                response.raise_for_status()

                data = response.json()

                return [
                    {
                        "name": model["name"],
                         "provider": "ollama"
                    }
                    for model in data.get("models", [])
                ]

        except (
            httpx.ConnectError,
            httpx.TimeoutException,
            httpx.HTTPStatusError,
        ) as e:
            logger.error(f"Ollama request failed: {e}")
            self._handle_http_exception(e)

    async def stream_generate(self, message):
        payload = {
            "model" : settings.OLLAMA_MODEL,
            "prompt":message,
            "stream": True
        }

        try:
            async with httpx.AsyncClient(timeout=None) as client:

                async with client.stream(
                    "POST",
                    f"{settings.OLLAMA_BASE_URL}/api/generate",
                    json=payload
                ) as response:

                    response.raise_for_status()

                    async for line in response.aiter_lines():

                        if not line:
                            continue

                        data = json.loads(line)

                        if "response" in data:
                            yield data["response"]

                        if data.get("done"):
                            break

        except (
            httpx.ConnectError,
            httpx.TimeoutException,
            httpx.HTTPStatusError,
        ) as e:
            self._handle_http_exception(e)