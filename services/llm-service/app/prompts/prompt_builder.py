from app.prompts.system_prompt import SYSTEM_PROMPT


class PromptBuilder:

    @staticmethod
    def build(
        history: list,
        context: str,
        user_message: str,
    ) -> str:

        history_text = ""

        for message in history:
            history_text += (
                f'{message["role"].capitalize()}: '
                f'{message["content"]}\n'
            )

        knowledge_context = (
            context
            if context
            else "No relevant company information was found."
        )

        return f"""
{SYSTEM_PROMPT}

Knowledge Context:
{knowledge_context}

Conversation History:
{history_text}

Current User Question:
{user_message}
"""