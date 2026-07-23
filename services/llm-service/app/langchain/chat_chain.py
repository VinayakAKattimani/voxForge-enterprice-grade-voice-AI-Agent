from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage

from app.core.config import settings


class ChatChain:

    def __init__(self):

        self.llm = ChatOllama(
            model=settings.OLLAMA_MODEL,
            base_url=settings.OLLAMA_BASE_URL,
            temperature=0,
        )

    async def generate(
        self,
        prompt: str,
    ) -> str:

        response = await self.llm.ainvoke(
            [
                HumanMessage(content=prompt)
            ]
        )

        return response.content