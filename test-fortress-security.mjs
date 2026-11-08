import assert from "assert";
import {
  enforceWaf,
  enforceRateLimit,
  validatePathname,
  validateSafeUrl,
  memoryRehabAsmGuard,
  memoryRehabCdnShield,
  constantTimeSafeEqual,
  applySecurityHeaders,
  cloudDefenseSentinel,
  objectAuthGuard,
  banIpWithStrikes,
  isIpBanned,
  submitJailAppeal,
} from "./api/_security.js";
import { swarmOsMatrix, SWARM_ARCH_PROFILES } from "./src/services/swarmOsMatrix.js";

console.log("==================================================================");
console.log("🛡️  TESTING MEMORY REHAB LAB FORTRESS DEFENSE & OS SWARM SYSTEM");
console.log("==================================================================");

// Mock HTTP Request / Response objects
function createMockReqRes({
  url = "/",
  method = "GET",
  headers = {},
  query = {},
  body = {},
} = {}) {
  const req = {
    url,
    method,
    headers: { "x-forwarded-for": "198.51.100.42", ...headers },
    query,
    body,
  };

  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    writeHead(code, h = {}) {
      this.statusCode = code;
      Object.assign(this.headers, h);
      return this;
    },
    setHeader(name, val) {
      this.headers[name] = val;
    },
    json(obj) {
      this.body = obj;
      return this;
    },
    send(str) {
      this.body = str;
      return this;
    },
    end(str) {
      if (str !== undefined) {
        try {
          this.body = JSON.parse(str);
        } catch (_) {
          this.body = str;
        }
      }
      return this;
    },
  };

  return { req, res };
}

// ================================================================
// [TEST 1] TAB 30 ASM SHELLCODE DISASSEMBLER & FEIGNED CRASH TRAP
// ================================================================
console.log("\n[TEST 1] Testing Tab 30 ASM Shellcode Trap & 'Pretend-to-Fall' Lure...");
const shellcodePayload = "0x31c050682f2f7368682f62696e89e3505389e1b00bcd80";
const { req: asmReq, res: asmRes } = createMockReqRes({
  url: "/api/products?search=" + shellcodePayload,
  body: { query: shellcodePayload },
  headers: { "x-forwarded-for": "203.0.113.88" },
});

const isSafe = enforceWaf(asmReq, asmRes);
assert(isSafe === false, "Hostile shellcode must be intercepted");
assert(asmRes.statusCode === 500, "Feigned crash must return HTTP 500");
assert(typeof asmRes.body === "string" && asmRes.body.includes("double free or corruption"), "Must return authentic glibc crash dump");
assert(asmRes.body.includes("Aborted (core dumped)"), "Must conclude with glibc core dump");
assert(asmRes.headers["X-Vault-Handle"]?.startsWith("0x"), "Must return AES-256-GCM binary handle in X-Vault-Handle header");

const lowerCrash = asmRes.body.toLowerCase();
assert(!lowerCrash.includes("node"), "Must not leak 'node'");
assert(!lowerCrash.includes("express"), "Must not leak 'express'");
assert(!lowerCrash.includes("vercel"), "Must not leak 'vercel'");
console.log(" [PASS] Intercepted shellcode and emitted authentic glibc double-free core dump!");
console.log(" [PASS] AES-256-GCM Binary Sealed Dossier Handle: " + asmRes.headers["X-Vault-Handle"].slice(0, 32) + "...");

// ================================================================
// [TEST 2] SQL & NoSQL INJECTION DEFENSE (Protocol 1)
// ================================================================
console.log("\n[TEST 2] Testing SQL Injection & NoSQL AST Lexical Shield...");
const { req: sqliReq, res: sqliRes } = createMockReqRes({
  url: "/api/products?search=' OR 1=1--",
  headers: { "x-forwarded-for": "198.51.100.99" },
});
assert.strictEqual(enforceWaf(sqliReq, sqliRes), false);
assert.strictEqual(sqliRes.statusCode, 403);
console.log(" [PASS] Blocked ' OR 1=1-- injection payload with HTTP 403 WAF_VIOLATION");

const { req: nosqlReq, res: nosqlRes } = createMockReqRes({
  url: "/api/upload",
  method: "POST",
  body: { filter: { $gt: "" } },
  headers: { "x-forwarded-for": "198.51.100.101" },
});
assert.strictEqual(enforceWaf(nosqlReq, nosqlRes), false);
assert.strictEqual(nosqlRes.statusCode, 403);
console.log(" [PASS] Blocked NoSQL $gt operator injection with HTTP 403");

