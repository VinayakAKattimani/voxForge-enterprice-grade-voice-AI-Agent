"""populate existing content hashes

Revision ID: e449394b9d28
Revises: 88911bab903a
Create Date: 2026-07-29 04:20:07.174218

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from pathlib import Path
from app.utils.file_hash import generate_file_hash


# revision identifiers, used by Alembic.
revision: str = 'e449394b9d28'
down_revision: Union[str, Sequence[str], None] = '88911bab903a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    connection = op.get_bind()

    documents = connection.execute(
        sa.text(
            """
            SELECT id, file_path
            FROM documents
            WHERE content_hash IS NULL
            """
        )
    )

    for document in documents:
        file_hash = generate_file_hash(document.file_path)

        connection.execute(
            sa.text(
                """
                UPDATE documents
                SET content_hash = :hash
                WHERE id = :id
                """
            ),
            {
                "hash": file_hash,
                "id": document.id,
            }
        )


def downgrade() -> None:
    """Downgrade schema."""
    pass
