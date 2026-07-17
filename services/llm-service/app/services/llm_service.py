from app.clients.knowledge_client import KnowledgeClient
from app.core.logger import logger
from app.prompts.prompt_builder import PromptBuilder
from app.providers.factory import ProviderFactory
from app.schemas.chat import ChatMessage
from app.schemas.response import ChatResponse


class LLMService:

    def __init__(self):
        self.provider = ProviderFactory.get_provider()
        self.knowledge_client = KnowledgeClient()

    async def generate(
        self,
        conversation_id: str,
        messages: list[ChatMessage],
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

        knowledge = await self.knowledge_client.search(
            query=user_message,
            limit=5,
        )

        context = "\n\n".join(
            chunk["text"]
            for chunk in knowledge
        )

        prompt = PromptBuilder.build(
            user_message=user_message,
            history=history,
            context=context,
        )

        logger.info("Sending request to Ollama")

        response = await self.provider.generate(prompt)

        logger.info("Response received from Ollama")

        return ChatResponse(response=response)

    async def get_models(self):
        return await self.provider.get_models()

    async def stream_generate(
        self,
        conversation_id: str,
        messages: list[ChatMessage],
    ):

        logger.info(
            f"Streaming response for conversation_id={conversation_id}"
        )

        history = [
            {
                "role": msg.role.value,
                "content": msg.content,
            }
            for msg in messages[:-1]
        ]

        user_message = messages[-1].content

        knowledge = await self.knowledge_client.search(
            query=user_message,
            limit=5,
        )

        logger.info(f"Knowledge results: {knowledge}")

        context = (
            "\n\n".join(
                chunk["text"]
                for chunk in knowledge
            )
            if knowledge
            else "No relevant knowledge was found."
        )

        logger.info(f"Knowledge context:\n{context}")

        prompt = PromptBuilder.build(
            user_message=user_message,
            history=history,
            context=context,
        )

        async for chunk in self.provider.stream_generate(prompt):
            yield chunk