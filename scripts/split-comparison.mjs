// One-off: split the side-by-side comparison composite into two clean files.
// The source composite has the doctor's watermark across the top-center; we trim
// that band, then cut the image into its left and right halves.
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const SRC = "antes-depois/laser-CO2/65a548d0-16f0-4d3f-a15c-7f896d7a89d9.jpeg";
const OUT_DIR = "assets/img";
mkdirSync(OUT_DIR, { recursive: true });

const img = sharp(SRC);
const { width, height } = await img.metadata();
console.log("source:", width, "x", height);

// Trim the watermark band off the top (~9%) and a sliver off the bottom.
const top = Math.round(height * 0.09);
const usableH = height - top - Math.round(height * 0.02);
const halfW = Math.floor(width / 2);

const halves = [
  { name: "home-a.jpg", left: 0 },
  { name: "home-b.jpg", left: halfW },
];

for (const h of halves) {
  await sharp(SRC)
    .extract({ left: h.left, top, width: halfW, height: usableH })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(`${OUT_DIR}/${h.name}`);
  console.log("wrote", `${OUT_DIR}/${h.name}`, halfW, "x", usableH);
}
