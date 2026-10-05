import sys
from PIL import Image

def remove_white_bg(img_path, out_path):
    img = Image.open(img_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    # Any pixel close to white will be transparent
    for item in datas:
        # Check if the pixel is white-ish (R, G, B > 230)
        if item[0] > 230 and item[1] > 230 and item[2] > 230:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(out_path, "PNG")
    print(f"Saved {out_path}")

remove_white_bg("public/garments/ao-dai-placeholder.jpg", "public/garments/ao-dai-placeholder.png")
remove_white_bg("public/garments/ba-ba-placeholder.jpg", "public/garments/ba-ba-placeholder.png")
