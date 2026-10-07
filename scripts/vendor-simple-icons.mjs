import * as icons from "simple-icons";
import { writeFile, copyFile } from "node:fs/promises";
const names = [
  "siApachenetbeanside",
  "siCloudinary",
  "siHuggingface",
  "siMediapipe",
  "siRazorpay",
  "siTensorflow",
  "siYolo",
];
const credits = [];
for (const name of names) {
  const icon = icons[name];
  await writeFile(
    `public/logos/${icon.slug}.svg`,
    icon.svg.replace("<svg ", `<svg fill="#${icon.hex}" `),
  );
  credits.push({
    title: icon.title,
    slug: icon.slug,
    source: icon.source,
    license: icon.license ?? "See upstream source and Simple Icons disclaimer",
    hex: icon.hex,
  });
}
await copyFile(
  "node_modules/simple-icons/LICENSE.md",
  "public/logos/SIMPLE-ICONS-LICENSE.md",
);
await writeFile(
  "public/logos/simple-icons-sources.json",
  JSON.stringify(credits, null, 2) + "\n",
);
