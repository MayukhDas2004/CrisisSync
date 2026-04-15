from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import models
from database import get_db
from auth import get_current_user, require_admin

router = APIRouter()

class RoomCreate(BaseModel):
    room_number: str
    floor: int

class RoomUpdate(BaseModel):
    is_occupied: bool

@router.post("/add")
def add_room(body: RoomCreate, db: Session = Depends(get_db), current_user: models.User = Depends(require_admin)):
    existing = db.query(models.Room).filter(
        models.Room.room_number == body.room_number
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Room already exists")
    
    room = models.Room(
        room_number=body.room_number,
        floor=body.floor,
        is_occupied=False
    )
    db.add(room)
    db.commit()
    db.refresh(room)
    return {"message": "Room added successfully", "room_id": room.id}

@router.get("/all")
def get_all_rooms(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    rooms = db.query(models.Room).all()
    return rooms

@router.get("/floor/{floor_number}")
def get_rooms_by_floor(floor_number: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    rooms = db.query(models.Room).filter(
        models.Room.floor == floor_number
    ).all()
    if not rooms:
        raise HTTPException(status_code=404, detail="No rooms found on this floor")
    return rooms

@router.put("/{room_id}/update")
def update_room_status(room_id: int, body: RoomUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(require_admin)):
    room = db.query(models.Room).filter(
        models.Room.id == room_id
    ).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    room.is_occupied = body.is_occupied
    db.commit()
    return {"message": "Room status updated", "room_id": room_id, "is_occupied": body.is_occupied}

@router.delete("/{room_id}/delete")
def delete_room(room_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(require_admin)):
    room = db.query(models.Room).filter(
        models.Room.id == room_id
    ).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    db.delete(room)
    db.commit()
    return {"message": "Room deleted successfully"}