# Sentrik Website — Pre-Launch Manual Test Plan

**Purpose:** Verify every feature claim on the sentrik website before launch.
**Test categories:**
- **Part A — Automated (AI-executable):** CLI, API, source verification tests runnable without GUI
- **Part B — Manual (human-required):** Browser, VS Code, interactive terminal tests

---

## Environment Setup (one-time, before Day 1)

```powershell
# Clone/ensure repos are available
# Main source
cd C:\Users\mgerh\ai_sdlc_guard

# Install from source (npm package is NOT published)
pip install -e .

# Verify CLI is available
sentrik --version

# Example project
cd C:\Users\mgerh\sentrik-example-medfiles

# Website source
cd C:\Users\mgerh\sentra-website
```

**Note on install commands:** The website says `npm install -g sentrik` everywhere. Since the npm package is not published yet, all tests use `pip install -e .` from the source directory. Every test case where the website says `npm install -g sentrik` should be mentally replaced with the local pip install. A separate test (TC-801) verifies that the npm install claim is flagged for update or that the package is published before launch.

---

# Part A — Automated Tests (AI-Executable)

These tests can be run entirely from the CLI, API calls, or source code inspection — no browser or GUI needed. Total: **101 tests**.

---

## A1: Core Install and Zero-Config Scanning (15 tests)

### Prerequisites
- `pip install -e .` completed from `C:\Users\mgerh\ai_sdlc_guard`
- Example project available at `C:\Users\mgerh\sentrik-example-medfiles`
- A second test project (any Python or JS repo) available for cross-validation

---