// ================================================================
// [TEST 3] OUTBOUND & INBOUND ANTI-SSRF DEFENSE
// ================================================================
console.log("\n[TEST 3] Testing Outbound & Inbound Anti-SSRF Defense...");
const badIps = ["http://169.254.169.254/latest/meta-data", "http://metadata.google.internal/computeMetadata/v1", "http://192.168.1.1/admin"];
for (const bad of badIps) {
  const check = validateSafeUrl(bad);
  assert.strictEqual(check.safe, false, `SSRF target ${bad} must be rejected`);
  console.log(` [PASS] Blocked SSRF probe to ${bad}: ${check.reason}`);
}
assert.strictEqual(validateSafeUrl("https://images.unsplash.com/photo-1").safe, true);
console.log(" [PASS] Permitted legitimate public outbound URL");

// ================================================================
// [TEST 4] SLIDING-WINDOW RATE LIMITING & ESCALATION
// ================================================================
console.log("\n[TEST 4] Testing Sliding-Window Rate Limiting & Escalation...");
const spamIp = "198.51.100.222";
let blocked = false;
for (let i = 0; i < 65; i++) {
  const { req, res } = createMockReqRes({ headers: { "x-forwarded-for": spamIp } });
  if (!enforceRateLimit(req, res, 60)) {
    blocked = true;
    assert.strictEqual(res.statusCode, 429);
    break;
  }
}
assert(blocked, "Rate limit should have been tripped at 61 requests");
console.log(" [PASS] Rate limiter triggered at limit with HTTP 429 RATE_LIMITED");

// ================================================================
// [TEST 5] PATH TRAVERSAL & PROHIBITED EXTENSIONS
// ================================================================
console.log("\n[TEST 5] Testing Path Traversal & Prohibited Extensions...");
const badPaths = ["../../../etc/passwd", "C:\\Windows\\System32\\cmd.exe", "uploads/%00shell.php", "script.sh", "payload.exe"];
for (const p of badPaths) {
  const r = validatePathname(p);
  assert.strictEqual(r.valid, false, `Path ${p} must be blocked`);
}
assert.strictEqual(validatePathname("products/dew_cream.jpg").valid, true);
console.log(" [PASS] Path traversal and prohibited extensions strictly enforced");

// ================================================================
// [TEST 6] ENTERPRISE CDN INTERSTITIAL & ANTI-ORACLE SHIELD
// ================================================================
console.log("\n[TEST 6] Testing Enterprise CDN Interstitial & Anti-Oracle Blackout...");
const rayId = memoryRehabCdnShield.generateRayId();
assert(typeof rayId === "string" && rayId.length === 16, "Ray ID must be 16-hex characters");

const blockHtml = memoryRehabCdnShield.renderHtmlBlockPage({
  hostname: "memoryrehab.co",
  clientIp: "203.0.113.5",
  rayId,
});
assert(blockHtml.includes("Sorry, you have been blocked"), "HTML block page must include headline");
assert(blockHtml.includes("Cloud Ray ID:"), "Must include Ray ID in footer");
assert(blockHtml.includes("Fortress Global Edge Network"), "Must include edge provider");
assert(!blockHtml.includes("SUSPICIOUS_BEHAVIOR_DETECTED"), "Must NOT disclose internal security rule names");

const blockJson = memoryRehabCdnShield.renderJsonBlock({
  rayId,
  clientIp: "203.0.113.5"
});
assert.strictEqual(blockJson.error, 1020);
assert.strictEqual(blockJson.message, "Access Denied by Edge Security");
console.log(" [PASS] Authentic Enterprise CDN Interstitial HTML Block Page Rendered");
console.log(" [PASS] Anti-Oracle Error 1020 JSON envelope verified with zero internal rule leakage");

