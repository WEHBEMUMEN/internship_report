import sys
from PIL import Image, ImageSequence
import cv2
import numpy as np

def convert_gif_to_mp4(gif_path, mp4_path, fps=10):
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
    
    # Setup video writer
    fourcc = cv2.VideoWriter_fourcc(*'mp4v') 
    video = cv2.VideoWriter(mp4_path, fourcc, fps, (width, height))
    
    for idx, frame in enumerate(frames):
        video.write(frame)
        
    video.release()
    print(f"Successfully converted to MP4: {mp4_path}")

if __name__ == '__main__':
    gif_in = 'D:/Internship_report/figures/nurbs_basis_curves.gif'
    mp4_out = 'D:/Internship_report/figures/pullback_mapping.mp4'
    convert_gif_to_mp4(gif_in, mp4_out)