| Test ID | Claim | Source Page | Steps to Verify | Expected Result | Pass/Fail |
|---------|-------|-------------|-----------------|-----------------|-----------|
| TC-001 | "sentrik CLI is available after install" | Blog: Getting Started | Run `sentrik --help` in a terminal. | Command produces help output listing available subcommands. | - [ ] |
| TC-002 | "Zero config -- works instantly" / "No config files. No wizard. Just scan." | Homepage (hero badge, demo caption) | `cd C:\Users\mgerh\sentrik-example-medfiles; Remove-Item -Force .guard.yaml, .sentrik\config.yaml -ErrorAction SilentlyContinue; sentrik scan` (temporarily move config aside). | Scan completes successfully with findings, even without any config file present. Restore config after test. | - [ ] |
| TC-003 | "Auto-detects your project type, languages, and CI platform" | Homepage (value props), FAQ | `cd C:\Users\mgerh\sentrik-example-medfiles; sentrik scan` | Output includes a line like "Detected: python" and identifies the CI platform and packs. | - [ ] |
| TC-004 | "OWASP Top 10 -- Auto-enabled for every project" | Homepage (standards section) | Run `sentrik scan` in the example project with no config file. Check which packs are active in the output. | OWASP Top 10 is listed as an active pack even with no explicit configuration. | - [ ] |
| TC-005 | "Scanning N files against N rules..." / terminal demo accuracy | Homepage (terminal demo) | Run `sentrik scan` in the example project and compare output format to the terminal demo on the homepage. | Output format matches: severity label, rule ID, file:line, description. Findings include CRITICAL, HIGH, MEDIUM levels. | - [ ] |
| TC-006 | "sentrik scan always exits 0" | FAQ (scan vs gate) | `cd C:\Users\mgerh\sentrik-example-medfiles; sentrik scan; echo "Exit code: $LASTEXITCODE"` | Exit code is 0 even when findings are present. | - [ ] |
| TC-007 | "sentrik gate exits with code 1 if blocking findings are found" | FAQ (scan vs gate), Homepage (terminal demo) | `cd C:\Users\mgerh\sentrik-example-medfiles; sentrik gate; echo "Exit code: $LASTEXITCODE"` | Exit code is 1 because the example project has critical/high findings. | - [ ] |
| TC-008 | "critical and high findings fail the gate by default" | FAQ (severities block gate) | Run `sentrik gate` in example project. Note which severities caused the failure. | Only critical and high findings are listed as blocking. Medium and below do not block. | - [ ] |
| TC-009 | "Results are written to out/findings.json and out/report.md" | Blog: Getting Started | `cd C:\Users\mgerh\sentrik-example-medfiles; sentrik scan; ls out\` | `out/findings.json` exists and contains valid JSON. `out/report.md` (or equivalent) exists. | - [ ] |
| TC-010 | "sentrik init creates .sentrik/config.yaml" | FAQ, Blog: Getting Started | `$d = "$env:TEMP\test-init"; New-Item -ItemType Directory -Force $d; cd $d; sentrik init --no-interactive` | `.sentrik/config.yaml` is created with auto-detected defaults. | - [ ] |
| TC-011 | ".sentrik/config.yaml takes precedence over .guard.yaml" | FAQ (legacy config) | In a test directory, create both `.guard.yaml` (with one pack) and `.sentrik/config.yaml` (with a different pack). Run `sentrik scan` and check which pack is used. | Settings from `.sentrik/config.yaml` take effect, not `.guard.yaml`. | - [ ] |
| TC-012 | ~~"sentrik trial generates a free 30-day Enterprise key"~~ | ~~Pricing, FAQ~~ | **REMOVED** — `trial` command was intentionally removed in Sprint 1. Trial keys are generated programmatically or via the online portal. Update pricing/FAQ if they still reference `sentrik trial`. | N/A | N/A |
| TC-013 | "No credit card required. All enterprise features unlocked." | Pricing (trial banner) | After running `sentrik trial`, set the key via `GUARD_LICENSE_KEY` env var and verify an Enterprise-only feature works (e.g., `sentrik approve --help` or RBAC endpoint). | The trial key activates Enterprise-tier features without any payment flow. | - [ ] |
| TC-014 | "Downloads a platform-specific binary. No Python, no Docker, no extra dependencies." | Homepage, FAQ, Blog: Getting Started | Inspect `C:\Users\mgerh\ai_sdlc_guard\npm-package\` and verify the postinstall script downloads a binary. (Cannot test end-to-end since npm not published.) | The npm package directory contains a postinstall script that fetches a platform binary. Document that this claim cannot be fully verified until npm publish. | - [ ] |
| TC-015 | "Works on macOS, Linux, and Windows" | Homepage (install section) | Verify the current test is running on Windows. Check `guard.spec` or release workflow for macOS/Linux build targets. | Windows works (tested now). macOS and Linux targets exist in build config. Full cross-platform test deferred to CI. | - [ ] |

---

## A2: Standards Packs and Rules (31 tests)

### Prerequisites
- sentrik installed (pip install -e .)
- Example project available
- Trial key set if testing Enterprise features

---

| Test ID | Claim | Source Page | Steps to Verify | Expected Result | Pass/Fail |
|---------|-------|-------------|-----------------|-----------------|-----------|
| TC-101 | "12 standards packs -- 6 Free tier + 6 Organization tier" | Homepage, FAQ, Pricing | Run `sentrik list-packs` (or equivalent command to list available packs). | All 12 packs are listed. Free tier (6): fda-iec-62304, owasp-top-10, soc2, hipaa, pci-dss, iso-27001. Organization tier (6): iec-81001-5-1, fda-21cfr11, iso-14971, misra-c, do-178c, iso-26262. | - [ ] |
| TC-102 | "IEC 62304 -- 31 rules" | Homepage (standards section), FAQ | Enable the fda-iec-62304 pack and run `sentrik scan`. Count total loaded rules (across all languages). Alternatively, inspect the pack YAML sources. | Exactly 31 rules are loaded for the IEC 62304 pack. | - [ ] |
| TC-103 | "OWASP Top 10 -- 69 rules (across 8 languages)" | Homepage (standards section), FAQ | Enable owasp-top-10 and count total OWASP rule IDs loaded from pack source (all language files). The website shows "22 checks" because it counts unique check types, not per-language rules. | Exactly 69 rules are loaded for the OWASP pack across all 8 supported languages. | - [ ] |
| TC-104 | "SOC2 -- 30 rules" | Homepage (standards section), FAQ | Inspect the SOC2 pack source or run a scan with only SOC2 enabled and count total loaded rules. | Exactly 30 rules in the SOC2 pack. | - [ ] |
| TC-105 | "HIPAA -- 25 rules" | Homepage (standards section), FAQ | Inspect the HIPAA pack source or count total loaded rules. | Exactly 25 rules in the HIPAA pack. | - [ ] |
| TC-106 | "PCI DSS -- 33 rules" | Homepage (standards section), FAQ | Inspect the PCI DSS pack source or count total loaded rules. | Exactly 33 rules in the PCI DSS pack. | - [ ] |
| TC-107 | "ISO 27001 -- 32 rules" | Homepage (standards section), FAQ | Inspect the ISO 27001 pack source or count total loaded rules. | Exactly 32 rules in the ISO 27001 pack. | - [ ] |
| TC-108 | "sentrik add-pack <pack-name>" | Homepage (standards cards), Blog: IEC 62304 | In a fresh test directory with `sentrik init`, run `sentrik add-pack fda-iec-62304`. Then run `sentrik scan`. | The IEC 62304 pack is added to config and rules are applied on subsequent scan. | - [ ] |
| TC-109 | "Use multiple packs at the same time" | FAQ (multiple packs) | Create a config with `standards_packs: [fda-iec-62304, owasp-top-10, hipaa]`. Run `sentrik scan` in the example project. | Findings from all three packs appear in the output. Rule IDs from each pack are present. | - [ ] |
| TC-110 | "Rules from all enabled packs are merged and deduplicated" | FAQ (multiple packs) | Enable overlapping packs and check that no rule ID appears twice in findings for the same file+line. | No duplicate findings for the same rule+file+line combination. | - [ ] |
| TC-111 | "Custom rules in standards.yaml or .sentrik/rules/ directory" | FAQ (custom rules) | Create a custom rule YAML with a simple regex pattern. Place it in `.sentrik/rules/`. Run `sentrik scan`. | The custom rule is picked up and produces findings where the pattern matches. | - [ ] |
| TC-112 | "IEC 62304 pack checks for traceability headers" | Blog: IEC 62304, Use case: Medical Devices | Run `sentrik scan` with fda-iec-62304 on a Python file that has no traceability header. | A HIGH severity finding about missing traceability header is reported. | - [ ] |
| TC-113 | "Documentation obligations appear in reports but never fail the gate" | Blog: IEC 62304 | Run `sentrik gate` with fda-iec-62304 enabled. Check if documentation_obligation rules caused a gate failure. | Documentation obligation findings appear in the report but do not contribute to gate failure. | - [ ] |
| TC-114 | "OWASP: eval() executes arbitrary code" | Homepage (terminal demo) | Ensure the example project has an `eval()` call. Run `sentrik scan` and look for the eval finding. | A CRITICAL finding about eval() is reported, matching the terminal demo claim. | - [ ] |
| TC-115 | "OWASP: Hardcoded credentials" | Homepage (terminal demo) | Check that the example project has a hardcoded secret. Run `sentrik scan`. | A HIGH finding about hardcoded credentials is reported. | - [ ] |
| TC-116 | "OWASP: MD5 used for hashing" | Homepage (terminal demo) | Check that the example project uses MD5. Run `sentrik scan`. | A MEDIUM finding about weak hashing (MD5) is reported. | - [ ] |
| TC-117 | "Suppression: suppressed findings still appear in reports but don't block the gate" | FAQ (suppressions) | Add a suppression to config for one of the example project findings. Run `sentrik gate`. | The suppressed finding appears in the report but does not cause gate failure. | - [ ] |
| TC-118 | "Pack overrides (tune rules per-project) -- Organization tier" | Pricing (Org tier) | With an Org or Enterprise trial key, configure a pack override (e.g., change a rule severity). Run `sentrik scan`. Without the key, verify the feature is gated. | Pack overrides work with the right license. Without license, feature is blocked or unavailable. | - [ ] |
| TC-119 | "IEC 81001-5-1 -- 20 rules (Organization tier)" | Pricing (Org tier) | With Organization or Enterprise license, enable iec-81001-5-1 pack and count total loaded rules. | Exactly 20 rules are loaded. Pack requires Organization tier license. | - [ ] |
| TC-120 | "21 CFR Part 11 -- 16 rules (Organization tier)" | Pricing (Org tier) | With Organization or Enterprise license, enable fda-21cfr11 pack and count total loaded rules. | Exactly 16 rules are loaded. Pack requires Organization tier license. | - [ ] |
| TC-121 | "ISO 14971 -- 16 rules (Organization tier)" | Pricing (Org tier) | With Organization or Enterprise license, enable iso-14971 pack and count total loaded rules. | Exactly 16 rules are loaded. Pack requires Organization tier license. | - [ ] |
| TC-122 | "MISRA C/C++ -- 21 rules (Organization tier)" | Pricing (Org tier) | With Organization or Enterprise license, enable misra-c pack and count total loaded rules. | Exactly 21 rules are loaded. Pack requires Organization tier license. | - [ ] |
| TC-123 | "DO-178C -- 22 rules (Organization tier)" | Pricing (Org tier) | With Organization or Enterprise license, enable do-178c pack and count total loaded rules. | Exactly 22 rules are loaded. Pack requires Organization tier license. | - [ ] |
| TC-124 | "ISO 26262 -- 23 rules (Organization tier)" | Pricing (Org tier) | With Organization or Enterprise license, enable iso-26262 pack and count total loaded rules. | Exactly 23 rules are loaded. Pack requires Organization tier license. | - [ ] |
| TC-125 | "Organization tier packs are gated -- Free tier cannot use them" | Pricing (tier gating) | Without a license key (Free tier), run `sentrik add-pack misra-c`. Then try `sentrik scan` with `standards_packs: [misra-c]` in config. | Command fails or warns that misra-c requires Organization tier. Scan does not load Organization tier pack rules on Free tier. | - [ ] |
| TC-126 | "All 12 packs load with Organization license" | Pricing (Org tier) | With Organization or Enterprise license, set config with all 12 packs in `standards_packs`. Run `sentrik scan`. | All 12 packs load successfully. Total rule count across all packs: 337 (69+30+25+33+32+30+20+16+16+21+22+23). | - [ ] |
| TC-127 | "OWASP rules fire on JavaScript files" | Multi-language coverage | Create a test file `test_eval.js` containing `eval(userInput)`. Run `sentrik scan` with owasp-top-10 enabled. | OWASP eval() rule fires on the .js file with CRITICAL severity. | - [ ] |
| TC-128 | "OWASP rules fire on Java files" | Multi-language coverage | Create a test file `TestRandom.java` containing `new Random()`. Run `sentrik scan` with owasp-top-10 enabled. | OWASP insecure random rule fires on the .java file. | - [ ] |
| TC-129 | "OWASP/MISRA rules fire on C/C++ files" | Multi-language coverage | Create a test file `test_unsafe.cpp` containing `gets(buf)` or `strcpy(dst, src)`. Run `sentrik scan` with owasp-top-10 (or misra-c with Org license) enabled. | Unsafe function usage is flagged on the .cpp file. | - [ ] |
| TC-130 | "OWASP rules fire on C# files" | Multi-language coverage | Create a test file `TestSerializer.cs` containing `new BinaryFormatter()`. Run `sentrik scan` with owasp-top-10 enabled. | Insecure deserialization rule fires on the .cs file. | - [ ] |
| TC-131 | "OWASP rules fire on Go files" | Multi-language coverage | Create a test file `test_sqli.go` containing `fmt.Sprintf("SELECT * FROM users WHERE id = %s", userInput)`. Run `sentrik scan` with owasp-top-10 enabled. | SQL injection rule fires on the .go file. | - [ ] |

---

## A3: CI/CD Integration and PR Decoration (11 tests)

### Prerequisites
- sentrik installed
- A test Git repository with at least two branches (main + feature)
- GitHub token available (or mock/dry-run where possible)

---

| Test ID | Claim | Source Page | Steps to Verify | Expected Result | Pass/Fail |
|---------|-------|-------------|-----------------|-----------------|-----------|
| TC-201 | "sentrik gate --git-range 'origin/main...HEAD'" | FAQ (PR-scoped scan), Blog: Getting Started, SaaS use case | In a Git repo with changes on a branch: `sentrik gate --git-range "origin/main...HEAD"` | Only files changed between the branch and main are scanned. Output mentions scoped scan. | - [ ] |
| TC-202 | "sentrik scan --staged" | FAQ (pre-commit scan) | Stage some files with `git add`. Run `sentrik scan --staged`. | Only staged files are scanned, not the entire project. | - [ ] |
| TC-203 | "--decorate-pr flag posts findings as PR comments" | FAQ (GitHub Actions), SaaS use case, Blog: IEC 62304 | Run `sentrik gate --decorate-pr --help` or check the CLI help for the flag. If a GitHub PR is available, test end-to-end. Otherwise, verify the flag is accepted and the code path exists. | The `--decorate-pr` flag is a valid CLI option. If tested against a real PR, findings appear as comments. | - [ ] |
| TC-204 | "--status-check reports pass/fail as a commit status" | FAQ (GitHub Actions) | Run `sentrik gate --status-check --help` or verify the flag exists. Check `status_reporter.py` source for GitHub and Azure implementations. | The `--status-check` flag is valid. Source code contains GitHubStatusReporter and AzureStatusReporter classes. | - [ ] |
| TC-205 | "SARIF report at out/report.sarif" | FAQ (SARIF), Pricing (Free tier) | Run `sentrik scan` and check for `out/report.sarif`. Validate it is valid SARIF JSON. | `out/report.sarif` exists, is valid JSON, and follows the SARIF schema (has `$schema`, `runs`, `results` keys). | - [ ] |
| TC-206 | "GitHub Actions workflow example works" | FAQ, Blog: Getting Started, Blog: IEC 62304 | Review the workflow YAML shown on the website. Verify all referenced commands (`npm install -g sentrik`, `sentrik gate --git-range ...`) are valid. Check that `actions/checkout@v4` and `actions/setup-node@v4` are current. | Workflow YAML is syntactically correct and uses current action versions. | - [ ] |
| TC-207 | "Azure Pipelines support -- OAuth or PAT, PR decoration, commit status" | FAQ (Azure Pipelines) | Check source for Azure-specific code: `Select-String -Path C:\Users\mgerh\ai_sdlc_guard\src\guard\*.py -Pattern "AzurePRDecorator|AzureStatusReporter" -Recurse`. Verify `--decorate-pr` handles Azure detection. | Azure PR decoration and status reporting classes exist. Azure environment variable detection (SYSTEM_PULLREQUEST_PULLREQUESTID) is implemented. | - [ ] |
| TC-208 | "Pre-commit hooks" | Pricing (Free tier), FAQ | Run `sentrik pre-commit-scan --help` and check if it exists. Verify a `.pre-commit-config.yaml` example or hook setup exists. | Pre-commit scan command exists. Documentation or init wizard sets up hooks. | - [ ] |
| TC-209 | "sentrik fix-hook" | (Implied by pre-commit recovery feature) | Run `sentrik fix-hook --help`. | Command exists and describes how to recover a broken pre-commit hook. | - [ ] |
| TC-210 | "gate fail_on customization via config" | FAQ (gate severities) | Create config with `governance: gate: fail_on: [critical, high, medium]`. Run `sentrik gate` in example project. | Medium findings now also block the gate (previously only critical+high). | - [ ] |
| TC-211 | "GUARD_GATE_FAIL_ON environment variable" | FAQ (gate severities) | `$env:GUARD_GATE_FAIL_ON="critical"; sentrik gate` in example project (which has critical findings). Then `Remove-Item Env:\GUARD_GATE_FAIL_ON` to clean up. | Gate fails on critical only. High findings do not block. | - [ ] |

---

## A4: API and Reports — Non-Browser (12 tests)

### Prerequisites
- sentrik installed
- Run `sentrik scan` in the example project first to generate findings

---

| Test ID | Claim | Source Page | Steps to Verify | Expected Result | Pass/Fail |
|---------|-------|-------------|-----------------|-----------------|-----------|
| TC-303 | "REST API (25+ endpoints)" | Pricing (Free tier) | Start the server with `sentrik serve`. Count endpoint decorators in server.py or call API listing. | At least 25 API endpoints are available. | - [ ] |
| TC-304 | "HTML report with severity charts and compliance checklists" | Blog: IEC 62304, Fintech use case | Run `sentrik scan` and check `out/` for an HTML report. Inspect content. | HTML report exists, contains a severity chart (donut/bar), and shows findings. | - [ ] |
| TC-305 | "JUnit report" | Pricing (Free tier) | Run `sentrik scan` and check `out/` for a JUnit XML report, or check if `--format junit` flag exists. | JUnit report is generated or the format option is available. | - [ ] |
| TC-306 | "CSV report" | Pricing (Free tier) | Check for CSV output in `out/` after scan, or verify CSV reporter exists in source. | CSV report is generated or available as a format option. | - [ ] |
| TC-308 | "Theme toggle (light/dark mode)" | (Platform polish feature) | Inspect dashboard.html source for theme toggle implementation. | Dashboard has toggleTheme() JS, CSS data-theme, localStorage persistence. | - [ ] |
| TC-309 | "Global search (Ctrl+K)" | (Platform polish feature) | Inspect dashboard.html source for search overlay implementation. | openSearch/closeSearch functions exist, keyboard handler for Ctrl+K and "/". | - [ ] |
| TC-310 | "API docs landing page at /api" | (Platform polish feature) | Inspect server.py for GET /api handler returning HTML. | GET /api returns a branded HTML page with endpoint listings. | - [ ] |
| TC-311 | "SSE progress streaming -- POST /api/run-scan-stream" | (Platform polish feature) | Inspect server.py for /api/run-scan-stream endpoint returning StreamingResponse. | Endpoint exists with text/event-stream content type. | - [ ] |
| TC-312 | "Scan trends -- GET /api/trends" | (Platform polish feature) | Inspect server.py for /api/trends endpoint. | Endpoint exists and returns historical scan data. | - [ ] |
| TC-313 | "Config validation -- GET /api/config/validate" | (Platform polish feature) | Inspect server.py for /api/config/validate endpoint. | Endpoint exists and returns validation result. | - [ ] |
| TC-314 | "OAuth connect/disconnect from dashboard" | FAQ (OAuth tokens) | Inspect dashboard.html for OAuth connection buttons. | Connect/Disconnect buttons for Azure, GitHub, Jira exist in source. | - [ ] |
| TC-315 | "OAuth tokens stored in .sentrik/local/oauth_tokens.json (gitignored)" | FAQ (OAuth tokens) | Check `.gitignore` for `.sentrik/local/`. Inspect oauth store source. | Path is gitignored. Token storage location matches the claim. | - [ ] |

---

## A5: Developer Workflow — Non-GUI (3 tests)

| Test ID | Claim | Source Page | Steps to Verify | Expected Result | Pass/Fail |
|---------|-------|-------------|-----------------|-----------------|-----------|
| TC-405 | "Agent context generation" | Homepage (Built for AI Agents) | Check if `sentrik context` or similar command exists. Run `sentrik --help` and look for context-related subcommands. | A command or feature for generating agent context exists (e.g., context command, pre-commit hook data). | - [ ] |
| TC-408 | "Post-scan CLI output includes docs link" | (Community feature) | Run `sentrik scan` in the example project when findings are present. Check the output footer. | Output includes a link to documentation (docs.sentrik.dev or equivalent). | - [ ] |
| TC-409 | "Rich Progress bar in scan command" | (Platform polish feature) | Run `sentrik scan` in a project with many files and observe the terminal. | A progress bar (Rich library) is displayed during scanning. | - [ ] |

---

## A6: Work Item Traceability, Requirements, and Drift Detection (21 tests)

### Prerequisites
- sentrik installed with trial key (for traceability features if tier-gated)
- DevOps tokens configured (AZURE_DEVOPS_PAT or GITHUB_TOKEN or JIRA_TOKEN) -- or test in dry-run mode
- Example project scanned

---

| Test ID | Claim | Source Page | Steps to Verify | Expected Result | Pass/Fail |
|---------|-------|-------------|-----------------|-----------------|-----------|
| TC-501 | "Link findings to Azure DevOps, GitHub Issues, or Jira work items" | Homepage (Trace Everything) | Check `sentrik reconcile --help` for supported providers. Verify config options for azure, github, jira. | Reconcile command supports all three providers. Config has fields for each. | - [ ] |
| TC-502 | "Auto-create, update, and close items on reconcile" | Homepage (Trace Everything), FAQ (reconcile) | Run `sentrik reconcile --dry-run` after a scan with findings. | Dry-run output shows planned actions: create new items, update existing, close resolved. | - [ ] |
| TC-503 | "sentrik reconcile --dry-run to preview actions" | FAQ (reconcile), Blog: IEC 62304 | Run `sentrik reconcile --dry-run`. | Actions are listed but not executed. No work items are actually created. | - [ ] |
| TC-504 | "Azure DevOps, GitHub Issues, and Jira (Cloud and Server/Data Center)" | FAQ (DevOps platforms) | Check source code for Jira provider: verify both Cloud and Server/Data Center support. Check for all three provider implementations. | Code has provider classes/modules for Azure DevOps, GitHub, and Jira (with cloud + server variants). | - [ ] |
| TC-505 | "OAuth for Azure DevOps, GitHub, Jira" | FAQ (DevOps platforms, OAuth) | Check `C:\Users\mgerh\ai_sdlc_guard\src\guard\oauth\` for provider implementations. | OAuth provider files exist for all three platforms. | - [ ] |
| TC-506 | "Auto-generate requirements from untracked code" | (Phase 26g feature) | Run `sentrik generate-reqs --help`. Then run `sentrik generate-reqs --dry-run` in the example project. | Command exists. Dry-run shows generated requirements without writing them. | - [ ] |
| TC-507 | "sentrik generate-reqs --push" | (Phase 26g feature) | Check `sentrik generate-reqs --help` for the `--push` flag. | The --push flag is documented and available. | - [ ] |
| TC-508 | "Work item traceability -- Team tier feature" | Pricing (Team tier) | Without a license key, attempt `sentrik reconcile`. Then set a Team-tier trial key and retry. | Feature is gated behind Team tier. Works with appropriate license. (Or verify in licensing code.) | - [ ] |
| TC-509 | "POST /api/devops/test-connection" | (API endpoint) | Start server, call `POST http://localhost:8000/api/devops/test-connection` with provider config. | Endpoint exists and returns connection test result. | - [ ] |
| TC-510 | "GET /api/work-items" | (API endpoint) | Start server, call `GET http://localhost:8000/api/work-items`. | Endpoint exists and returns work items (or empty list). | - [ ] |
| TC-511 | "POST /api/reconcile" | (API endpoint) | Start server, call `POST http://localhost:8000/api/reconcile`. | Endpoint exists and triggers reconciliation (or returns appropriate error if not configured). | - [ ] |
| TC-512 | "Generate Requirements button in dashboard" | (Dashboard feature) | Inspect dashboard.html for "Generate Requirements" button and handler. | Button and generateRequirements() function exist in source. | - [ ] |
| TC-513 | "Verify requirements -- no drift when files exist" | (verify-reqs feature) | Generate requirements with `sentrik generate-reqs` in the example project. Then run `sentrik verify-reqs`. | Output: "No drift detected — all requirements match code." Exit code 0. | - [ ] |
| TC-514 | "Verify requirements -- detects missing file drift" | (verify-reqs feature) | In `requirements.yaml`, add a source_file reference to a file that doesn't exist (e.g. `src/deleted.py`). Run `sentrik verify-reqs`. | Reports MEDIUM drift finding: "Source file 'src/deleted.py' referenced in requirement no longer exists". | - [ ] |
| TC-515 | "Verify requirements -- detects empty file drift" | (verify-reqs feature) | Empty a source file referenced in `requirements.yaml` (e.g. `Set-Content src\audit.py -Value ""`). Run `sentrik verify-reqs`. Restore file after. | Reports LOW drift finding: "Source file '...' is empty but referenced in requirement". | - [ ] |
| TC-516 | "Verify requirements -- skips rejected requirements" | (verify-reqs feature) | Edit `requirements.yaml` to set one requirement's `status: rejected`. Run `sentrik verify-reqs`. | The rejected requirement is not checked. No drift reported for it. | - [ ] |
| TC-517 | "Verify requirements -- writes drift_findings.json" | (verify-reqs feature) | Run `sentrik verify-reqs` when drift exists (e.g. missing file). Check `out/drift_findings.json`. | `out/drift_findings.json` is created with valid JSON array of drift findings. | - [ ] |
| TC-518 | "Verify requirements -- dry run skips file output" | (verify-reqs feature) | Delete `out/drift_findings.json` if it exists. Run `sentrik verify-reqs --dry-run` with drift present. | Drift printed to console but `out/drift_findings.json` is NOT created. | - [ ] |
| TC-519 | "Verify requirements -- custom requirements file path" | (verify-reqs feature) | Copy `requirements.yaml` to `custom-reqs.yaml`. Run `sentrik verify-reqs --requirements custom-reqs.yaml`. | Reads from the specified file. Output matches expectations for those requirements. | - [ ] |
| TC-520 | "Verify requirements -- missing requirements file" | (verify-reqs feature) | Ensure no `requirements.yaml` exists (or point to missing path). Run `sentrik verify-reqs`. | Error message: "Requirements file not found". Suggests running `sentrik generate-reqs`. Exit code 1. | - [ ] |
| TC-521 | "Verify requirements via API -- POST /api/verify-reqs" | (verify-reqs API) | Start server with `sentrik serve`. Run `curl -X POST http://localhost:8000/api/verify-reqs`. | Returns JSON with drift findings array (or empty array if no drift). | - [ ] |