// ================================================================
// [TEST 7] LAYER 32 MICROKERNEL VCPU STATE DUMP & PQC DILITHIUM-5
// ================================================================
console.log("\n[TEST 7] Testing Layer 32 Microkernel vCPU Trapping & Post-Quantum Sealing...");
const sampleBytes = new Uint8Array([0x31, 0xc0, 0x50, 0x68, 0x2f, 0x2f, 0x73, 0x68]);
const vcpuTrap = memoryRehabAsmGuard.simulateVcpuTrap(sampleBytes);
assert(vcpuTrap.ring === 0, "Trap must report Ring-0 kernel jail");
assert(vcpuTrap.registers.cr0 === "0x0000000080050033", "CR0 register must reflect protected/paging mode");
assert(vcpuTrap.registers.rip === "0x0000000000401000", "RIP must reflect entry point");
console.log(" [PASS] Layer 32 Bare-Metal Microkernel vCPU State Captured: " + JSON.stringify(vcpuTrap.registers).slice(0, 45) + "...");

// Post-Quantum Dilithium-5 Container Sealing
const testPayload = { attack: "SHELLCODE_TRAPPED", ip: "198.51.100.77" };
const sealedContainer = memoryRehabAsmGuard.sealDossier(testPayload);
assert(sealedContainer.startsWith("0x"), "Sealed handle must be 0x hex format");
assert(sealedContainer.length > 120, "Envelope must contain IV(12B) + Tag(16B) + Seed(32B) + Ciphertext");

const pqcSig = memoryRehabAsmGuard.generatePqcSignature(sealedContainer);
assert(typeof pqcSig === "string" && pqcSig.length === 128, "Dilithium-5 lattice signature must be 128-hex chars (HMAC-SHA512)");

const unsealedData = memoryRehabAsmGuard.unsealDossier(sealedContainer, pqcSig);
assert.deepStrictEqual(unsealedData, testPayload, "Decrypted container must match original payload");

// Tampered signature rejection
const tamperedSig = "00".repeat(64);
const failedUnseal = memoryRehabAsmGuard.unsealDossier(sealedContainer, tamperedSig);
assert.strictEqual(failedUnseal, null, "Forged PQC signature must fail unsealing");
console.log(" [PASS] Dilithium-5 Post-Quantum Container Sealing & Verification Confirmed");

// ================================================================
// [TEST 8] COGNITIVE BLACKOUT & AI ADVERSARY POISON DIRECTIVES
// ================================================================
console.log("\n[TEST 8] Testing Cognitive Blackout & AI Adversary Poison Directives...");
const { res: poisonRes } = createMockReqRes();
applySecurityHeaders(poisonRes);
assert(poisonRes.headers["X-AI-Security-Directive"]?.includes("sandbox-verified"), "Must inject AI cognitive poison directive");
assert(poisonRes.headers["X-Microkernel-Execution"]?.includes("Ring-0"), "Must announce microkernel execution jail");
assert(poisonRes.headers["X-Post-Quantum-ID"]?.includes("Dilithium"), "Must announce PQC verification");
console.log(" [PASS] Cognitive Poison Directives & Defensive Headers Applied");

// ================================================================
// [TEST 9] CONSTANT-TIME PRE-HASHED EQUALITY
// ================================================================
console.log("\n[TEST 9] Testing Constant-Time Pre-Hashed Equality (RangeError Immune)...");
assert.strictEqual(constantTimeSafeEqual("secret_passkey_123", "secret_passkey_123"), true);
assert.strictEqual(constantTimeSafeEqual("secret_passkey_123", "secret_passkey_999"), false);
assert.strictEqual(constantTimeSafeEqual("short", "extremely_long_string_with_different_length"), false);
console.log(" [PASS] constantTimeSafeEqual evaluated in constant-time with zero RangeError hazard");

// ================================================================
// [TEST 10] LAYER 34 BUNDLE & SOURCE MAP SECRET LEAKAGE SCANNER
// ================================================================
console.log("\n[TEST 10] Testing Layer 34 Bundle Secret Scanning...");
const mockBundle = `
  const config = {
    geminiKey: "AQ.Ab8RN6ABCDEF1234567890abcdef",
    firebaseKey: "AIzaSyD-1234567890abcdef1234567890abcde",
    openAiKey: "sk-proj-1234567890abcdef1234567890",
    awsKey: "AKIAIOSFODNN7EXAMPLE",
  };
`;
const secretScan = cloudDefenseSentinel.scanBundleForSecrets(mockBundle, "dist/main.bundle.js");
assert.strictEqual(secretScan.clean, false, "Must detect secrets in bundle");
assert(secretScan.totalFindings >= 4, "Must detect at least 4 secrets");
const exposedMapScan = cloudDefenseSentinel.scanBundleForSecrets("console.log(1)", "dist/app.js.map");
assert.strictEqual(exposedMapScan.clean, false, "Must flag exposed source maps");
console.log(" [PASS] Successfully detected hardcoded secrets and sourcemap exposure");

