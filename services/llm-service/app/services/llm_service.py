from uuid import UUID

from app.core.logger import logger
from app.prompts.prompt_builder import PromptBuilder
from app.providers.factory import ProviderFactory
from app.schemas.chat import ChatMessage
from app.schemas.response import ChatResponse
from app.langchain.chat_chain import ChatChain


class LLMService:

    def __init__(self):
        self.provider = ProviderFactory.get_provider()
        self.chat_chain = ChatChain()

    async def generate(
        self,
        conversation_id: str,
        user_id: UUID,
        messages: list[ChatMessage],
        context: str | None = None,
    ):

        logger.info(
            f"Generating response for conversation_id={conversation_id}"
        )

        history = [
            {
                "role": msg.role.value,
                "content": msg.content,
            }
            for msg in messages[:-1]
        ]

        user_message = messages[-1].content

        context = context or ""

        system_prompt = PromptBuilder.build(
            history=history,
            context=context,
            user_message=user_message,
        )

        logger.info("Sending request to Ollama")

        response = await self.chat_chain.generate(
            system_prompt=system_prompt,
            user_message=user_message,
        )

        logger.info("Response received from Ollama")

        return ChatResponse(response=response)