---

## A7: Advanced Features — RBAC, Audit, Approvals, ML (16 tests)

### Prerequisites
- sentrik installed with Enterprise trial key (set GUARD_LICENSE_KEY)

---

| Test ID | Claim | Source Page | Steps to Verify | Expected Result | Pass/Fail |
|---------|-------|-------------|-----------------|-----------------|-----------|
| TC-601 | "RBAC (5 roles, 10+ permissions)" | Pricing (Enterprise tier) | With Enterprise trial key, check RBAC source at `C:\Users\mgerh\ai_sdlc_guard\src\guard\authz\models.py`. Count roles and permissions. | 5 roles exist (admin, security-lead, developer, viewer, agent). 10+ permissions defined. | - [ ] |
| TC-602 | "RBAC enforced on API endpoints" | Pricing (Enterprise tier) | Run `pytest tests/test_rbac_enforcement.py` — 51 tests verify auth enforcement with different roles (viewer, developer, admin, agent, security-lead) against all protected endpoints. | Unauthorized roles get 403, authorized roles get 200. API key gives admin access. Anonymous (auth disabled) passes all checks. | - [ ] |
| TC-603 | "Audit logging" | Pricing (Enterprise tier), Blog: IEC 62304, Use case: Medical Devices | With Enterprise key, perform several operations (scan, gate). Check if an audit log is generated. | An audit trail is recorded for scans, gates, and reconcile actions. | - [ ] |
| TC-604 | "Async approval gates" | Pricing (Enterprise tier) | Run `sentrik gate --require-approval --help`. Check for approval-related CLI commands. | The `--require-approval` flag exists. `sentrik approve` and `sentrik approval-status` commands are available. | - [ ] |
| TC-605 | "sentrik approve <id>" | (Phase 3 feature) | Run `sentrik approve --help`. | Command exists and shows usage for approving a gate request. | - [ ] |
| TC-606 | "sentrik approval-status <id>" | (Phase 3 feature) | Run `sentrik approval-status --help`. | Command exists and shows usage for checking approval status. | - [ ] |
| TC-607 | "Approval API endpoints" | (Phase 3 feature) | Inspect server.py for approval endpoints. | All four approval endpoints exist (GET /api/approvals, GET/PATCH /api/approvals/{id}, GET /api/approvals/{id}/status). | - [ ] |
| TC-608 | "ML severity estimation -- Organization tier" | Pricing (Org tier) | Check for ML severity code in the source. Verify it is license-gated. | ML severity estimation module exists. It is gated behind Org tier license. | - [ ] |
| TC-609 | "Governance profiles -- Organization tier" | Pricing (Org tier) | Check config options for governance profiles. Verify the feature exists. | Governance profile configuration option exists in config schema. | - [ ] |
| TC-610 | "Custom pack authoring and import -- Enterprise tier" | Pricing (Enterprise tier), FAQ | With Enterprise key, test importing a custom pack from a file. Without key, verify it is blocked. | Custom pack import works with Enterprise license. Blocked without it. | - [ ] |
| TC-611 | "Parallel scanning (multi-threaded) -- Team tier" | Pricing (Team tier) | With Team/Enterprise key, check if `--parallel` flag or config option exists. Verify it is license-gated. | Parallel scanning option exists and is gated behind Team tier. | - [ ] |
| TC-612 | "License keys are HMAC-signed strings that validate entirely offline" | FAQ (license keys) | Inspect licensing.py validate_key(). Confirm no network calls. | License validation succeeds offline with no network calls. | - [ ] |
| TC-613 | "No code is uploaded, no telemetry is collected, no external services are contacted" | FAQ (privacy) | Inspect scan pipeline, rules engine, ML module for network calls. | No outbound network connections during scan. httpx only in opt-in DevOps/licensing. | - [ ] |
| TC-614 | "GUARD_LICENSE_KEY environment variable" | FAQ (license keys) | Set `GUARD_LICENSE_KEY=<trial-key>` and run `sentrik scan`. Verify paid features activate. | License key is read from environment variable and features unlock accordingly. | - [ ] |
| TC-615 | "What happens when trial/license expires -- core features continue" | FAQ (expiry) | Set an expired license key (or let trial expire). Run `sentrik scan`. | Core scan/gate/report features work. Paid features are unavailable. No crash. | - [ ] |
| TC-616 | "Finding suppression via config" | FAQ (suppressions) | Add suppression config per the FAQ example. Run `sentrik scan`. Check for /api/suppressions endpoint. | Suppressed finding is marked in output. API endpoint returns suppression list. | - [ ] |

