from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from pydantic import BaseModel
import models
from database import get_db
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

router = APIRouter()

# Password hashing config
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth config
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ---------------------------
# SCHEMAS
# ---------------------------
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str  # admin, staff, guest

class Token(BaseModel):
    access_token: str
    token_type: str

# ---------------------------
# PASSWORD FUNCTIONS (FIXED)
# ---------------------------
def verify_password(plain, hashed):
    # bcrypt limit fix (IMPORTANT)
    plain = plain[:72]
    return pwd_context.verify(plain, hashed)

def hash_password(password):
    # bcrypt limit fix (IMPORTANT)
    password = password[:72]
    return pwd_context.hash(password)

# ---------------------------
# TOKEN CREATION
# ---------------------------
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ---------------------------
# REGISTER
# ---------------------------
@router.post("/register")
def register(body: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == body.email).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = models.User(
        name=body.name,
        email=body.email,
        password=hash_password(body.password),
        role=body.role
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "User registered successfully",
        "user_id": user.id
    }

# ---------------------------
# LOGIN
# ---------------------------
@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()

    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "sub": user.email,
        "role": user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }
