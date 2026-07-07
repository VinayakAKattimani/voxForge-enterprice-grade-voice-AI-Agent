from app.db.session import SessionLocal
from app.models.role import Role

db = SessionLocal()

try:
    roles = [
        Role(
            name="ADMIN",
            description="System Administrator"
        ),
        Role(
            name="USER",
            description="Default application user"
        ),
        Role(
            name="AGENT",
            description="Voice AI Agent"
        )
    ]

    db.add_all(roles)
    db.commit()

    print("✅ Roles inserted successfully!")

except Exception as e:
    db.rollback()
    print(f"❌ Error: {e}")

finally:
    db.close()