from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # admin, staff, guest
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String, nullable=False)
    floor = Column(Integer, nullable=False)
    is_occupied = Column(Boolean, default=False)

class Staff(Base):
    __tablename__ = "staff"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    staff_type = Column(String, nullable=False)  # fire, medical, security, general
    is_available = Column(Boolean, default=True)
    current_floor = Column(Integer, nullable=True)
    user = relationship("User")

class Emergency(Base):
    __tablename__ = "emergencies"
    id = Column(Integer, primary_key=True, index=True)
    emergency_type = Column(String, nullable=False)  # fire, medical, threat
    location = Column(String, nullable=False)
    floor = Column(Integer, nullable=False)
    room_number = Column(String, nullable=True)
    status = Column(String, default="active")  # active, assigned, resolved
    reported_by = Column(String, nullable=False)  # guest, ai
    created_at = Column(DateTime, default=datetime.utcnow)
    assignments = relationship("Assignment", back_populates="emergency")

class Assignment(Base):
    __tablename__ = "assignments"
    id = Column(Integer, primary_key=True, index=True)
    emergency_id = Column(Integer, ForeignKey("emergencies.id"))
    staff_id = Column(Integer, ForeignKey("staff.id"))
    status = Column(String, default="pending")  # pending, accepted, on_the_way, reached, resolved
    assigned_at = Column(DateTime, default=datetime.utcnow)
    emergency = relationship("Emergency", back_populates="assignments")
    staff = relationship("Staff")