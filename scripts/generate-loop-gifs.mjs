import {writeFileSync} from 'node:fs';
import {join} from 'node:path';

const width = 320;
const height = 220;
const frames = 36;
const delay = 7;

const palette = [
  [7, 31, 62], [10, 34, 53], [12, 41, 61], [14, 50, 76],
  [18, 62, 94], [27, 76, 113], [40, 91, 132], [63, 112, 151],
  [91, 137, 176], [126, 164, 204], [172, 196, 226], [232, 241, 255],
  [21, 49, 74], [41, 68, 97], [74, 91, 120], [118, 123, 148],
];

while (palette.length < 256) palette.push([0, 0, 0]);

function pushWord(bytes, value) {
  bytes.push(value & 255, (value >> 8) & 255);
}

function pushString(bytes, value) {
  for (const char of value) bytes.push(char.charCodeAt(0));
}

function lzwEncode(indices) {
  const minCodeSize = 8;
  const clear = 256;
  const end = 257;
  const out = [minCodeSize];
  const data = [];
  let current = 0;
  let bitCount = 0;
  let emittedSinceClear = 0;

  const writeCode = (code) => {
    current |= code << bitCount;
    bitCount += 9;
    while (bitCount >= 8) {
      data.push(current & 255);
      current >>= 8;
      bitCount -= 8;
    }
  };

  writeCode(clear);
  for (const index of indices) {
    if (emittedSinceClear > 220) {
      writeCode(clear);
      emittedSinceClear = 0;
    }
    writeCode(index);
    emittedSinceClear += 1;
  }
  writeCode(end);
  if (bitCount > 0) data.push(current & 255);

  for (let i = 0; i < data.length; i += 255) {
    const block = data.slice(i, i + 255);
    out.push(block.length, ...block);
  }
  out.push(0);
  return out;
}

function makeGif(name, drawFrame) {
  const bytes = [];
  pushString(bytes, 'GIF89a');
  pushWord(bytes, width);
  pushWord(bytes, height);
  bytes.push(0xf7, 0, 0);
  for (const color of palette) bytes.push(...color);

  bytes.push(0x21, 0xff, 11);
  pushString(bytes, 'NETSCAPE2.0');
  bytes.push(3, 1);
  pushWord(bytes, 0);
  bytes.push(0);

  for (let frame = 0; frame < frames; frame += 1) {
    bytes.push(0x21, 0xf9, 4, 0x04);
    pushWord(bytes, delay);
    bytes.push(0, 0);
    bytes.push(0x2c);
    pushWord(bytes, 0);
    pushWord(bytes, 0);
    pushWord(bytes, width);
    pushWord(bytes, height);
    bytes.push(0);
    bytes.push(...lzwEncode(drawFrame(frame)));
  }

  bytes.push(0x3b);
  writeFileSync(join('public', name), Buffer.from(bytes));
}

function base(bg = 0) {
  const pixels = new Uint8Array(width * height);
  pixels.fill(bg);
  return pixels;
}

function rect(pixels, x, y, w, h, color) {
  const x1 = Math.max(0, Math.floor(x));
  const y1 = Math.max(0, Math.floor(y));
  const x2 = Math.min(width, Math.ceil(x + w));
  const y2 = Math.min(height, Math.ceil(y + h));
  for (let yy = y1; yy < y2; yy += 1) {
    for (let xx = x1; xx < x2; xx += 1) pixels[yy * width + xx] = color;
  }
}

function ellipse(pixels, cx, cy, rx, ry, color) {
  const x1 = Math.max(0, Math.floor(cx - rx));
  const y1 = Math.max(0, Math.floor(cy - ry));
  const x2 = Math.min(width, Math.ceil(cx + rx));
  const y2 = Math.min(height, Math.ceil(cy + ry));
  for (let y = y1; y < y2; y += 1) {
    for (let x = x1; x < x2; x += 1) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      if (dx * dx + dy * dy <= 1) pixels[y * width + x] = color;
    }
  }
}

makeGif('seeds-loop.gif', (frame) => {
  const pixels = base(0);
  for (let y = 0; y < height; y += 1) rect(pixels, 0, y, width, 1, y > height * 0.56 ? 2 : 1);
  for (let i = 0; i < 34; i += 1) {
    const x = (i * 41 + frame * 3) % (width + 70) - 35;
    const y = (i * 29 + frame * 2) % (height + 60) - 30;
    ellipse(pixels, x, y, 5 + (i % 4), 2 + (i % 3), 8 + (i % 4));
  }
  return pixels;
});

makeGif('dried-foods-loop.gif', (frame) => {
  const pixels = base(1);
  for (let i = 0; i < 22; i += 1) {
    const x = (i * 53) % width;
    const y = (i * 37 + frame * 7) % (height + 50) - 25;
    ellipse(pixels, x, y, 16 + (i % 4) * 3, 7 + (i % 3), 7 + (i % 5));
    rect(pixels, x - 14, y - 1, 28, 2, 11);
  }
  return pixels;
});

makeGif('fabrics-loop.gif', (frame) => {
  const pixels = base(0);
  for (let x = -80; x < width + 80; x += 34) {
    const color = 4 + Math.abs(Math.floor(x / 34)) % 8;
    for (let y = 0; y < height; y += 1) {
      const wave = Math.sin((y + frame * 6) / 22) * 16;
      rect(pixels, x + wave, y, 22, 1, color);
      rect(pixels, x + wave + 9, y, 3, 1, 11);
    }
  }
  return pixels;
});

