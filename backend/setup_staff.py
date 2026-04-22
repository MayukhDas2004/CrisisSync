import sys
import os
sys.path.insert(0, os.getcwd())

from dotenv import load_dotenv
load_dotenv()

from database import SessionLocal
from models import User, Staff
from passlib.context import CryptContext

db = SessionLocal()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

try:
    # Step 1: Check if firestaff1 user exists
    staff_user = db.query(User).filter(
        User.email == "firestaff1@crisissync.com"
    ).first()

    if not staff_user:
        print("Creating firestaff1 user...")
        hashed = pwd_context.hash("staff123")
        staff_user = User(
            name="Fire Staff 1",
            email="firestaff1@crisissync.com",
            password=hashed,
            role="staff"
        )
        db.add(staff_user)
        db.commit()
        db.refresh(staff_user)
        print(f"✅ User created! ID: {staff_user.id}")
    else:
        print(f"ℹ️ User already exists! ID: {staff_user.id}")

    # Step 2: Check if staff profile exists
    staff_profile = db.query(Staff).filter(
        Staff.user_id == staff_user.id
    ).first()

    if not staff_profile:
        print("Creating staff profile...")
        staff_profile = Staff(
            user_id=staff_user.id,
            staff_type="fire",
            current_floor=1,
            is_available=True
        )
        db.add(staff_profile)
        db.commit()
        db.refresh(staff_profile)
        print(f"✅ Staff profile created! Staff ID: {staff_profile.id}")
    else:
        print(f"ℹ️ Staff profile already exists! Staff ID: {staff_profile.id}")

    print("\n🎉 Setup Complete!")
    print(f"   Email: firestaff1@crisissync.com")
    print(f"   Password: staff123")
    print(f"   Role: staff")
    print(f"   Type: fire")
    print(f"   Floor: 1")

except Exception as e:
    print(f"❌ Error: {type(e).__name__}: {e}")
    db.rollback()
finally:
    db.close()