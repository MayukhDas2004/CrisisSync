import requests
from datetime import datetime

# Backend API URL
BACKEND_URL = "http://localhost:8000/emergency/report"

def send_alert(emergency_type: str, location: str, floor: int):
    payload = {
        "emergency_type": emergency_type,
        "location": location,
        "floor": floor,
        "room_number": None,
        "reported_by": "ai"
    }
    
    try:
        response = requests.post(BACKEND_URL, json=payload)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Alert sent successfully!")
            print(f"   Emergency ID: {data['emergency_id']}")
            print(f"   Status: {data['status']}")
            print(f"   Assigned Staff: {data['assigned_staff']}")
            return True
        else:
            print(f"❌ Alert failed! Status code: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Could not connect to backend: {e}")
        return False