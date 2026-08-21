from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage
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
        system_prompt: str,
        user_message: str,
    ) -> str:

        response = await self.llm.ainvoke(
            [
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_message),
            ]
        )

        return response.content