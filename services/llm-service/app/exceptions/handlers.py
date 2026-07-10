from fastapi import Request
from fastapi.responses import JSONResponse

from app.exceptions.llm_exception import LLMException


async def llm_exception_handler(
    request: Request,
    exc: LLMException
):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.message
        }
    )