// Removes location (GPS) and all other hidden metadata from photos before they go online.
// Phone photos often record exactly where they were taken, and files in public/ are served as-is.
//
// Usage:  node scripts/strip-photo-location.mjs public/images/life
//         node scripts/strip-photo-location.mjs path/to/photo.jpg
//
// Each image is rotated the right way up, re-saved without metadata, and overwritten in place.
import { readdir, stat, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import sharp from "sharp";

const exts = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

async function files(target) {
  const s = await stat(target);
  if (s.isFile()) return [target];
  const names = await readdir(target);
  return names.filter((n) => exts.has(extname(n).toLowerCase())).map((n) => join(target, n));
}

const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.error(
    "Give a folder or image path, e.g. node scripts/strip-photo-location.mjs public/images/life",
  );
  process.exit(1);
}

let count = 0;
for (const target of targets) {
  for (const file of await files(target)) {
    const before = await sharp(file).metadata();
    const ext = extname(file).toLowerCase();
    let img = sharp(file).rotate(); // apply the camera's orientation, then drop the tag
    if (ext === ".jpg" || ext === ".jpeg") img = img.jpeg({ quality: 88, mozjpeg: true });
    else if (ext === ".png") img = img.png();
    else if (ext === ".webp") img = img.webp({ quality: 88 });
    else img = img.avif({ quality: 60 });
    const out = await img.toBuffer(); // sharp leaves metadata out unless asked to keep it
    await writeFile(file, out);
    const had = before.exif ? "had EXIF" : "no EXIF";
    console.log(`cleaned ${file} (${had})`);
    count++;
  }
}
console.log(`${count} image(s) cleaned.`);
