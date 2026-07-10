from app.prompts.prompt_builder import PromptBuilder
from app.schemas.response import ChatResponse
from app.providers.factory import ProviderFactory
from app.services.conversation_manager import ConversationManager
from app.core.logger import logger

conversation_manager = ConversationManager()


class LLMService:

    def __init__(self):
        self.provider = ProviderFactory.get_provider()


    async def generate(self, message: str, conversation_id: str):

        logger.info(
            f"Generating response for conversation_id={conversation_id}"
        )

        # Get previous history first
        history = conversation_manager.get_messages(conversation_id)

        # Build prompt WITHOUT current message in history
        prompt = PromptBuilder.build(
            user_message=message,
            history=history
        )

        logger.info("Sending request to Ollama")
        print(prompt)
        response = await self.provider.generate(prompt)
        logger.info("Response received from Ollama")
        # Save conversation after successful response
        conversation_manager.add_message(
            conversation_id,
            "user",
            message
        )

        conversation_manager.add_message(
            conversation_id,
            "assistant",
            response
        )
        logger.info(f"Conversation updated: {conversation_id}")
        return ChatResponse(response=response)
    
    async def get_models(self):
        return await self.provider.get_models()
    
    async def stream_generate(self, message: str, conversation_id: str):
        conversation_manager.add_message(
            conversation_id=conversation_id,
            role="user",
            content=message
        )

        logger.info(f"Streaming response for conversation_id={conversation_id}")

        history = conversation_manager.get_messages(conversation_id)

        prompt = PromptBuilder.build(
            user_message=message,
            history=history
        )

        async for chunk in self.provider.stream_generate(prompt):
            yield chunk