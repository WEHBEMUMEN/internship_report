import os
from PIL import Image, ImageSequence

gif_path = 'D:/Internship_report/figures/nurbs_basis_curves.gif'
out_dir = 'D:/Internship_report/thesis/chapters/6_digital_twin/images/frames'
os.makedirs(out_dir, exist_ok=True)

gif = Image.open(gif_path)
saved_count = 0

for i, frame in enumerate(ImageSequence.Iterator(gif)):
    if i % 3 == 0:  # extract every 3rd frame
        frame_rgb = frame.convert('RGB')
        frame_rgb.save(os.path.join(out_dir, f"frame-{saved_count}.png"), "PNG")
        saved_count += 1

print(f"Extracted {saved_count} frames to {out_dir}")
