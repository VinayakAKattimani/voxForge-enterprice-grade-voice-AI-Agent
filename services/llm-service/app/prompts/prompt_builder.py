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

        if context:
            knowledge_instruction = """
Use the Knowledge Context below to answer the user's question.
Prefer the provided knowledge when it is relevant.
Do not invent facts that contradict the provided knowledge.
"""
        else:
            knowledge_instruction = """
No relevant knowledge was found.
Answer the user's question using your general knowledge.
"""

        return f"""
{SYSTEM_PROMPT}

{knowledge_instruction}

Knowledge Context:
{context}

Conversation History:
{history_text}

Current User Question:
{user_message}

Answer the user clearly and naturally.
"""