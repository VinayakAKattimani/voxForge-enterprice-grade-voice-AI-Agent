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

You are provided with retrieved knowledge from the user's uploaded documents.

Rules:
- Use the Knowledge Context whenever it contains information relevant to the user's question.
- If the answer is present in the Knowledge Context, answer using that information.
- If the Knowledge Context is not relevant, answer normally.
- Do not invent facts that are not supported by the retrieved context.

Knowledge Context:
{context}

Conversation History:
{history_text}

User Question:
{user_message}

Assistant:
"""