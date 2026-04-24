from database import SessionLocal
from models import User
from auth import get_password_hash

db = SessionLocal()

existing = db.query(User).filter(User.email == "admin@crisissync.com").first()
if existing:
    print("Admin already exists!")
else:
    admin = User(
        name="Admin",
        email="admin@crisissync.com",
        password=get_password_hash("admin123"),
        role="admin",
        is_active=True
    )
    db.add(admin)
    db.commit()
    print("✅ Admin created successfully!")
    print("Email: admin@crisissync.com")
    print("Password: admin123")

db.close()