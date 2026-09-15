import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

out_dir = r"c:\Users\moume\Documents\report\paper\figures"
os.makedirs(out_dir, exist_ok=True)

fig = plt.figure(figsize=(10, 4.5), dpi=300)
ax = fig.add_subplot(111)
ax.set_xlim(0, 10)
ax.set_ylim(0, 4.5)
ax.axis('off')

# Title banner
ax.text(5.0, 4.15, "Real-Time Structural Dynamics Digital Twin via IGA-POD", 
        fontsize=14, fontweight='bold', ha='center', color='#1a365d', family='sans-serif')

# Box 1: CAD & IGA Discretization
rect1 = patches.FancyBboxPatch((0.4, 0.6), 2.6, 3.1, boxstyle="round,pad=0.15", 
                                ec="#2b6cb0", fc="#ebf8ff", lw=2)
ax.add_patch(rect1)
ax.text(1.7, 3.3, "1. CAD & IGA Discretization", fontsize=10, fontweight='bold', ha='center', color='#2b6cb0')
ax.text(1.7, 2.7, "• Exact NURBS CAD Geometry\n• $C^{p-1}$ Continuity & High Fidelity\n• Full Order Model (FOM)\n  $N = 12,450$ DOFs", 
        fontsize=8.5, ha='center', va='top', color='#2d3748', linespacing=1.6)

# Arrow 1 -> 2
ax.annotate('', xy=(3.4, 2.15), xytext=(3.1, 2.15),
            arrowprops=dict(arrowstyle="->", color="#4a5568", lw=2.5))
ax.text(3.25, 2.35, "Snapshots", fontsize=7.5, fontweight='bold', ha='center', color='#4a5568')

# Box 2: Offline POD Reduction
rect2 = patches.FancyBboxPatch((3.5, 0.6), 2.6, 3.1, boxstyle="round,pad=0.15", 
                                ec="#319795", fc="#e6fffa", lw=2)
ax.add_patch(rect2)
ax.text(4.8, 3.3, "2. Offline POD Reduction", fontsize=10, fontweight='bold', ha='center', color='#319795')
ax.text(4.8, 2.7, "• Snapshot Matrix SVD\n• Optimal Mode Selection ($r = 12$)\n• Energy Ratio $\gamma > 99.999\%$\n• Reduced Operators $\mathbf{M}_r, \mathbf{K}_r, \mathbf{C}_r$", 
        fontsize=8.5, ha='center', va='top', color='#2d3748', linespacing=1.6)

# Arrow 2 -> 3
ax.annotate('', xy=(6.5, 2.15), xytext=(6.2, 2.15),
            arrowprops=dict(arrowstyle="->", color="#4a5568", lw=2.5))
ax.text(6.35, 2.35, "$\mathbf{V}_r, \mathbf{M}_r$", fontsize=7.5, fontweight='bold', ha='center', color='#4a5568')

# Box 3: Real-Time 3D Digital Twin
rect3 = patches.FancyBboxPatch((6.6, 0.6), 3.0, 3.1, boxstyle="round,pad=0.15", 
                                ec="#2f855a", fc="#f0fff4", lw=2)
ax.add_patch(rect3)
ax.text(8.1, 3.3, "3. Real-Time WebGL Twin", fontsize=10, fontweight='bold', ha='center', color='#2f855a')
ax.text(8.1, 2.7, "• Sub-millisecond step solver\n• 386× Speedup over FOM\n• WebGL 3D Interactive Render\n• Frame Rate > 24 FPS", 
        fontsize=8.5, ha='center', va='top', color='#2d3748', linespacing=1.6)

# Bottom highlight banner
rect_bottom = patches.FancyBboxPatch((0.4, 0.1), 9.2, 0.35, boxstyle="round,pad=0.05",
                                     ec="#cbd5e0", fc="#edf2f7", lw=1)
ax.add_patch(rect_bottom)
ax.text(5.0, 0.23, "Key Achievement: Sub-millisecond transient elastodynamics at 24+ FPS with relative error < 10⁻⁴",
        fontsize=8.5, fontweight='bold', ha='center', va='center', color='#1a202c')

fig.tight_layout()
fig.savefig(os.path.join(out_dir, "graphical_abstract.pdf"))
fig.savefig(os.path.join(out_dir, "graphical_abstract.png"))
plt.close(fig)

print("Generated graphical_abstract.pdf and graphical_abstract.png in", out_dir)
