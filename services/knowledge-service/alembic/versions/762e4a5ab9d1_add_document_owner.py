"""add document owner

Revision ID: 762e4a5ab9d1
Revises: aa89a0d233a7
Create Date: 2026-08-18 06:23:47.901503

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "762e4a5ab9d1"
down_revision: Union[str, Sequence[str], None] = "aa89a0d233a7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    # Add temporarily nullable so existing documents can be assigned an owner
    op.add_column(
        "documents",
        sa.Column(
            "owner_id",
            sa.Uuid(),
            nullable=True,
        ),
    )

    # Assign the existing resume document to the current user
    op.execute(
        sa.text(
            """
            UPDATE documents
            SET owner_id = '01db4dc1-15be-4682-8bc7-958640b4f9f6'
            WHERE owner_id IS NULL
            """
        )
    )

    # owner_id is now mandatory
    op.alter_column(
        "documents",
        "owner_id",
        nullable=False,
    )

    # Index for owner-based document queries
    op.create_index(
        "ix_documents_owner_id",
        "documents",
        ["owner_id"],
        unique=False,
    )


def downgrade() -> None:

    op.drop_index(
        "ix_documents_owner_id",
        table_name="documents",
    )

    op.drop_column(
        "documents",
        "owner_id",
    )