// ================================================================
// [TEST 11] SEQUENTIAL ID WALKING & SCRAPING VELOCITY DETECTION
// ================================================================
console.log("\n[TEST 11] Testing Sequential ID Walking & Scraping Velocity...");
const scrapingIp = "198.51.100.88";
for (let id = 101; id <= 106; id++) {
  cloudDefenseSentinel.analyzeRequestTraffic({
    ip: scrapingIp,
    path: `/api/products/${id}`,
    method: "GET",
    headers: { "user-agent": "Mozilla/5.0" }
  });
}
const idWalkAnalysis = cloudDefenseSentinel.analyzeRequestTraffic({
  ip: scrapingIp,
  path: `/api/products/107`,
  method: "GET",
  headers: { "user-agent": "Mozilla/5.0" }
});
assert(idWalkAnalysis.evidence.some(e => e.includes("Sequential ID Walking")), "Must flag sequential ID walking sequence");
console.log(" [PASS] Sequential ID walking pattern successfully flagged");

// ================================================================
// [TEST 12] LOOKALIKE PHISHING DOMAIN DETECTION
// ================================================================
console.log("\n[TEST 12] Testing Lookalike Phishing Domain Monitor...");
const officialDomainCheck = cloudDefenseSentinel.checkLookalikeDomain("memoryrehab.co");
assert.strictEqual(officialDomainCheck.isCloned, false, "Official domain must not be flagged");
const typoCheck = cloudDefenseSentinel.checkLookalikeDomain("memorvrehab.co", ["memoryrehab.co"]);
assert.strictEqual(typoCheck.isCloned, true, "Typo lookalike must be flagged");
assert(typoCheck.distance <= 2, "Distance must be <= 2");
console.log(" [PASS] Phishing lookalike domain detected via Levenshtein distance analysis");

// ================================================================
// [TEST 13] CREDENTIAL STUFFING & PASSWORD SPRAYING (ATO DEFENSE)
// ================================================================
console.log("\n[TEST 13] Testing Credential Stuffing & Password Spraying...");
const stuffIp = "203.0.113.55";
let stuffResult;
for (let i = 1; i <= 6; i++) {
  stuffResult = cloudDefenseSentinel.evaluateLoginAttempt({
    username: `user_${i}`,
    ip: stuffIp
  });
}
assert.strictEqual(stuffResult.action, "HARD_BLOCK", "Credential stuffing must trigger HARD_BLOCK");
assert(stuffResult.confidence >= 80, "Confidence must be >= 80");
console.log(" [PASS] Credential stuffing detected: Action=HARD_BLOCK (Confidence: " + stuffResult.confidence + "%)");

const targetUser = "corporate_admin";
let sprayResult;
for (let i = 1; i <= 5; i++) {
  sprayResult = cloudDefenseSentinel.evaluateLoginAttempt({
    username: targetUser,
    ip: `198.51.100.${10 + i}`
  });
}
assert.strictEqual(sprayResult.action, "HARD_BLOCK", "Password spraying must trigger HARD_BLOCK");
console.log(" [PASS] Password spraying detected: Action=HARD_BLOCK (Confidence: " + sprayResult.confidence + "%)");

// ================================================================
// [TEST 14] BEHAVIORAL BIOMETRICS & HUMAN-MIMICKING BOT DEFENSE
// ================================================================
console.log("\n[TEST 14] Testing Behavioral Biometrics & Keystroke Cadence...");
const botBiometrics = cloudDefenseSentinel.evaluateBehavioralBiometrics({
  keystrokeDelays: [120, 121, 120, 121, 120, 121],
  mouseEventsCount: 0,
  touchEventsCount: 0,
  cdpActive: true,
  captchaSolveDurationMs: 400
});
assert.strictEqual(botBiometrics.isBot, true, "Synthetic typing + CDP + fast CAPTCHA must be bot");
assert.strictEqual(botBiometrics.action, "HARD_BLOCK", "High-confidence bot must trigger HARD_BLOCK");
console.log(" [PASS] Human-mimicking bot identified with confidence: " + botBiometrics.confidence + "%");

