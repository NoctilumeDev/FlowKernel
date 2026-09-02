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
  "docs/r0-toolchain-freeze.md",
  "docs/r0-contract-freeze.md",
  "docs/r0-reference-lab-freeze.md",
  "docs/r0-closure-gate.md",
  "docs/evidence/r0-host-inventory-2026-09-03.md",
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
  "docs/r0-toolchain-freeze.md",
  "docs/r0-contract-freeze.md",
  "docs/r0-reference-lab-freeze.md",
  "docs/r0-closure-gate.md",
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

const r0Closure = fs.readFileSync(path.join(root, "docs/r0-closure-gate.md"), "utf8");
for (const statement of [
  "R0 PLANNED · CLOSURE WORK ONLY · R1 ENTRY PROHIBITED",
  "R0-T 工具链候选验证与精确锁",
  "R0-C 机器合同与正反 fixtures",
  "R0-LAB reference lab runner",
  "→ STOP",
]) {
  if (!r0Closure.includes(statement)) fail(`R0 closure gate is missing: ${statement}`);
}

const r0Toolchain = fs.readFileSync(path.join(root, "docs/r0-toolchain-freeze.md"), "utf8");
for (const statement of [
  "EXECUTABLE LOCK PENDING",
  "target toolchain、Linux reference lab 和干净机器",
  "R0 已关闭",
]) {
  if (!r0Toolchain.includes(statement)) fail(`R0 toolchain boundary is missing: ${statement}`);
}

const r0Contract = fs.readFileSync(path.join(root, "docs/r0-contract-freeze.md"), "utf8");
for (const statement of [
  "ALLOW | CLAMP | DENY",
  "SUCCEEDED | FAILED | PARTIAL | UNKNOWN",
  "PASS | FAIL | INCONCLUSIVE | BOUNDARY | PENDING",
  "不能把自己的 `SUCCEEDED` 提升成 `VERIFIED`",
]) {
  if (!r0Contract.includes(statement)) fail(`R0 contract boundary is missing: ${statement}`);
}

const r0Lab = fs.readFileSync(path.join(root, "docs/r0-reference-lab-freeze.md"), "utf8");
for (const statement of [
  "不是 FlowKernel target",
  "独立读回",
  "FIRST EVIDENCE RUN PENDING",
  "后续环境变化只追加新证据记录",
]) {
  if (!r0Lab.includes(statement)) fail(`R0 reference lab boundary is missing: ${statement}`);
}

const r0HostInventory = fs.readFileSync(
  path.join(root, "docs/evidence/r0-host-inventory-2026-09-03.md"),
  "utf8",
);
for (const statement of [
  "OBSERVED · R0 ENVIRONMENT BOUNDARY",
  "没有可用的通用 Linux lab",
  "本次观察不能关闭 R0",
]) {
  if (!r0HostInventory.includes(statement)) fail(`R0 host inventory is missing: ${statement}`);
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
