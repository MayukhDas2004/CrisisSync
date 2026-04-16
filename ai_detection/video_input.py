import cv2
import os

def get_video_capture(source=None):
    # If no source given, use sample video from videos folder
    if source is None:
        video_folder = os.path.join(os.path.dirname(__file__), "videos")
        videos = [f for f in os.listdir(video_folder) if f.endswith(".mp4")]
        
        if not videos:
            print("❌ No video found in videos folder!")
            return None
        
        source = os.path.join(video_folder, videos[0])
        print(f"📹 Using video: {videos[0]}")

    cap = cv2.VideoCapture(source)
    
    if not cap.isOpened():
        print("❌ Could not open video!")
        return None
    
    print("✅ Video loaded successfully!")
    return cap