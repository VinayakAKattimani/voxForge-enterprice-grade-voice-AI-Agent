from app.prompts.system_prompt import SYSTEM_PROMPT


class PromptBuilder:

    @staticmethod
    def build(
        user_message: str,
        history: list,
        context: str,
    ) -> str:

        history_text = ""

        for message in history:
            history_text += (
                f'{message["role"].capitalize()}: '
                f'{message["content"]}\n'
            )

        return f"""
{SYSTEM_PROMPT}

Knowledge Context:
{context}

Conversation History:
{history_text}

User:
{user_message}

Assistant:
"""