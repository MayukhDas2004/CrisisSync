# 🤖 CrisisSync - AI Detection Module

> **Part D** of the CrisisSync Hotel Emergency Response System  
> Developed by: [Your Name Here]

---

## 📌 What This Module Does

This module is responsible for **automatically detecting emergencies** from video feeds (CCTV/sample videos) and sending **instant alerts** to the backend system — with **zero human intervention**.

| Detection Type | Method |
|---------------|--------|
| 🔥 Fire / Smoke | Color-based HSV detection |
| 🧍 Person / Threat | YOLOv8 AI Model |
| 🔪 Weapon (knife/gun) | YOLOv8 AI Model |

---

## 📁 File Structure
ai_detection/
├── main.py # Entry point - run this!
├── video_input.py # Loads video from /videos folder
├── detect_emergency.py # AI detection logic
├── alert_trigger.py # Sends alert to backend API
├── requirements.txt # All dependencies
├── models/ # YOLO model stored here
└── videos/ # Put your sample videos here


---

## ⚙️ Setup Instructions

### Step 1: Go to ai_detection folder
```bash
cd ai_detection
###Step 2: Create virtual environment
python3 -m venv venv
source venv/bin/activate
###Step 3: Install dependencies
pip install -r requirements.txt

###Step 4: Add a sample video
Put any .mp4 video inside the videos/ folder
Rename it to fire_sample.mp4 or any .mp4 name

🚀 How to Run
Make sure backend is running first, then:
python3 main.py

📡 Alert Sent to Backend
When emergency is detected, this is automatically sent to:
POST http://localhost:8000/emergency/report

With this data:
{
  "emergency_type": "fire",
  "location": "CCTV-CAM-1",
  "floor": 1,
  "room_number": null,
  "reported_by": "ai"
}

⚙️ Configuration
To change camera settings, open main.py and edit:

CAMERA_LOCATION = "CCTV-CAM-1"   # Change camera name
CAMERA_FLOOR = 1                   # Change floor number
ALERT_COOLDOWN = 30                # Seconds between alerts

To change fire sensitivity, open detect_emergency.py and edit:

if fire_ratio > 0.05:   # Lower = more sensitive

🔍 How Detection Works
Video Feed (frame by frame)
        ↓
Fire Color Detection (HSV)
        ↓ (if fire found)
Send Alert → Backend API
        ↓ (if no fire)
YOLOv8 Model Check
        ↓ (if person/weapon found)
Send Alert → Backend API
        ↓
30 second cooldown
        ↓
Repeat...

❗ Troubleshooting
Problem	Solution
Alert failed! Status code: 501	   Backend is not running, ask teammate C to start it
No video found in videos folder	   Add a .mp4 file inside videos/ folder
Could not open video	           Check if video file is corrupted
Video window not opening	       Make sure you are not running in headless mode
