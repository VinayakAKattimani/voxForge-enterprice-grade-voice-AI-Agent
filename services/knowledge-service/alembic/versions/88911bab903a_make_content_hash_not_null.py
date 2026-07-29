"""make content_hash not null

Revision ID: 88911bab903a
Revises: 1aa0d2814f3f
Create Date: 2026-07-27 07:05:07.028671

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '88911bab903a'
down_revision: Union[str, Sequence[str], None] = '1aa0d2814f3f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "documents",
        "content_hash",
        existing_type=sa.String(length=64),
        nullable=False,
    )

def downgrade() -> None:
    op.alter_column(
        "documents",
        "content_hash",
        existing_type=sa.String(length=64),
        nullable=True,
    )
