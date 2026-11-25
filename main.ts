import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Dad Joke Showdown: one dad joke, punchline at the end.
const LINE =
  "I named my dog Stay. Now when I call him, he stays.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const target = join(outDir, "entry.txt");
writeFileSync(target, LINE, "utf8");
// Verify the output by reading it back: it must be exactly the line we
// intended, and within the competition's 1-200 character limit.
const written = readFileSync(target, "utf8");
if (written !== LINE) {
  throw new Error(`output mismatch: entry.txt differs from expected line`);
}
if (written.length < 1 || written.length > 200) {
  throw new Error(`output length ${written.length} outside 1-200 chars`);
}
// Byte-level verification: re-read as a raw Buffer and compare bytes
// against the UTF-8 encoding of the expected line, so no silent
// encoding or newline mutation can slip past the string check above.
const writtenBytes = readFileSync(target);
const expectedBytes = Buffer.from(LINE, "utf8");
if (!writtenBytes.equals(expectedBytes)) {
  throw new Error(
    `output bytes mismatch: entry.txt bytes differ from expected UTF-8 bytes (${writtenBytes.length} vs ${expectedBytes.length})`,
  );
}
console.log(`wrote ${target} (${LINE.length} chars)`);
