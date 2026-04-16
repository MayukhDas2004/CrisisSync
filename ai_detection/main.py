import cv2
import time
from video_input import get_video_capture
from detect_emergency import detect_emergency
from alert_trigger import send_alert

# Camera/Location settings
CAMERA_LOCATION = "CCTV-CAM-1"
CAMERA_FLOOR = 1

# Cooldown so we don't spam alerts (30 seconds)
ALERT_COOLDOWN = 30
last_alert_time = {}

def should_send_alert(emergency_type):
    current_time = time.time()
    if emergency_type in last_alert_time:
        time_passed = current_time - last_alert_time[emergency_type]
        if time_passed < ALERT_COOLDOWN:
            print(f"⏳ Cooldown active for {emergency_type}, skipping alert...")
            return False
    last_alert_time[emergency_type] = current_time
    return True

def run():
    print("🚀 CrisisSync AI Detection Starting...")
    
    cap = get_video_capture()
    if cap is None:
        return
    
    print("🎥 Processing video feed...")
    
    while True:
        ret, frame = cap.read()
        
        # If video ended, restart it
        if not ret:
            print("🔄 Video ended, restarting...")
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue
        
        # Run AI detection on frame
        detected = detect_emergency(frame)
        
        # Send alert for each detection
        for item in detected:
            emergency_type = item["emergency_type"]
            
            if should_send_alert(emergency_type):
                print(f"🚨 Sending alert: {emergency_type}")
                send_alert(
                    emergency_type=emergency_type,
                    location=CAMERA_LOCATION,
                    floor=CAMERA_FLOOR
                )
        
        # Show video window
        cv2.imshow("CrisisSync AI Detection", frame)
        
        # Press Q to quit
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()
    print("👋 AI Detection stopped.")

if __name__ == "__main__":
    run()