---

# Part B — Manual Tests (Human-Required)

These tests require a browser, VS Code GUI, interactive terminal, or running server with auth — they cannot be fully automated via CLI alone. Total: **40 tests**.

---

## B1: Dashboard — Browser Required (3 tests)

### Prerequisites
- sentrik server running (`sentrik serve`)
- Browser open to http://localhost:8000/dashboard

---

| Test ID | Claim | Source Page | Steps to Verify | Expected Result | Pass/Fail |
|---------|-------|-------------|-----------------|-----------------|-----------|
| TC-301 | "sentrik serve -- dashboard at localhost:8000/dashboard" | Blog: Getting Started, Pricing (Free tier) | `cd C:\Users\mgerh\sentrik-example-medfiles; sentrik serve` then open http://localhost:8000/dashboard in a browser. | Dashboard loads and shows findings from the last scan. | - [ ] |
| TC-302 | "Management dashboard" (Free tier) | Pricing | With no license key set, verify the dashboard is accessible and functional. | Dashboard works without a paid license. | - [ ] |
| TC-307 | "Dashboard shows findings, rules, governance policies, and scan trends" | Blog: Getting Started | Open dashboard. Navigate through tabs/sections. | Dashboard has sections for: findings list, rules list, governance/config, and scan trend chart. | - [ ] |

