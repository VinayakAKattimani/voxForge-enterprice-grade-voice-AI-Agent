from app.db.session import SessionLocal
from app.models.role import Role

db = SessionLocal()

roles = [
    Role(name="ADMIN", description="System Administrator"),
    Role(name="USER", description="Default User"),
    Role(name="AGENT", description="Voice AI Agent")
]

db.add_all(roles)
db.commit()

print("Roles inserted successfully!")