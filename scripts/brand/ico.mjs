// Packs PNG files into a .ico (PNG-in-ICO, supported by every current browser).
// usage: node ico.mjs out.ico a.png b.png ...
import { readFileSync, writeFileSync } from "node:fs";
const [out, ...files] = process.argv.slice(2);
const pngs = files.map((f) => readFileSync(f));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(pngs.length, 4);
let offset = 6 + 16 * pngs.length;
const entries = pngs.map((png) => {
  const w = png.readUInt32BE(16), h = png.readUInt32BE(20); // from the IHDR chunk
  const e = Buffer.alloc(16);
  e.writeUInt8(w >= 256 ? 0 : w, 0);
  e.writeUInt8(h >= 256 ? 0 : h, 1);
  e.writeUInt16LE(1, 4); // colour planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(png.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += png.length;
  return e;
});
writeFileSync(out, Buffer.concat([header, ...entries, ...pngs]));
