from database import SessionLocal 
from models import User            
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
db = SessionLocal()

# Create the user only if it doesn't exist
user = db.query(User).filter(User.username == "admin").first()
if not user:
    hashed_password = pwd_context.hash("admin123")
    # Note: Adjust 'email' field if Person C's model requires it
    try:
        new_user = User(
            username="admin",
            email="admin@crissync.com",
            hashed_password=hashed_password,
            is_active=True
            # Add is_superuser=True if required by your model
        )
        db.add(new_user)
        db.commit()
        print("✅ Admin user 'admin' created successfully!")
    except Exception as e:
        print(f"⚠️ Error creating user (try removing email/is_active fields): {e}")
else:
    print("ℹ️ User 'admin' already exists.")
db.close()