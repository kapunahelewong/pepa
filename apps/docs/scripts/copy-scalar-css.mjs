import { cpSync, existsSync } from "fs";
import { resolve } from "path";

// Resolves a file inside @scalar/api-reference regardless of how pnpm
// lays out node_modules (hoisted at workspace root vs. local).
function findScalarFile(relPath) {
  const candidates = [
    resolve("../../node_modules/@scalar/api-reference", relPath),
    resolve("node_modules/@scalar/api-reference", relPath),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  throw new Error(
    `Could not find @scalar/api-reference/${relPath} — is the package installed?`
  );
}

// CSS — served as a static file so Turbopack never processes it through PostCSS
const cssSrc = findScalarFile("dist/style.css");
cpSync(cssSrc, resolve("public/scalar.css"));
console.log(`scalar css → public/scalar.css`);