---

## B2: VS Code Extension — GUI Required (4 tests)

### Prerequisites
- VS Code or Cursor installed
- sentrik VS Code extension available (VSIX from extension source)
- Example project open in VS Code

---

| Test ID | Claim | Source Page | Steps to Verify | Expected Result | Pass/Fail |
|---------|-------|-------------|-----------------|-----------------|-----------|
| TC-401 | "Install the extension and findings appear inline on save" | Homepage (VS Code & Cursor), Blog: Getting Started | Install the sentrik VS Code extension (from VSIX if not published). Open the example project. Save a file. | Findings appear as inline diagnostics (underlines/squiggles) in the editor after save. | - [ ] |
| TC-402 | "Auto-initializes, scans in background, status bar shows count" | Homepage (VS Code & Cursor), Blog: Getting Started | Open a project folder in VS Code with the extension installed. Do not run any manual commands. | Extension auto-initializes on folder open. Status bar shows finding count. No user interaction required. | - [ ] |
| TC-403 | "Zero interaction needed" | Homepage, Blog: Getting Started | Open the example project in VS Code with the extension. Observe without clicking anything. | Scan runs automatically. Findings appear. No prompts, no wizards, no config dialogs. | - [ ] |
| TC-404 | "Works with Copilot, Cursor, Claude Code, and custom agents" | Homepage (Built for AI Agents) | Verify that the extension does not conflict with Copilot or Cursor. Open a project in Cursor with sentrik extension installed. | Both tools work simultaneously without errors or conflicts. | - [ ] |

