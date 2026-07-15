from fastapi import APIRouter, Request

from app.services.proxy import proxy_request
import inspect

print(inspect.signature(proxy_request))
router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/login")
async def login(request: Request):
    return await proxy_request(
        service_name="auth",
        request=request,
        target_path="/auth/login",
        
    )


@router.post("/register")
async def register(request: Request):
    return await proxy_request(
        service_name="auth",
        request=request,
        target_path="/auth/register",
    )

@router.post("/refresh")
async def refresh(request: Request):
    return await proxy_request(
        service_name="auth",
        request=request,
        target_path="/auth/refresh",
    )