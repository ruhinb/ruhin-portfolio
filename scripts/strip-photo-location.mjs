// Removes location (GPS) and other hidden camera metadata from photos before they go online.
// Phone photos often record exactly where they were taken, and files in public/ are served as-is.
//
// Usage:  npm run clean-photos public/images/life
//         npm run clean-photos path/to/photo.jpg
//
// Files with no hidden metadata are left exactly as they are, so they lose no quality.
// Files that have some are rotated the right way up and re-saved at high quality,
// keeping their colour profile (iPhone photos use Display P3) but nothing else.
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
  console.error("Give a folder or image path, e.g. npm run clean-photos public/images/life");
  process.exit(1);
}

let cleaned = 0;
let untouched = 0;
for (const target of targets) {
  for (const file of await files(target)) {
    const meta = await sharp(file).metadata();
    const hidden = meta.exif || meta.xmp || meta.iptc;
    if (!hidden && (meta.orientation ?? 1) === 1) {
      console.log(`ok       ${file} (no hidden metadata, left untouched)`);
      untouched++;
      continue;
    }
    const ext = extname(file).toLowerCase();
    let img = sharp(file).rotate().keepIccProfile();
    if (ext === ".jpg" || ext === ".jpeg")
      img = img.jpeg({ quality: 95, mozjpeg: true, chromaSubsampling: "4:4:4" });
    else if (ext === ".png") img = img.png();
    else if (ext === ".webp") img = img.webp({ quality: 95 });
    else img = img.avif({ quality: 80 });
    await writeFile(file, await img.toBuffer());
    console.log(`cleaned  ${file}`);
    cleaned++;
  }
}
console.log(`${cleaned} cleaned, ${untouched} already clean.`);
