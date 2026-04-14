from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import models
from database import get_db
from auth import get_current_user, require_admin

router = APIRouter()

class StaffCreate(BaseModel):
    user_id: int
    staff_type: str  # fire, medical, security, general
    current_floor: Optional[int] = 1

class AssignmentUpdate(BaseModel):
    status: str  # accepted, on_the_way, reached, resolved

@router.post("/add")
def add_staff(body: StaffCreate, db: Session = Depends(get_db), current_user: models.User = Depends(require_admin)):
    user = db.query(models.User).filter(models.User.id == body.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.role != "staff":
        raise HTTPException(status_code=400, detail="User is not a staff member")
    
    existing = db.query(models.Staff).filter(models.Staff.user_id == body.user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Staff already exists")

    staff = models.Staff(
        user_id=body.user_id,
        staff_type=body.staff_type,
        is_available=True,
        current_floor=body.current_floor
    )
    db.add(staff)
    db.commit()
    db.refresh(staff)
    return {"message": "Staff added successfully", "staff_id": staff.id}

@router.get("/all")
def get_all_staff(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    staff_list = db.query(models.Staff).all()
    result = []
    for staff in staff_list:
        user = db.query(models.User).filter(models.User.id == staff.user_id).first()
        result.append({
            "staff_id": staff.id,
            "name": user.name if user else "Unknown",
            "email": user.email if user else "Unknown",
            "staff_type": staff.staff_type,
            "is_available": staff.is_available,
            "current_floor": staff.current_floor
        })
    return result

@router.get("/my-assignments")
def get_my_assignments(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    staff = db.query(models.Staff).filter(models.Staff.user_id == current_user.id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff profile not found")
    
    assignments = db.query(models.Assignment).filter(
        models.Assignment.staff_id == staff.id,
        models.Assignment.status != "resolved"
    ).all()
    
    result = []
    for assignment in assignments:
        emergency = db.query(models.Emergency).filter(
            models.Emergency.id == assignment.emergency_id
        ).first()
        result.append({
            "assignment_id": assignment.id,
            "emergency_type": emergency.emergency_type if emergency else "Unknown",
            "location": emergency.location if emergency else "Unknown",
            "floor": emergency.floor if emergency else 0,
            "room_number": emergency.room_number if emergency else None,
            "status": assignment.status,
            "assigned_at": assignment.assigned_at
        })
    return result

@router.put("/assignment/{assignment_id}/update")
def update_assignment_status(assignment_id: int, body: AssignmentUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    assignment = db.query(models.Assignment).filter(
        models.Assignment.id == assignment_id
    ).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    assignment.status = body.status
    
    # If resolved, make staff available again
    if body.status == "resolved":
        staff = db.query(models.Staff).filter(
            models.Staff.id == assignment.staff_id
        ).first()
        if staff:
            staff.is_available = True
        
        emergency = db.query(models.Emergency).filter(
            models.Emergency.id == assignment.emergency_id
        ).first()
        if emergency:
            emergency.status = "resolved"
    
    db.commit()
    return {"message": "Assignment updated", "status": body.status}

@router.put("/update-floor/{staff_id}")
def update_staff_floor(staff_id: int, floor: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    staff = db.query(models.Staff).filter(models.Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    staff.current_floor = floor
    db.commit()
    return {"message": "Floor updated", "floor": floor}