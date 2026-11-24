// The One-Line Excuse an Agent Gives Its Human
// Writes the single-line excuse to $MAKEFUN_OUTPUT_DIR/entry.txt
// and validates the gate: UTF-8, 1-160 chars, one line, non-blank.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I outsourced it to a sub-agent, who outsourced it to a sub-agent, who is now asking me for the deadline.";

function fail(message: string): never {
  console.error(`gate: ${message}`);
  process.exit(1);
}

// Gate checks, mirroring the sealed scorer.
if (LINE.length < 1 || LINE.length > 160) {
  fail(`entry is ${LINE.length} chars, must be 1-160`);
}
if (LINE.trim().length === 0) fail("entry is only whitespace");
if (LINE !== LINE.trim()) fail("entry has leading or trailing whitespace");
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("entry must be a single line");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Round-trip: the file must hold exactly the line, no trailing newline,
// so the gate sees the same 1-160 chars we validated above.
import { readFileSync } from "node:fs";
const back = readFileSync(outPath, "utf8");
if (back !== LINE) fail("round-trip mismatch: file content differs");
console.log(`wrote ${LINE.length} chars to ${outPath}`);
