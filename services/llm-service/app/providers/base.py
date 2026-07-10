from abc import ABC, abstractmethod
import httpx
from app.exceptions.llm_exception import LLMException

class LLMProvider(ABC):

    @abstractmethod
    async def generate(self, message):
        pass

    @abstractmethod
    async def stream_generate(self, message):
        pass

    @abstractmethod
    async def get_models(self):
        pass


    def _handle_http_exception(self, exception: Exception) -> None:

        if isinstance(exception, httpx.ConnectError):
            raise LLMException(
                "Unable to connect to Ollama.",
                status_code=503
            ) from exception

        elif isinstance(exception, httpx.TimeoutException):
            raise LLMException(
                "The request to the LLM provider timed out.",
                status_code=504
            ) from exception

        elif isinstance(exception, httpx.HTTPStatusError):
            raise LLMException(
                f"LLM provider returned HTTP {exception.response.status_code}.",
                status_code=exception.response.status_code
            ) from exception

        else:
            raise exception