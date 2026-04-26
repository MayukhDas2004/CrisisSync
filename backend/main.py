from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models

from routes_auth import router as auth_router
from routes_emergency import router as emergency_router
from routes_staff import router as staff_router
from routes_room import router as room_router

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="CrisisSync API")

# ✅ CORS FIX (IMPORTANT)
origins = [
    "http://localhost:3000",
    "https://crisis-sync-85jn.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # NOT "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ ROOT (only once)
@app.get("/")
def root():
    return {"message": "CrisisSync backend running"}

# ✅ ROUTES
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(emergency_router, prefix="/emergency", tags=["Emergency"])
app.include_router(staff_router, prefix="/staff", tags=["Staff"])
app.include_router(room_router, prefix="/room", tags=["Room"])
