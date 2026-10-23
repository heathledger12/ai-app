import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

// Minimal PNG encoder in pure Node.js
function createPng(width, height, getPixel) {
  const rowSize = width * 4;
  const rawData = Buffer.alloc(height * (1 + rowSize));

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: RGBA (6)
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = (c >>> 8) ^ table[(c ^ buf[i]) & 0xff];
  }
  return (c ^ 0xffffffff) >>> 0;
}

const table = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  table[n] = c;
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  chunk.writeUInt32BE(crc32(typeAndData), 8 + len);
  return chunk;
}

// Pixel generator for SmartAI Tamil Icon
function generateIconPixel(x, y, w, h, isMaskable = false) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = (x - cx) / (w / 2);
  const dy = (y - cy) / (h / 2);
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Background
  let r = 15, g = 23, b = 42, a = 255; // #0F172A

  // Gradient background
  const t = (x + y) / (w + h);
  r = Math.round(15 + 30 * t);
  g = Math.round(23 + 10 * t);
  b = Math.round(42 + 60 * t);

  if (!isMaskable) {
    // Corner rounded mask
    const cornerR = 0.22;
    const ax = Math.abs(dx);
    const ay = Math.abs(dy);
    if (ax > 1 - cornerR && ay > 1 - cornerR) {
      const cdx = ax - (1 - cornerR);
      const cdy = ay - (1 - cornerR);
      if (Math.sqrt(cdx * cdx + cdy * cdy) > cornerR) {
        return [0, 0, 0, 0];
      }
    }
  }

  // Safe radius for emblem (maskable needs margin)
  const emblemScale = isMaskable ? 0.65 : 0.8;

  // Inner circular glow / shield
  if (dist < 0.75 * emblemScale) {
    // Indigo / Violet glow
    const glow = (1 - dist / (0.75 * emblemScale));
    r = Math.min(255, Math.round(r + 99 * glow));
    g = Math.min(255, Math.round(g + 70 * glow));
    b = Math.min(255, Math.round(b + 220 * glow));
  }

  // Neural spark / Star shape
  const dRot = Math.abs(dx * Math.cos(0.785) - dy * Math.sin(0.785)) + Math.abs(dx * Math.sin(0.785) + dy * Math.cos(0.785));
  if (dRot < 0.45 * emblemScale) {
    // Center bright core
    r = 236; g = 72; b = 153; // Pinkish violet
    if (dist < 0.2 * emblemScale) {
      r = 56; g = 189; b = 248; // Cyan spark
    }
    if (dist < 0.08 * emblemScale) {
      r = 255; g = 255; b = 255; // White center
    }
  }

  return [r, g, b, a];
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate PWA icons
const sizes = [
  { name: 'pwa-192x192.png', size: 192, maskable: false },
  { name: 'pwa-512x512.png', size: 512, maskable: false },
  { name: 'pwa-maskable-512x512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180, maskable: false },
  { name: 'favicon.png', size: 64, maskable: false }
];

for (const { name, size, maskable } of sizes) {
  const buf = createPng(size, size, (x, y, w, h) => generateIconPixel(x, y, w, h, maskable));
  fs.writeFileSync(path.join(publicDir, name), buf);
  console.log(`Generated ${name} (${size}x${size})`);
}
