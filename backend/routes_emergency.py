from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional
from pydantic import BaseModel
import models
from database import get_db
from auth import get_current_user

router = APIRouter()

class EmergencyCreate(BaseModel):
    emergency_type: str  # fire, medical, threat
    location: str
    floor: int
    room_number: Optional[str] = None
    reported_by: str  # guest, ai

class EmergencyUpdate(BaseModel):
    status: str  # active, assigned, resolved

def smart_assign(emergency_type: str, floor: int, db: Session):
    # Step 1: Same type + Same floor
    staff = db.query(models.Staff).filter(
        models.Staff.is_available == True,
        models.Staff.staff_type == emergency_type,
        models.Staff.current_floor == floor
    ).first()
    if staff:
        return staff

    # Step 2: Same type + Nearest floor
    all_same_type = db.query(models.Staff).filter(
        models.Staff.is_available == True,
        models.Staff.staff_type == emergency_type
    ).all()
    if all_same_type:
        return min(all_same_type, key=lambda s: abs((s.current_floor or 0) - floor))

    # Step 3: General staff + Same floor
    staff = db.query(models.Staff).filter(
        models.Staff.is_available == True,
        models.Staff.staff_type == "general",
        models.Staff.current_floor == floor
    ).first()
    if staff:
        return staff

    # Step 4: Any available staff (nearest floor)
    all_available = db.query(models.Staff).filter(
        models.Staff.is_available == True
    ).all()
    if all_available:
        return min(all_available, key=lambda s: abs((s.current_floor or 0) - floor))

    return None

@router.post("/report")
def report_emergency(body: EmergencyCreate, db: Session = Depends(get_db)):
    emergency = models.Emergency(
        emergency_type=body.emergency_type,
        location=body.location,
        floor=body.floor,
        room_number=body.room_number,
        reported_by=body.reported_by,
        status="active",
        created_at=datetime.utcnow()
    )
    db.add(emergency)
    db.commit()
    db.refresh(emergency)

    # Smart Assignment
    assigned_staff = smart_assign(body.emergency_type, body.floor, db)

    if assigned_staff:
        assignment = models.Assignment(
            emergency_id=emergency.id,
            staff_id=assigned_staff.id,
            status="pending",
            assigned_at=datetime.utcnow()
        )
        db.add(assignment)
        assigned_staff.is_available = False
        emergency.status = "assigned"
        db.commit()

    return {
        "emergency_id": emergency.id,
        "status": emergency.status,
        "message": "Emergency reported successfully",
        "assigned_staff": assigned_staff.id if assigned_staff else None,
        "assigned_staff_type": assigned_staff.staff_type if assigned_staff else None
    }

@router.get("/all")
def get_all_emergencies(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    emergencies = db.query(models.Emergency).order_by(
        models.Emergency.created_at.desc()
    ).all()
    return emergencies

@router.get("/active")
def get_active_emergencies(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    emergencies = db.query(models.Emergency).filter(
        models.Emergency.status != "resolved"
    ).order_by(models.Emergency.created_at.desc()).all()
    return emergencies

@router.put("/{emergency_id}/status")
def update_emergency_status(emergency_id: int, body: EmergencyUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    emergency = db.query(models.Emergency).filter(
        models.Emergency.id == emergency_id
    ).first()
    if not emergency:
        raise HTTPException(status_code=404, detail="Emergency not found")
    emergency.status = body.status
    db.commit()
    return {"message": "Status updated", "status": body.status}