---

## B3: Interactive Terminal (2 tests)

| Test ID | Claim | Source Page | Steps to Verify | Expected Result | Pass/Fail |
|---------|-------|-------------|-----------------|-----------------|-----------|
| TC-406 | "sentrik init -- interactive wizard" | Blog: Getting Started, FAQ | Run `sentrik init` (without --no-interactive) in a new directory. | An interactive wizard prompts for project settings and creates `.sentrik/config.yaml`. | - [ ] |
| TC-407 | "sentrik init shows trial hint + docs/GitHub links after setup" | (Community feature) | Run `sentrik init` and observe the post-setup output. | Output includes a hint about docs and GitHub links after interactive setup. | - [ ] |

---

## B5: Website and Docs Verification — Browser Required (23 tests)

### Prerequisites
- Website built and running locally: `cd C:\Users\mgerh\sentra-website; npm run dev`
- Docs site accessible at https://docs.sentrik.dev (or built locally)
- Browser with DevTools available
- Mobile device or browser responsive mode

---

| Test ID | Claim | Source Page | Steps to Verify | Expected Result | Pass/Fail |
|---------|-------|-------------|-----------------|-----------------|-----------|
| TC-701 | All internal page links work | All pages | Click every internal link on every page: Homepage, Pricing, About, Support, FAQ, all use-case pages, all blog posts. | No broken links. Every link navigates to the correct page. | - [ ] |
| TC-702 | Docs link (maxgerhardson.github.io/sentrik-docs) loads | Homepage, About, Support, FAQ | Click the "Read the Docs" link on the homepage. | Docs site loads with correct content. | - [ ] |
| TC-703 | GitHub Discussions link works | Support, FAQ | Click the GitHub Discussions link on Support and FAQ pages. | https://github.com/maxgerhardson/sentrik-community/discussions loads (or repo exists). | - [ ] |
| TC-704 | Bug report link works | Support | Click the "Report a Bug" link on the Support page. | GitHub new issue form opens with the bug_report.yml template. | - [ ] |
| TC-705 | Email links (mailto:) are correct | About, Support, Pricing | Click email links: support@sentrik.dev, info@sentrik.dev, sales@sentrik.dev. | Email client opens with correct address and subject line. | - [ ] |
| TC-706 | Pricing page -- 4 tiers displayed correctly | Pricing | Open pricing page. Verify all 4 tiers: Free ($0), Team ($29), Organization ($99), Enterprise (Custom). | All tiers shown with correct prices, features, and CTA buttons. | - [ ] |
| TC-707 | Pricing -- Free tier feature list accurate | Pricing | Cross-reference each Free tier bullet with actual product. | Every bullet is verified as accurate by Part A tests. | - [ ] |
| TC-708 | Pricing -- Team tier feature list accurate | Pricing | Cross-reference Team tier bullets: PR decoration, work item traceability, auto-patching, parallel scanning, email support. | Each feature exists and is correctly tier-gated. | - [ ] |
| TC-709 | Pricing -- Organization tier feature list accurate | Pricing | Cross-reference Org tier bullets: all 12 packs, pack overrides, ML severity, governance profiles, priority email support. | Each feature exists and is correctly tier-gated. | - [ ] |
| TC-710 | Pricing -- Enterprise tier feature list accurate | Pricing | Cross-reference Enterprise tier bullets: custom pack authoring/import, audit logging, async approval gates, RBAC, dedicated support. | Each feature exists and is correctly tier-gated. | - [ ] |
| TC-711 | FAQ -- all 22 questions expand and display answers | FAQ | Click each of the 22 FAQ items. | All expand/collapse correctly. No broken formatting. | - [ ] |
| TC-712 | Blog posts render correctly | Blog index, all 3 posts | Navigate to each blog post. Check formatting, code blocks, links. | All 3 posts render without broken HTML. | - [ ] |
| TC-713 | Use-case pages render correctly | Medical Devices, Fintech, SaaS | Open all 3 use-case pages. Check content, formatting, CTAs. | All pages render correctly. CTAs link to correct pages. | - [ ] |
| TC-714 | Mobile responsive -- homepage | Homepage | Open homepage in mobile view (375px width). | Layout stacks to single column. No horizontal overflow. | - [ ] |
| TC-715 | Mobile responsive -- pricing | Pricing | Open pricing page in mobile view. | Tier cards stack vertically. All content readable. | - [ ] |
| TC-716 | Mobile responsive -- FAQ | FAQ | Open FAQ in mobile view. | Accordions work. Text is readable. No overflow. | - [ ] |
| TC-717 | Docs site -- CLI reference page loads | Support (CLI Reference link) | Click the CLI Reference link on the Support page. | Page loads with content. | - [ ] |
| TC-718 | Docs site -- configuration page loads | Blog: Getting Started (what's next links) | Click the configuration reference link. | Page loads with content. | - [ ] |
| TC-719 | Docs site -- standards packs overview loads | Blog: Getting Started (what's next links) | Click the standards packs link. | Page loads with content. | - [ ] |
| TC-720 | Docs site -- custom pack authoring guide loads | FAQ (custom rules link) | Click the custom pack authoring link in the FAQ. | Page loads with content. | - [ ] |
| TC-721 | Docs site -- medical device walkthrough loads | Blog: IEC 62304 (link at bottom) | Click the medical device walkthrough link. | Page loads with content. | - [ ] |
| TC-722 | Docs site -- CI/CD integration guide loads | FAQ (Azure Pipelines answer) | Click the CI/CD integration guide link. | Page loads with content. | - [ ] |
| TC-723 | Docs site -- dashboard guide loads | Blog: Getting Started (what's next links) | Click the dashboard guide link. | Page loads with content. | - [ ] |

---

## B6: Partial Tests (2 tests)

These tests were partially verified by AI but have aspects requiring human confirmation.

| Test ID | Claim | What AI Verified | What Needs Human Verification | Pass/Fail |
|---------|-------|------------------|-------------------------------|-----------|
| TC-004 | "OWASP Top 10 -- Auto-enabled" | OWASP rules fire in auto-detect mode | Confirm CLI output clearly shows "OWASP Top 10" as active pack name | - [ ] |
| TC-013 | "All enterprise features unlocked (trial)" | `sentrik approve --help` and `sentrik license` work | No way to generate trial key since `trial` command removed — verify alternative flow | - [ ] |

---

# Claim Accuracy Flags

These items are not test cases but claims that need to be updated or verified before launch:

| Flag ID | Issue | Source Page | Action Required |
|---------|-------|-------------|-----------------|
| FLAG-001 | `npm install -g sentrik` shown everywhere but npm package is not published | Homepage, Pricing, FAQ, Blog, Use cases | Either publish the npm package before launch OR change install instructions to `pip install sentrik`. |
| FLAG-002 | "Auto-patching" listed as Team tier feature | Pricing | Verify auto-patching feature exists and is functional. If not implemented, remove from pricing or mark as "coming soon". |
| FLAG-003 | "sentrik migrate" command mentioned in FAQ | FAQ | Verify `sentrik migrate` command exists. If not, remove from FAQ or implement. |
| FLAG-004 | "sentrik report --format html" mentioned in blog | Blog: IEC 62304 | Verify this exact command syntax works. The scan may auto-generate reports instead. |
| FLAG-005 | Free tier claims "PR decoration" and "work item traceability" but Pricing lists these as Team tier | Pricing vs FAQ | The FAQ says "The free tier includes...work item traceability, PR decoration" but Pricing lists these under Team ($29). Resolve the contradiction. |
| FLAG-006 | "sentrik list-packs" command referenced in FAQ | FAQ | Verify this command exists. If the actual command is different, update the FAQ. |
| FLAG-007 | About page shows docs link text as "docs.sentrik.dev" but href goes to GitHub Pages | About | Either acquire docs.sentrik.dev domain or change display text to match the actual URL. |
| FLAG-008 | Blog post says results written to "out/report.md" | Blog: Getting Started | Verify the actual report filename. It may be report.html or report.sarif instead. |
| FLAG-009 | Combined rule count for PCI+SOC2+OWASP | Use case: Fintech | Updated rule counts: 33 (PCI) + 30 (SOC2) + 69 (OWASP) = 132 total rules. Note: the website may show "checks" (unique check types) not total rules. Verify that the website Fintech page reflects accurate numbers. |
| FLAG-010 | Pricing Team tier lists "auto-patching" but FAQ/homepage "Built for AI Agents" says "auto-patching" | Homepage, Pricing | Verify auto-patching is implemented and correctly tier-gated. |

---

## Test Summary Template

| Section | Tests | Category |
|---------|-------|----------|
| Part A — Automated | 102 | AI-executable (CLI, source inspection, API, pytest) |
| Part B — Manual | 32 | Human-required (browser, VS Code, interactive) |
| Part B — Partial | 2 | Partially automated, needs human confirmation |
| **Total** | **141** | |
