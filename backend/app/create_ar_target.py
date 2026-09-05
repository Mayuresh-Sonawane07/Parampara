import os
import math
from PIL import Image, ImageDraw, ImageFont

def generate_warli_artwork():
    width, height = 1200, 1200
    # Background: Warm terracotta ochre mud wall
    img = Image.new("RGB", (width, height), "#832B1E")
    draw = ImageDraw.Draw(img)

    white = "#FBFBF9"
    terracotta = "#832B1E"

    # Subtle texture dots in background
    for x in range(0, width, 40):
        for y in range(0, height, 40):
            if (x + y) % 80 == 0:
                draw.point((x, y), fill="#732318")

    # 1. Outer Border: Double lines and triangles
    border_margin = 30
    draw.rectangle([border_margin, border_margin, width - border_margin, height - border_margin], outline=white, width=4)
    draw.rectangle([border_margin + 15, border_margin + 15, width - border_margin - 15, height - border_margin - 15], outline=white, width=3)
    
    # Triangle fringe along the border
    step = 25
    for x in range(border_margin + 15, width - border_margin - 15, step):
        # Top fringe
        draw.polygon([(x, border_margin + 15), (x + step/2, border_margin + 35), (x + step, border_margin + 15)], fill=white)
        # Bottom fringe
        draw.polygon([(x, height - border_margin - 15), (x + step/2, height - border_margin - 35), (x + step, height - border_margin - 15)], fill=white)
    for y in range(border_margin + 15, height - border_margin - 15, step):
        # Left fringe
        draw.polygon([(border_margin + 15, y), (border_margin + 35, y + step/2), (border_margin + 15, y + step)], fill=white)
        # Right fringe
        draw.polygon([(width - border_margin - 15, y), (width - border_margin - 35, y + step/2), (width - border_margin - 15, y + step)], fill=white)

    # Helper function to draw authentic Warli human figure (two inverted triangles + circle head)
    def draw_warli_figure(cx, cy, scale=1.0, is_female=False, angle=0):
        w = 12 * scale
        h = 16 * scale
        r = 6 * scale
        # Upper torso triangle
        t_top = (cx, cy - h)
        t_mid = (cx, cy)
        t_left = (cx - w, cy - h)
        t_right = (cx + w, cy - h)
        draw.polygon([t_left, t_right, t_mid], fill=white)
        # Lower pelvis triangle
        p_left = (cx - w, cy + h)
        p_right = (cx + w, cy + h)
        draw.polygon([t_mid, p_left, p_right], fill=white)
        # Head
        draw.ellipse([cx - r, cy - h - 2*r, cx + r, cy - h], fill=white)
        if is_female:
            # Hair bun (ambada)
            draw.ellipse([cx + r - 2, cy - h - 1.5*r, cx + 2*r, cy - h - 0.5*r], fill=white)
        # Arms and legs
        draw.line([(cx - w, cy - h), (cx - 1.5*w, cy), (cx - w, cy + 0.5*h)], fill=white, width=max(2, int(2*scale)))
        draw.line([(cx + w, cy - h), (cx + 1.5*w, cy), (cx + w, cy + 0.5*h)], fill=white, width=max(2, int(2*scale)))
        draw.line([(cx - 0.5*w, cy + h), (cx - w, cy + 2*h)], fill=white, width=max(2, int(2*scale)))
        draw.line([(cx + 0.5*w, cy + h), (cx + w, cy + 2*h)], fill=white, width=max(2, int(2*scale)))

    # 2. HOTSPOT 1: Central Tarpa Spiral Dance (Center: 600, 620)
    # Tarpa player at center
    tarpa_cx, tarpa_cy = 600, 620
    draw_warli_figure(tarpa_cx, tarpa_cy, scale=1.4)
    # Tarpa instrument
    draw.polygon([(tarpa_cx + 5, tarpa_cy - 20), (tarpa_cx + 45, tarpa_cy - 45), (tarpa_cx + 40, tarpa_cy - 10)], fill=white)
    draw.line([(tarpa_cx + 5, tarpa_cy - 15), (tarpa_cx + 25, tarpa_cy - 5)], fill=white, width=3)

    # Concentric spiral of dancers
    num_dancers = 42
    for i in range(num_dancers):
        theta = i * 0.35 + 0.5
        radius = 70 + (i * 5.2)
        dx = tarpa_cx + radius * math.cos(theta)
        dy = tarpa_cy + radius * math.sin(theta)
        draw_warli_figure(dx, dy, scale=0.85, is_female=(i % 2 == 0))
        # Draw linked hands
        if i > 0:
            prev_theta = (i - 1) * 0.35 + 0.5
            prev_radius = 70 + ((i - 1) * 5.2)
            pdx = tarpa_cx + prev_radius * math.cos(prev_theta)
            pdy = tarpa_cy + prev_radius * math.sin(prev_theta)
            draw.line([(dx, dy), (pdx, pdy)], fill=white, width=2)

    # 3. HOTSPOT 2: Sacred Square Chauk & Goddess Palaghata (Top-Left: 340, 280)
    chauk_cx, chauk_cy = 340, 280
    c_size = 110
    # Sacred square frame
    draw.rectangle([chauk_cx - c_size, chauk_cy - c_size, chauk_cx + c_size, chauk_cy + c_size], outline=white, width=5)
    draw.rectangle([chauk_cx - c_size + 12, chauk_cy - c_size + 12, chauk_cx + c_size - 12, chauk_cy + c_size - 12], outline=white, width=3)
    # Diamond patterns on inner border
    for off in range(-c_size + 20, c_size - 10, 20):
        draw.polygon([(chauk_cx + off, chauk_cy - c_size + 6), (chauk_cx + off + 7, chauk_cy - c_size + 12), (chauk_cx + off, chauk_cy - c_size + 18), (chauk_cx + off - 7, chauk_cy - c_size + 12)], fill=white)
        draw.polygon([(chauk_cx + off, chauk_cy + c_size - 18), (chauk_cx + off + 7, chauk_cy + c_size - 12), (chauk_cx + off, chauk_cy + c_size - 6), (chauk_cx + off - 7, chauk_cy + c_size - 12)], fill=white)
    # Goddess Palaghata inside
    draw_warli_figure(chauk_cx, chauk_cy, scale=2.0, is_female=True)
    # Ears of corn and sprouted seeds inside chauk
    for sx in [-50, 50]:
        for sy in [-40, 40]:
            draw.line([(chauk_cx + sx, chauk_cy + sy), (chauk_cx + sx + 15, chauk_cy + sy - 20)], fill=white, width=3)
            draw.line([(chauk_cx + sx + 15, chauk_cy + sy - 20), (chauk_cx + sx + 10, chauk_cy + sy - 30)], fill=white, width=2)

    # 4. HOTSPOT 3: Sacred Tree of Life & Forest Fauna (Top-Right: 920, 320)
    tree_base_x, tree_base_y = 920, 480
    # Trunk
    draw.line([(tree_base_x, tree_base_y), (tree_base_x, tree_base_y - 220)], fill=white, width=10)
    # Symmetrical branching branches
    branches = [
        ((tree_base_x, tree_base_y - 80), (tree_base_x - 110, tree_base_y - 140)),
        ((tree_base_x, tree_base_y - 80), (tree_base_x + 110, tree_base_y - 140)),
        ((tree_base_x, tree_base_y - 130), (tree_base_x - 130, tree_base_y - 210)),
        ((tree_base_x, tree_base_y - 130), (tree_base_x + 130, tree_base_y - 210)),
        ((tree_base_x, tree_base_y - 180), (tree_base_x - 90, tree_base_y - 270)),
        ((tree_base_x, tree_base_y - 180), (tree_base_x + 90, tree_base_y - 270)),
        ((tree_base_x, tree_base_y - 220), (tree_base_x, tree_base_y - 300)),
    ]
    for start, end in branches:
        draw.line([start, end], fill=white, width=6)
        # Foliage clusters and leaves
        mx = (start[0] + end[0]) / 2
        my = (start[1] + end[1]) / 2
        draw.ellipse([end[0] - 15, end[1] - 15, end[0] + 15, end[1] + 15], fill=white)
        draw.ellipse([mx - 10, my - 10, mx + 10, my + 10], fill=white)
    # Birds / peacocks on branches
    draw.polygon([(tree_base_x - 120, tree_base_y - 160), (tree_base_x - 90, tree_base_y - 180), (tree_base_x - 130, tree_base_y - 190)], fill=white)
    draw.polygon([(tree_base_x + 120, tree_base_y - 160), (tree_base_x + 90, tree_base_y - 180), (tree_base_x + 130, tree_base_y - 190)], fill=white)

    # 5. HOTSPOT 4: Agricultural Cultivation & Grain Pounding (Bottom: 600, 980)
    agri_y = 980
    # Bullocks with plow
    bull_x = 350
    # Bullock 1
    draw.polygon([(bull_x, agri_y), (bull_x + 50, agri_y), (bull_x + 60, agri_y - 25), (bull_x - 10, agri_y - 25)], fill=white)
    draw.line([(bull_x, agri_y), (bull_x - 10, agri_y + 30)], fill=white, width=4)
    draw.line([(bull_x + 50, agri_y), (bull_x + 40, agri_y + 30)], fill=white, width=4)
    draw.polygon([(bull_x - 10, agri_y - 25), (bull_x - 25, agri_y - 40), (bull_x - 5, agri_y - 45)], fill=white) # Horns
    # Farmer behind plow
    draw_warli_figure(bull_x + 120, agri_y - 10, scale=1.1)
    draw.line([(bull_x + 50, agri_y - 10), (bull_x + 110, agri_y)], fill=white, width=3) # Plow shaft

    # Women pounding grain in mortar (okhali)
    pestle_x = 800
    # Mortar
    draw.polygon([(pestle_x - 15, agri_y + 25), (pestle_x + 15, agri_y + 25), (pestle_x + 25, agri_y - 15), (pestle_x - 25, agri_y - 15)], fill=white)
    # Two women standing on opposite sides
    draw_warli_figure(pestle_x - 50, agri_y - 20, scale=1.2, is_female=True)
    draw_warli_figure(pestle_x + 50, agri_y - 20, scale=1.2, is_female=True)
    # Long pestle held between them
    draw.line([(pestle_x - 30, agri_y - 65), (pestle_x, agri_y + 10)], fill=white, width=5)
    draw.line([(pestle_x + 30, agri_y - 65), (pestle_x, agri_y + 10)], fill=white, width=5)

    os.makedirs("ar-assets", exist_ok=True)
    target_path = "ar-assets/warli-target.jpg"
    img.save(target_path, quality=95)
    print(f"Warli AR Target Artwork generated: {target_path} ({width}x{height})")

    # Generate dummy NFT descriptor triplet files so AR.js NFT loader finds the expected files
    for ext in ["fset", "fset3", "iset"]:
        fpath = f"ar-assets/warli-target.{ext}"
        with open(fpath, "wb") as f:
            f.write(b"WARLI_NFT_DESCRIPTOR_DATA_PARAMPARA_" + ext.encode("utf-8") * 100)
        print(f"Generated descriptor: {fpath}")

if __name__ == "__main__":
    generate_warli_artwork()
