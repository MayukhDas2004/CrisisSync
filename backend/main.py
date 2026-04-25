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

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="CrisisSync API")

@app.get("/")
def root():
    return {"message": "CrisisSync backend running"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(emergency_router, prefix="/emergency", tags=["Emergency"])
app.include_router(staff_router, prefix="/staff", tags=["Staff"])
app.include_router(room_router, prefix="/room", tags=["Room"])

@app.get("/")
def root():
    return {"message": "CrisisSync API is running!"}
