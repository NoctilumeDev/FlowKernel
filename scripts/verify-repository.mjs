import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const requiredFiles = [
  "README.md",
  "LICENSE",
  "CODE_OF_CONDUCT.md",
  "CONTRIBUTING.md",
  "SECURITY.md",
  "docs/conceptual-origin.md",
  "docs/execution-os-constitution.md",
  "docs/c-first-kernel-contract.md",
  "docs/vision.md",
  "docs/research-questions.md",
  "docs/architecture-hypotheses.md",
  "docs/experiment-roadmap.md",
  "docs/evidence-policy.md",
  "docs/prior-art.md",
  "docs/literature-review-protocol.md",
  "docs/references.md",
  "docs/prior-art-matrix.md",
  "docs/research-evidence-traceability.md",
  "docs/r0-literature-gate.md",
  "docs/threat-model.md",
];

function fail(message) {
  failures.push(message);
}

function listFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === ".git") return [];
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(absolute) : [absolute];
  });
}

for (const relative of requiredFiles) {
  if (!fs.existsSync(path.join(root, relative))) fail(`Missing required file: ${relative}`);
}

const files = listFiles(root);
const textExtensions = new Set(["", ".md", ".yml", ".yaml", ".json", ".mjs"]);
const textFiles = files.filter((file) => textExtensions.has(path.extname(file).toLowerCase()));
const markdownFiles = textFiles.filter((file) => path.extname(file).toLowerCase() === ".md");
const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g;
const sensitivePatterns = [
  { name: "Windows user path", pattern: /[A-Za-z]:\\Users\\/ },
  { name: "Unix home path", pattern: /\/(?:Users|home)\/[^/\s]+\// },
  { name: "private key", pattern: /BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY/ },
  { name: "GitHub token", pattern: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/ },
];

for (const file of textFiles) {
  const relative = path.relative(root, file).replaceAll(path.sep, "/");
  const content = fs.readFileSync(file, "utf8");
  if (!content.endsWith("\n")) fail(`${relative}: missing final newline`);
  content.split(/\r?\n/).forEach((line, index) => {
    if (/[ \t]+$/.test(line)) fail(`${relative}:${index + 1}: trailing whitespace`);
  });
  for (const { name, pattern } of sensitivePatterns) {
    if (pattern.test(content)) fail(`${relative}: contains ${name}`);
  }
}

for (const file of markdownFiles) {
  const relative = path.relative(root, file).replaceAll(path.sep, "/");
  const content = fs.readFileSync(file, "utf8");
  for (const match of content.matchAll(linkPattern)) {
    const target = match[1].trim();
    if (/^(?:https?:\/\/|mailto:|#)/.test(target)) continue;
    const pathname = decodeURIComponent(target.split("#", 1)[0]);
    if (!pathname) continue;
    if (!fs.existsSync(path.resolve(path.dirname(file), pathname))) {
      fail(`${relative}: broken relative link ${target}`);
    }
  }
}

const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
if (!readme.includes("**Evidence state: Planned. Implementation has not started.**")) {
  fail("README.md: canonical planning state is missing");
}
for (const link of [
  "docs/conceptual-origin.md",
  "docs/execution-os-constitution.md",
  "docs/c-first-kernel-contract.md",
  "docs/prior-art.md",
  "docs/literature-review-protocol.md",
  "docs/references.md",
  "docs/prior-art-matrix.md",
  "docs/research-evidence-traceability.md",
  "docs/r0-literature-gate.md",
  "docs/threat-model.md",
]) {
  if (!readme.includes(link)) fail(`README.md: navigation is missing ${link}`);
}

const literatureGate = fs.readFileSync(path.join(root, "docs/r0-literature-gate.md"), "utf8");
for (const statement of [
  "LITERATURE BASELINE CLOSED · R0 REMAINS PLANNED",
  "35 个主要来源",
  "Agent Harness、Linux reference lab 与 FlowKernel target",
]) {
  if (!literatureGate.includes(statement)) fail(`R0 literature gate is missing: ${statement}`);
}

const literatureMatrix = fs.readFileSync(path.join(root, "docs/prior-art-matrix.md"), "utf8");
for (const field of [
  "问题",
  "状态",
  "动作",
  "目标",
  "策略更新时机",
  "最终 authority",
  "验证者",
  "fallback",
  "环境",
  "证据强度",
  "公开限制",
]) {
  if (!literatureMatrix.includes(field)) fail(`Prior-art matrix is missing field: ${field}`);
}

const researchTraceability = fs.readFileSync(
  path.join(root, "docs/research-evidence-traceability.md"),
  "utf8",
);
for (let index = 1; index <= 11; index += 1) {
  if (!researchTraceability.includes(`RQ${index}`)) {
    fail(`Research evidence traceability is missing RQ${index}`);
  }
}

const references = fs.readFileSync(path.join(root, "docs/references.md"), "utf8");
for (const statement of ["HAR-05", "HAR-08", "AGOS-01", "LIN-01", "PREPRINT"]) {
  if (!references.includes(statement)) fail(`Primary references are missing: ${statement}`);
}

const conduct = fs.readFileSync(path.join(root, "CODE_OF_CONDUCT.md"), "utf8");
if (!conduct.includes("FlowKernel")) fail("CODE_OF_CONDUCT.md: repository name is missing");
if (conduct.includes("PlainJournalPro")) fail("CODE_OF_CONDUCT.md: copied repository name remains");

if (failures.length > 0) {
  console.error(`Repository verification failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Repository verification passed: ${textFiles.length} text files, ${markdownFiles.length} Markdown files.`);
