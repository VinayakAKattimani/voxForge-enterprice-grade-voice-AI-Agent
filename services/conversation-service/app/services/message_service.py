from uuid import UUID

from fastapi import HTTPException

from app.repositories.conversation_repository import ConversationRepository
from app.repositories.message_repository import MessageRepository

from app.schemas.message import MessageCreate, Message

from app.clients.llm_client import LLMClient
from app.clients.knowledge_client import KnowledgeClient

from app.schemas.llm import LLMChatRequest

from app.utils.enums import MessageRole


class MessageService:

    def __init__(
        self,
        message_repository: MessageRepository,
        conversation_repository: ConversationRepository,
        llm_client: LLMClient,
        knowledge_client: KnowledgeClient,
    ):
        self.message_repository = message_repository
        self.conversation_repository = conversation_repository
        self.llm_client = llm_client
        self.knowledge_client = knowledge_client

    def create_message(
        self,
        conversation_id: UUID,
        user_id: UUID,
        message: MessageCreate,
        request_id: str,
    ):

        conversation = self.conversation_repository.get_by_id(
            conversation_id
        )

        if not conversation:
            raise HTTPException(
                status_code=404,
                detail="Conversation not found",
            )

        if conversation.user_id != user_id:
            raise HTTPException(
                status_code=403,
                detail="Access denied",
            )

        # Save user message
        self.message_repository.create(
            conversation_id=conversation_id,
            role=message.role,
            content=message.content,
        )

        # Load conversation history
        history = self.message_repository.get_by_conversation_id(
            conversation_id
        )

        llm_messages = [
            Message(
                role=item.role,
                content=item.content,
            )
            for item in history
        ]

        # Search Knowledge Service
        knowledge_results = self.knowledge_client.search(
            query=message.content,
            user_id=user_id,
            request_id=request_id,
        )

        # Extract relevant context
        context = None

        if knowledge_results:
            context = "\n\n".join(
                result.text
                for result in knowledge_results
            )

        # Build LLM request
        llm_request = LLMChatRequest(
            conversation_id=conversation_id,
            user_id=user_id,
            messages=llm_messages,
            context=context,
        )

        # Generate AI response
        llm_response = self.llm_client.generate_response(
            request=llm_request,
            user_id=user_id,
            request_id=request_id,
        )

        # Save assistant reply
        assistant_message = self.message_repository.create(
            conversation_id=conversation_id,
            role=MessageRole.ASSISTANT,
            content=llm_response.response,
        )

        return assistant_message

    def get_messages(
        self,
        conversation_id: UUID,
        user_id: UUID,
    ):

        conversation = self.conversation_repository.get_by_id(
            conversation_id
        )

        if not conversation:
            raise HTTPException(
                status_code=404,
                detail="Conversation not found",
            )

        if conversation.user_id != user_id:
            raise HTTPException(
                status_code=403,
                detail="Access denied",
            )

        return self.message_repository.get_by_conversation_id(
            conversation_id
        )