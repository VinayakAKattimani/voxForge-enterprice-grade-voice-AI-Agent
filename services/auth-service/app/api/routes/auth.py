from fastapi import APIRouter

from app.schemas.auth_schema import RegisterRequest

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(request: RegisterRequest):
    return {
        "message": "Register API working",
        "user": request
    }