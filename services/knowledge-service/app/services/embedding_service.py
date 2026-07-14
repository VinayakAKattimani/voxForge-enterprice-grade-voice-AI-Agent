from app.providers.factory import EmbeddingProviderFactory


class EmbeddingService:

    def __init__(self):
        self.provider = (
            EmbeddingProviderFactory.get_provider()
        )

    async def generate_embedding(
        self,
        text: str,
    ) -> list[float]:

        return await self.provider.generate_embedding(
            text
        )