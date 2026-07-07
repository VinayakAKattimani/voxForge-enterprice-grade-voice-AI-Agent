from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.schemas.auth_schema import RegisterRequest, LoginRequest
from passlib.context import CryptContext
from app.models.user import User
from app.repositories.role_repository import RoleRepository
from app.core.security import (hash_password,verify_password)
from app.core.security import (verify_password,create_access_token)
from app.core.security import (verify_password, create_access_token)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

class AuthService:

    def __init__(self):
        self.user_repository = UserRepository()
        self.role_repository = RoleRepository()
    
    def register(self, db: Session,request: RegisterRequest):
        existing_user = self.user_repository.get_by_email(
            db=db,
            email=request.email
        )

        if existing_user: 
            raise HTTPException(status_code = 409, detail = "Email already registered")
        

        hashed_password = hash_password(request.password)


        user_role = self.role_repository.get_by_name(db, "USER") 

        if not user_role:
            raise HTTPException(status_code=500, detail="Default USER role not found.")

        user = User(
            first_name=request.first_name,
            last_name=request.last_name,
            email=request.email,
            password_hash=hashed_password,
            role_id=user_role.id
        )

        created_user = self.user_repository.create(
            db=db,
            user=user
        )
        return {
            "message": "User registered successfully",
            "user_id": created_user.id,
            "email" : created_user.email
        }
    
    

    def login(self, db: Session,request: LoginRequest):
        user = self.user_repository.get_by_email(
        db=db,
        email=request.email
        )

        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        if not verify_password(request.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        access_token = create_access_token(
            data={
                "sub": str(user.id),
                "email": user.email
            }
        )
        return {
            "access_token": access_token,
            "token_type": "bearer"
        }
    def refresh_token(self, db: Session,request: RegisterRequest):
        pass

    def logout(self, db: Session,request: RegisterRequest):
        pass

    def get_current_user(self, db: Session,request: RegisterRequest):
        pass