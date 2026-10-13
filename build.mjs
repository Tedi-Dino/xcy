import { copyFile, mkdir } from "node:fs/promises";

const publicFiles = ["index.html", "styles.css", "script.js", "favicon.svg"];

await mkdir("dist", { recursive: true });
await Promise.all(publicFiles.map((file) => copyFile(file, `dist/${file}`)));
console.log(`Prepared ${publicFiles.length} public files in dist/`);