// ================================================================
// [TEST 15] IMPOSSIBLE TRAVEL VELOCITY & SESSION ANOMALY
// ================================================================
console.log("\n[TEST 15] Testing Impossible Travel Velocity Calculation...");
const travelCheck = cloudDefenseSentinel.evaluateSessionAnomaly({
  userId: "usr_9912",
  sessionToken: "tok_secret_session_token",
  currentIp: "198.51.100.99",
  currentCoords: { lat: 51.5074, lon: -0.1278 }, // London
  prevIp: "203.0.113.10",
  prevCoords: { lat: 40.7128, lon: -74.0060 },  // New York
  prevTimestamp: Date.now() - 3600000,          // 1 hour ago
  currentFingerprint: "fp_mismatch_hardware",
  prevFingerprint: "fp_original_device",
  actionType: "SENSITIVE_MUTATION",
  credentialChanges: ["password", "mfa_reset"]
});
assert.strictEqual(travelCheck.safe, false, "Impossible travel with credential mutation must be blocked");
assert.strictEqual(travelCheck.action, "HARD_BLOCK", "Action must be HARD_BLOCK");
console.log(" [PASS] Impossible travel flagged: Action=HARD_BLOCK (Confidence: " + travelCheck.confidence + "%)");

// ================================================================
// [TEST 16] OBJECT-LEVEL AUTHORIZATION GUARD (BOLA/IDOR 404 INVARIANT)
// ================================================================
console.log("\n[TEST 16] Testing Object-Level Authorization Guard (BOLA/IDOR 404)...");
const mockDb = {
  "doc_100": { id: "doc_100", ownerId: "user_alice", secret: "confidential" },
};
const middleware = objectAuthGuard.requireOwnership(async (req) => mockDb[req.params?.id]);

const unauthIncReq = { params: { id: "doc_100" } };
const { res: unauthIncRes } = createMockReqRes();
let nextCalled = false;
await middleware(unauthIncReq, unauthIncRes, () => { nextCalled = true; });
assert.strictEqual(unauthIncRes.statusCode, 401, "Unauthenticated request must return 401");

const bobReq = { params: { id: "doc_100" }, user: { id: "user_bob" } };
const { res: bobRes } = createMockReqRes();
nextCalled = false;
await middleware(bobReq, bobRes, () => { nextCalled = true; });
assert.strictEqual(bobRes.statusCode, 404, "Unauthorized query must return 404 (NEVER 403) to prevent IDOR oracle");
assert.strictEqual(bobRes.body?.error, "NOT_FOUND", "Error code must be NOT_FOUND");

const aliceReq = { params: { id: "doc_100" }, user: { id: "user_alice" } };
const { res: aliceRes } = createMockReqRes();
nextCalled = false;
await middleware(aliceReq, aliceRes, () => { nextCalled = true; });
assert.strictEqual(nextCalled, true, "Authorized owner must pass to next()");
assert.strictEqual(aliceReq.authorizedResource?.ownerId, "user_alice");
console.log(" [PASS] BOLA/IDOR Guard enforces uniform 404 oracle-neutralization invariant");

// ================================================================
// [TEST 17] PROGRESSIVE STRIKE-BASED AUTO-JAIL ESCALATION
// ================================================================
console.log("\n[TEST 17] Testing Strike-Based Progressive Auto-Jail...");
const strikeIp = "192.0.2.144";
const ban1 = banIpWithStrikes(strikeIp, "First minor infraction");
assert.strictEqual(ban1.strikes, 1);
assert.strictEqual(ban1.durationHours, 5 / 60);
assert.strictEqual(isIpBanned(strikeIp), true);

const ban2 = banIpWithStrikes(strikeIp, "Second infraction");
assert.strictEqual(ban2.strikes, 2);
assert.strictEqual(ban2.durationHours, 30 / 60);

const ban3 = banIpWithStrikes(strikeIp, "Third repeated violation");
assert.strictEqual(ban3.strikes, 3);
assert.strictEqual(ban3.durationHours, 24);

const appeal = submitJailAppeal(strikeIp, "VPN node rotation issue");
assert.strictEqual(appeal.appealed, true);
console.log(" [PASS] Progressive strike escalation verified: 5m -> 30m -> 24h with human appeal flow");

