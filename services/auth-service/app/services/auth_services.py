from sqlalchemy.orm import Session

from app.repositories.user_repository import UserRepository
from app.schemas.auth_schema import RegisterRequest


class AuthService:

    def __init__(self):
        self.user_repository = UserRepository()
    
    def register(self, db: Session,request: RegisterRequest):
        existing_user = self.user_repository.get_by_email(
            db=db,
            email=request.email
        )

        if existing_user:
            return {
                "message": "Email already registered"
            }

        return {
            "message": "Email is available"
        }
    
    

    def login(self, db: Session,request: RegisterRequest):
        pass

    def refresh_token(self, db: Session,request: RegisterRequest):
        pass

    def logout(self, db: Session,request: RegisterRequest):
        pass

    def get_current_user(self, db: Session,request: RegisterRequest):
        pass