import cv2
from ultralytics import YOLO

# Load YOLOv8 model
model = YOLO("yolov8n.pt")

# YOLOv8 default model class names that relate to emergencies
EMERGENCY_LABELS = {
    "fire": ["fire", "smoke", "flame"],
    "medical": ["person fallen", "collapse"],
    "threat": ["knife", "gun", "weapon", "scissors"]
}

# Colors that indicate fire (in HSV)
def detect_fire_by_color(frame):
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    
    # Orange/Red/Yellow color range = fire colors
    import numpy as np
    lower_fire = np.array([0, 120, 120])
    upper_fire = np.array([35, 255, 255])
    
    mask = cv2.inRange(hsv, lower_fire, upper_fire)
    fire_pixels = cv2.countNonZero(mask)
    total_pixels = frame.shape[0] * frame.shape[1]
    fire_ratio = fire_pixels / total_pixels
    
    # If more than 15% of frame is fire colored
    if fire_ratio > 0.05:
        print(f"🔥 Fire detected by color! Coverage: {fire_ratio:.2%}")
        return True
    return False

def detect_emergency(frame):
    detected = []
    
    # Check fire by color detection
    if detect_fire_by_color(frame):
        detected.append({
            "emergency_type": "fire",
            "label": "fire",
            "confidence": 0.90
        })
        return detected  # Fire found, return immediately
    
    # Run YOLO for other detections
    results = model(frame, verbose=False)
    
    for result in results:
        for box in result.boxes:
            label = model.names[int(box.cls)]
            confidence = float(box.conf)
            
            if confidence < 0.5:
                continue
            
            for emergency_type, keywords in EMERGENCY_LABELS.items():
                if any(keyword in label.lower() for keyword in keywords):
                    detected.append({
                        "emergency_type": emergency_type,
                        "label": label,
                        "confidence": round(confidence, 2)
                    })
                    print(f"🚨 Detected: {label} | Type: {emergency_type} | Confidence: {confidence:.2f}")
    
    return detected