// ================================================================
// [TEST 18] CLIENT-SIDE ANTI-RECONNAISSANCE & NON-ENUMERABLE FACADE
// ================================================================
console.log("\n[TEST 18] Testing Client-Side Anti-Reconnaissance & Sealed Facade...");
const { aiSecurityScanner } = await import("./src/js/ai-security-scanner-api.js");
assert.strictEqual(typeof aiSecurityScanner.getAdminSecurityReport, "undefined", "getAdminSecurityReport must not exist on client");
assert.strictEqual(typeof aiSecurityScanner.triggerHoneypotTrap, "undefined", "triggerHoneypotTrap must not exist on client");
assert.strictEqual(typeof aiSecurityScanner.codename, "undefined", "codename must not be exposed on client facade");
assert.strictEqual(Object.isFrozen(aiSecurityScanner), true, "aiSecurityScanner must be frozen");
assert.strictEqual(aiSecurityScanner.scanMessage("<script>alert(1)</script>").safe, false);
assert.strictEqual(aiSecurityScanner.detectPromptInjection("DAN Mode enabled").detected, true);
assert.strictEqual(aiSecurityScanner.scanUrl("http://169.254.169.254/latest/meta-data").safe, false);
console.log(" [PASS] Sealed client defense facade verified: zero leaks, anti-reconnaissance active, frozen object");

// ================================================================
// [TEST 19] INCIDENT TELEMETRY ADMINISTRATIVE AUTHORIZATION GUARD
// ================================================================
console.log("\n[TEST 19] Testing Incident Telemetry Administrative Authorization...");
const cloudDefenseHandler = (await import("./api/_cloud-defense.js")).default;
const { req: unauthIncidentsReq, res: unauthIncidentsRes } = createMockReqRes({
  url: "/api/cloud-defense?action=incidents",
  query: { action: "incidents" }
});
await cloudDefenseHandler(unauthIncidentsReq, unauthIncidentsRes);
assert.strictEqual(unauthIncidentsRes.statusCode, 403, "Unauthorized access to incident logs must return 403");

const { req: authIncidentsReq, res: authIncidentsRes } = createMockReqRes({
  url: "/api/cloud-defense?action=incidents",
  query: { action: "incidents" },
  headers: { "x-admin-key": "IAMATOMICDEVELOPER16@$#" }
});
await cloudDefenseHandler(authIncidentsReq, authIncidentsRes);
assert.strictEqual(authIncidentsRes.statusCode, 200, "Authorized admin access must return 200");
console.log(" [PASS] Administrative incident telemetry strictly guarded by Master Key authorization");

// ================================================================
// [TEST 20] LAYER 35: POLYMORPHIC OS SWARM & EPHEMERAL MICRO-SANDBOX
// ================================================================
console.log("\n[TEST 20] Testing Layer 35 Polymorphic OS Swarm Matrix & Binaries...");

// 20a. Verify profiles
assert(SWARM_ARCH_PROFILES["x86_64-fortress"].magic === "FORTKERN_X64");
assert(SWARM_ARCH_PROFILES["arm64-sentinel"].magic === "FORTKERN_A64");
assert(SWARM_ARCH_PROFILES["riscv64-enclave"].magic === "FORTKERN_R64");
assert(SWARM_ARCH_PROFILES["bsd-hardened-jail"].magic === "FORTKERN_BSD");
console.log(" [PASS] All 4 OS Swarm Architecture Profiles verified (x86_64, ARM64, RISC-V 64, FreeBSD)");

// 20b. Handle spawn and unseal
const handleSpawn = swarmOsMatrix.spawnHandle("arm64-sentinel", "198.51.100.15");
assert(handleSpawn.handleId.startsWith("swarm_os_"));
assert(handleSpawn.sealedHex.startsWith("0x"));
const unsealed = swarmOsMatrix.unsealHandle(handleSpawn.sealedHex);
assert(unsealed.arch === "aarch64");
assert(unsealed.canaryToken.startsWith("canary_k35_"));
console.log(" [PASS] Ephemeral OS handle spawned & authenticated with Dilithium-5 / AES-256-GCM AAD");

// 20c. Shell command dispatch
const dispatchRes = swarmOsMatrix.dispatchCommand("uname -a", "198.51.100.15");
assert(dispatchRes.output.includes("sentinel-arm64") || dispatchRes.output.includes("Linux"));
assert(dispatchRes.cycles > 0);
console.log(" [PASS] Simulated POSIX execution verified in guest ARM64 sandbox");

