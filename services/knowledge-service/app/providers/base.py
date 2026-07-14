from abc import ABC, abstractmethod


class BaseEmbeddingProvider(ABC):

    @abstractmethod
    async def generate_embedding(
        self,
        text: str,
    ) -> list[float]:
        pass