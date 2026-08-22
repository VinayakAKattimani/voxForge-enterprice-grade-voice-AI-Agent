import time
from uuid import UUID

from app.core.logger import logger
from app.prompts.prompt_builder import PromptBuilder
from app.providers.factory import ProviderFactory
from app.schemas.chat import ChatMessage
from app.schemas.response import ChatResponse


class LLMService:

    def __init__(self):
        self.provider = ProviderFactory.get_provider()

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
            for msg in messages[-5:-1]
        ]

        user_message = messages[-1].content

        context = context or ""

        system_prompt = PromptBuilder.build(
            history=history,
            context=context,
            user_message=user_message,
        )

        logger.info(
            "llm_prompt_debug\n%s",
            system_prompt,
        )

        logger.info("Waiting for LLM provider")

        start_time = time.perf_counter()

        logger.info("Sending request to LLM provider")

        response = await self.provider.generate(
            system_prompt=system_prompt,
            user_message=user_message,
        )

        elapsed_time = time.perf_counter() - start_time

        logger.info(
            f"Response received from LLM provider in {elapsed_time:.2f}s"
        )

        return ChatResponse(response=response)

    async def stream_generate(
        self,
        conversation_id: str,
        user_id: UUID,
        messages: list[ChatMessage],
        context: str | None = None,
    ):

        logger.info(
            f"Streaming response for conversation_id={conversation_id}"
        )

        history = [
            {
                "role": msg.role.value,
                "content": msg.content,
            }
            for msg in messages[-5:-1]
        ]

        user_message = messages[-1].content

        context = context or ""

        system_prompt = PromptBuilder.build(
            history=history,
            context=context,
            user_message=user_message,
        )

        logger.info(
            "llm_prompt_debug\n%s",
            system_prompt,
        )

        logger.info("Starting LLM streaming")

        async for chunk in self.provider.stream_generate(
            system_prompt=system_prompt,
            user_message=user_message,
        ):
            yield chunk