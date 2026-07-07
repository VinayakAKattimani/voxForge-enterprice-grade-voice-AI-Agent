from fastapi import APIRouter, Depends
from app.models.user import User
from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/user",
    tags=["Users"]
)

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "email": current_user.email,
        "role_id": str(current_user.role_id),
        "is_active": current_user.is_active,
        "is_verified": current_user.is_verified,
        "created_at": current_user.created_at,
        "updated_at": current_user.updated_at
    }