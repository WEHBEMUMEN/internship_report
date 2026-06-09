import sys
from PIL import Image, ImageSequence
import cv2
import numpy as np

def convert_gif_to_h264(gif_path, mp4_path, fps=10):
    print(f"Loading GIF: {gif_path}")
    gif = Image.open(gif_path)
    
    # Read all frames and convert them to BGR (OpenCV format)
    frames = []
    for frame in ImageSequence.Iterator(gif):
        # Convert frame to RGB
        frame_rgb = frame.convert('RGB')
        # Convert to numpy array and swap colors RGB -> BGR
        frame_np = np.array(frame_rgb)
        frame_bgr = cv2.cvtColor(frame_np, cv2.COLOR_RGB2BGR)
        frames.append(frame_bgr)
        
    if not frames:
        print("Error: No frames found in GIF")
        return
        
    height, width, layers = frames[0].shape
    print(f"GIF details: {width}x{height}, {len(frames)} frames")
    
    # Setup H.264 video writer
    # 'avc1' is the fourcc code for H.264/AVC encoding
    fourcc = cv2.VideoWriter_fourcc(*'avc1') 
    video = cv2.VideoWriter(mp4_path, fourcc, fps, (width, height))
    
    if not video.isOpened():
        print("Warning: 'avc1' (H.264) codec is not directly opened. Trying fallback 'H264' fourcc...")
        fourcc = cv2.VideoWriter_fourcc(*'H264')
        video = cv2.VideoWriter(mp4_path, fourcc, fps, (width, height))
        
    if not video.isOpened():
        print("Warning: 'H264' codec failed. Trying fallback 'x264'...")
        fourcc = cv2.VideoWriter_fourcc(*'x264')
        video = cv2.VideoWriter(mp4_path, fourcc, fps, (width, height))
        
    if not video.isOpened():
        print("Error: Could not open any H.264 codec writer in OpenCV.")
        return

    for idx, frame in enumerate(frames):
        video.write(frame)
        
    video.release()
    print(f"Successfully converted to H.264 MP4: {mp4_path}")

if __name__ == '__main__':
    gif_in = 'D:/Internship_report/figures/nurbs_basis_curves.gif'
    mp4_out = 'D:/Internship_report/figures/pullback_mapping.mp4'
    convert_gif_to_h264(gif_in, mp4_out)