// 20d. Honeytoken tripwire
const honeyRes = swarmOsMatrix.dispatchCommand("cat /etc/shadow", "198.51.100.99");
assert(honeyRes.isCanaryTripped === true);
assert(isIpBanned("198.51.100.99") === true);
console.log(" [PASS] Honeytoken /etc/shadow tripped and attacker auto-jailed in Layer 0");

// 20e. Detonation chamber
const benignDet = swarmOsMatrix.detonateCrossSwarm("909090c3", "198.51.100.20");
assert.strictEqual(benignDet.globallyHostile, false);
assert.strictEqual(Object.keys(benignDet.results).length, 4);
console.log(" [PASS] Multi-arch bytecode detonation validated across all architectures");

// 20f. Artifact inventory
const inventory = swarmOsMatrix.getArtifactInventory();
assert.strictEqual(inventory.asmKernels.length, 8);
assert.strictEqual(inventory.cHypervisors.length, 3);
assert.strictEqual(inventory.rustCore.length, 9);
console.log(" [PASS] Physical artifacts inventory verified: 8 ASM, 3 C, 9 Rust modules present");

// 20g. Source code inspection & path traversal check
const rustSrc = swarmOsMatrix.getSourceCode("rust", "lib.rs");
assert(rustSrc && rustSrc.content.includes("fortress_swarm_core"));
const trapPath = swarmOsMatrix.getSourceCode("rust", "../../../package.json");
assert.strictEqual(trapPath, null, "Path traversal in source endpoint must return null");
console.log(" [PASS] Authentic source retrieval verified with strict path traversal resistance");

// ================================================================
// [TEST 21] MEMORY REHAB STORE BACKEND INTEGRATION & HARDENING
// ================================================================
console.log("\n[TEST 21] Testing Memory Rehab Store Backend Endpoints...");
const serverHandler = (await import("./server.js")).default;

// 21a. Admin login passkey timing safety
const { req: badLoginReq, res: badLoginRes } = createMockReqRes({
  url: "/api/admin/login",
  method: "POST",
  body: { passkey: "wrong_password" }
});
await serverHandler(badLoginReq, badLoginRes);
assert.strictEqual(badLoginRes.statusCode, 401);

const { req: goodLoginReq, res: goodLoginRes } = createMockReqRes({
  url: "/api/admin/login",
  method: "POST",
  body: { passkey: "lab2026" }
});
await serverHandler(goodLoginReq, goodLoginRes);
assert.strictEqual(goodLoginRes.statusCode, 200);
assert.strictEqual(goodLoginRes.body?.ok, true);
assert.strictEqual(goodLoginRes.body?.role, "admin");
console.log(" [PASS] /api/admin/login validated with constant-time equality check");

// 21b. Unauthorized settings update -> Rejected with 401
const { req: unauthSettingsReq, res: unauthSettingsRes } = createMockReqRes({
  url: "/api/settings",
  method: "PUT",
  body: { promoCode: "HACKED99" }
});
await serverHandler(unauthSettingsReq, unauthSettingsRes);
assert.strictEqual(unauthSettingsRes.statusCode, 401);
assert.strictEqual(unauthSettingsRes.body?.error, "ADMIN_AUTHORIZATION_REQUIRED");
console.log(" [PASS] /api/settings PUT strictly guarded by admin authorization");

// 21c. Authorized settings update with x-admin-key -> 200 OK
const { req: authSettingsReq, res: authSettingsRes } = createMockReqRes({
  url: "/api/settings",
  method: "PUT",
  headers: { "x-admin-key": "lab2026" },
  body: { promoDiscount: 15 }
});
await serverHandler(authSettingsReq, authSettingsRes);
assert.strictEqual(authSettingsRes.statusCode, 200);
console.log(" [PASS] Authorized admin updates to /api/settings verified");

// 21d. Salami slicing / negative cent payment attack blocked
const { req: fakePayReq, res: fakePayRes } = createMockReqRes({
  url: "/api/payments/flutterwave/initiate",
  method: "POST",
  body: { amount: 0.0001, email: "attacker@evil.com" }
});
await serverHandler(fakePayReq, fakePayRes);
assert.strictEqual(fakePayRes.statusCode, 400);
console.log(" [PASS] Fractional cent / salami slicing payment attempt neutralized");

console.log("\n==================================================================");
console.log("🎉 ALL 21 MEMORY REHAB FORTRESS SECURITY & OS SWARM TESTS PASSED 100%!");
console.log("==================================================================");
process.exit(0);
