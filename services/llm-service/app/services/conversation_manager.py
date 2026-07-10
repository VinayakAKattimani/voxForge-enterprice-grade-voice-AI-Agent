class ConversationManager:

    def __init__(self):
        self.conversations = {}

    def add_message(
        self,
        conversation_id: str,
        role: str,
        content: str
    ):

        if conversation_id not in self.conversations:
            self.conversations[conversation_id] = []

        self.conversations[conversation_id].append(
            {
                "role": role,
                "content": content
            }
        )
        print(self.conversations)

    def get_messages(self, conversation_id: str):
        print("GET:", self.conversations)
        return self.conversations.get(conversation_id, [])