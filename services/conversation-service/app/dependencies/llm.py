from fastapi import Depends
from app.clients.llm_client import LLMClient


def get_llm_client():
    return LLMClient()