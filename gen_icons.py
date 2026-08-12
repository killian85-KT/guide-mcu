from PIL import Image, ImageDraw, ImageFont
import math

VOID = (7, 7, 12, 255)
DEEP = (13, 13, 22, 255)
MARVEL = (237, 29, 36, 255)
GOLD = (201, 162, 39, 255)
THANOS = (123, 79, 168, 255)
INK = (238, 240, 246, 255)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(4))


def draw_icon(size, padding_ratio=0.0, filename="icon.png"):
    img = Image.new("RGBA", (size, size), VOID)
    draw = ImageDraw.Draw(img)

    # Radial-ish gradient background using concentric squares approximation
    cx, cy = size / 2, size / 2
    max_r = size * 0.75
    steps = 60
    for i in range(steps, 0, -1):
        t = i / steps
        r = max_r * t
        # blend from deep void center-out to darker edge, with a warm glow near center
        col = lerp(DEEP, VOID, 1 - t)
        bbox = [cx - r, cy - r, cx + r, cy + r]
        draw.ellipse(bbox, fill=col)

    # safe content area (for maskable icons, keep within ~80% center circle)
    content = size * (1 - padding_ratio * 2)
    off = size * padding_ratio

    # Draw a stylized shield / "D" monogram for Doomsday guide
    m = off
    w = content

    # Outer ring (gold)
    ring_r = w * 0.40
    ring_w = max(2, int(w * 0.045))
    bbox = [cx - ring_r, cy - ring_r, cx + ring_r, cy + ring_r]
    draw.ellipse(bbox, outline=GOLD, width=ring_w)

    # Inner glow circle (marvel red -> thanos purple gradient via multiple ellipses)
    inner_r = w * 0.30
    steps2 = 24
    for i in range(steps2, 0, -1):
        t = i / steps2
        r = inner_r * t
        col = lerp(MARVEL, THANOS, 1 - t)
        col = (col[0], col[1], col[2], int(255 * (0.9 if t > 0.15 else 1)))
        bbox = [cx - r, cy - r, cx + r, cy + r]
        draw.ellipse(bbox, fill=col)

    # Letter mark "D" (Doomsday) in Anton-ish bold — fallback to default bold font
    try:
        font = ImageFont.truetype(
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            int(w * 0.46),
        )
    except Exception:
        font = ImageFont.load_default()

    text = "D"
    bbox_txt = draw.textbbox((0, 0), text, font=font)
    tw = bbox_txt[2] - bbox_txt[0]
    th = bbox_txt[3] - bbox_txt[1]
    tx = cx - tw / 2 - bbox_txt[0]
    ty = cy - th / 2 - bbox_txt[1]
    # subtle shadow
    draw.text((tx + 2, ty + 3), text, font=font, fill=(0, 0, 0, 140))
    draw.text((tx, ty), text, font=font, fill=INK)

    img.save(filename, "PNG")
    print("saved", filename, size)


if __name__ == "__main__":
    draw_icon(192, 0.0, "icons/icon-192.png")
    draw_icon(512, 0.0, "icons/icon-512.png")
    # maskable needs extra safe padding so the OS mask doesn't crop the logo
    draw_icon(512, 0.12, "icons/icon-512-maskable.png")
    draw_icon(180, 0.0, "icons/apple-touch-icon.png")
