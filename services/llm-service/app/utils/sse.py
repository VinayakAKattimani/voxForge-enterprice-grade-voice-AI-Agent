import json


def format_sse(data: dict) -> str:
    return f"data: {json.dumps(data)}\n\n"