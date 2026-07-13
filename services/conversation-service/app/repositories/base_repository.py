from typing import Generic, Type, TypeVar
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.base import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    def __init__(
        self,
        model: Type[ModelType],
        db: Session,
    ):
        self.model = model
        self.db = db

    def create(self, **kwargs) -> ModelType:
        instance = self.model(**kwargs)

        self.db.add(instance)
        self.db.commit()
        self.db.refresh(instance)

        return instance

    def get_by_id(
        self,
        id: UUID,
    ) -> ModelType | None:
        result = self.db.execute(
            select(self.model).where(self.model.id == id)
        )

        return result.scalar_one_or_none()

    def delete(
        self,
        instance: ModelType,
    ) -> None:
        self.db.delete(instance)
        self.db.commit()

    def update(
        self,
        instance: ModelType,
        **kwargs,
    ) -> ModelType:
        for key, value in kwargs.items():
            setattr(instance, key, value)

        self.db.commit()
        self.db.refresh(instance)

        return instance