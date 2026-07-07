from sqlalchemy.orm import Session

from app.models.role import Role


class RoleRepository:

    def get_by_name(self, db: Session, name: str):
        return (
            db.query(Role)
            .filter(Role.name == name)
            .first()
        )