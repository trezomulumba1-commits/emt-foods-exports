from PIL import Image
from collections import Counter
from pathlib import Path

paths = ['public/floating_seeds.png','public/dried_goods.png','public/flowing_fabric.png']
for path in paths:
    img = Image.open(path).convert('RGBA')
    width, height = img.size
    edge_pixels = []
    for x in range(width):
        edge_pixels.append(img.getpixel((x, 0)))
        edge_pixels.append(img.getpixel((x, height - 1)))
    for y in range(1, height - 1):
        edge_pixels.append(img.getpixel((0, y)))
        edge_pixels.append(img.getpixel((width - 1, y)))

    edge_colors = Counter(edge_pixels)
    bg_color = edge_colors.most_common(1)[0][0]
    print(path, 'background guess', bg_color)

    data = img.getdata()
    new_data = []
    for pixel in data:
        r, g, b, a = pixel
        if a == 0:
            new_data.append((r, g, b, 0))
            continue
        if abs(r - bg_color[0]) <= 18 and abs(g - bg_color[1]) <= 18 and abs(b - bg_color[2]) <= 18:
            new_data.append((r, g, b, 0))
        else:
            new_data.append((r, g, b, a))
    img.putdata(new_data)
    img.save(path)
    print('saved', path)
