# SENTRIK — Governance Runtime for AI-Generated Code

## What is SENTRIK

SENTRIK is a governance runtime that enforces regulatory and security compliance on every line of code before it reaches production. It ships with six named standards packs — IEC 62304, OWASP Top 10, SOC 2, HIPAA, PCI DSS, and ISO 27001 — totaling 97 rules that map directly to regulatory clauses. It works out of the box: install it, run `sentrik scan`, and get a compliance score in seconds. No configuration files, no rule tuning, no consultant engagement. SENTRIK integrates into your existing CI/CD pipeline, decorates pull requests with findings, gates merges on compliance thresholds, and creates traceable work items in Jira, Azure DevOps, or GitHub Issues.

---

## The Problem: AI Code Moves Fast, Compliance Does Not

Teams adopting AI coding assistants (Copilot, Cursor, Claude Code) are shipping code faster than ever. But speed creates a dangerous gap:

- **Regulatory bodies have not relaxed their requirements.** IEC 62304 still demands documented traceability. HIPAA still requires access-control safeguards. PCI DSS still mandates input validation and secret management. The rules are the same whether a human or an LLM wrote the code.
- **AI-generated code introduces novel compliance risks.** LLMs produce code that works but routinely includes hardcoded secrets, uses deprecated cryptographic functions, omits audit logging, and skips input sanitization. These are not theoretical risks; they are measurable, recurring patterns.
- **Traditional SAST tools find vulnerabilities, not compliance violations.** A Semgrep rule can flag `eval()`. It cannot tell you that `eval()` in a medical device data pipeline violates IEC 62304 Class C software requirements, create a traceable work item for it, and block the PR until it is resolved.
- **Compliance mapping is manual, fragile, and expensive.** Today, most teams maintain spreadsheets that map tool findings to regulatory clauses. Auditors get stale PDFs. There is no live compliance score, no automated traceability, and no single source of truth.

The result: engineering teams face a choice between shipping fast with AI assistance or maintaining the compliance posture their industry demands. SENTRIK eliminates that tradeoff.

---

## How SENTRIK Solves It

### Zero-Config Onboarding
SENTRIK auto-detects your project type, languages, and CI platform. Run `npm install -g sentrik && sentrik scan` in any repository and get results immediately. No YAML to write, no rules to configure, no plugins to install. For teams that want control, SENTRIK supports full configuration via `.sentrik/config.yaml` and three governance profiles (strict, standard, permissive).

### Named Regulatory Standards Packs
Six packs ship built-in, each mapping rules to specific regulatory clauses:

| Pack | Rules | Example Clause Coverage |
|------|-------|------------------------|
| IEC 62304 | 14 | Software unit verification, anomaly documentation |
| OWASP Top 10 | 22 | Injection, broken access control, cryptographic failures |
| SOC 2 | 16 | Change management, access controls, logging |
| HIPAA | 15 | PHI access safeguards, audit controls, encryption |
| PCI DSS | 16 | Input validation, secret management, secure defaults |
| ISO 27001 | 14 | Information security controls, incident response |

Custom pack authoring allows teams to define organization-specific rules and map them to internal policies or additional standards.

### CI/CD Gating and PR Decoration
SENTRIK posts findings directly on pull requests in GitHub and Azure DevOps. It gates merges based on compliance thresholds — configurable by severity, by pack, or by governance profile. Failed gates include actionable remediation guidance, not just rule IDs.

### Work Item Traceability
Findings automatically create, update, and close work items in Jira, Azure DevOps, or GitHub Issues. When a developer fixes a finding and the next scan passes, SENTRIK closes the corresponding work item. Auditors get end-to-end traceability from finding to fix to closure without anyone touching a spreadsheet.

### Auto-Patching
SENTRIK applies deterministic, rule-based fixes using three strategies: remove offending lines, comment them out for review, or replace them with compliant alternatives. These are not LLM-generated suggestions — they are predictable, auditable transformations.

### Auto-Generated Requirements
Untracked code files are detected and SENTRIK generates draft requirements, pushing them to your DevOps platform. This closes the traceability gap between code and requirements that auditors consistently flag.

### Compliance Dashboard and Reporting
A management dashboard shows a live compliance score (percentage of rules with zero findings) across all scanned repositories. Export reports in HTML, JUnit, SARIF, or CSV. Export a complete audit bundle as a zip archive for auditor handoff.

### Enterprise Controls
RBAC with five roles and ten-plus permissions. OAuth integration for Azure DevOps, GitHub, and Jira. Audit logging. ML-based severity estimation. Parallel scanning for large codebases. A REST API with 25+ endpoints for integration with internal tooling.

---

## Competitive Comparison

| Capability | SENTRIK | Semgrep | SonarQube | Snyk | Checkmarx | Veracode | Aikido | CodeScene |
|---|---|---|---|---|---|---|---|---|
| Zero-config scanning | Yes | No | No | Partial | No | No | Partial | No |
| Named regulatory standards packs | 6 packs, 97 rules | Community rules only | Limited (CWE mapping) | CWE/CVE mapping | Compliance reports (add-on) | Policy-based (add-on) | SOC 2/HIPAA/ISO monitoring | None |
| Code-level clause enforcement | Yes | No | No | No | Partial | Partial | No (posture monitoring) | No |
| PR decoration (GitHub + Azure) | Yes | Yes | Yes (plugin) | Yes | Yes | No | Yes | No |
| CI/CD gating on compliance | Yes | Yes (security) | Yes (quality gate) | Yes (security) | Yes (security) | Yes (security) | Yes | No |
| Work item traceability | Auto-create/update/close | No | Jira (manual) | Jira (manual) | Jira (plugin) | No | Jira/Linear | No |
| Auto-patching | Deterministic, 3 strategies | Autofix (limited) | No | Fix PRs (dependency) | No | No | AI Autofix | No |
| Auto-generate requirements | Yes | No | No | No | No | No | No | No |
| Compliance score dashboard | Yes | No | Quality metrics | Security score | Risk dashboard | Risk score | Security posture | Tech debt score |
| Audit bundle export | Yes | No | No | No | Compliance reports | Compliance reports | No | No |
| Custom pack authoring | Yes | Yes | Yes | No | Yes | No | No | No |
| Python/TypeScript/Go support | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| VS Code / Cursor extension | Yes | Yes | Yes | Yes | Yes | No | No | No |
| Pre-commit hooks | Yes | Yes | Yes (plugin) | No | No | No | No | No |
| RBAC | 5 roles, 10+ permissions | Team-based | Project roles | Org roles | Project roles | Team-based | Org roles | No |
| Self-hosted option | Yes | Yes | Yes | No | Yes | No | No | No |
| Pricing transparency | Published tiers | Published | Published (with Enterprise add-ons) | Published | Contact sales | Contact sales | Published | Published |

---

## What Only SENTRIK Does

### 1. Regulatory Clause Enforcement, Not Just Vulnerability Detection

Traditional SAST tools answer the question "Is this code vulnerable?" SENTRIK answers "Does this code comply with IEC 62304 clause 5.5.3?" That distinction matters in regulated industries where auditors do not accept a list of CVEs as evidence of compliance. Each SENTRIK rule maps to a specific regulatory clause, and every finding includes the clause reference, the rationale, and the remediation path.

### 2. Closed-Loop Work Item Traceability

SENTRIK is the only tool that automatically creates work items from findings, updates them as code changes, and closes them when the finding is resolved — across Jira, Azure DevOps, and GitHub Issues. This produces the auditable paper trail that regulatory frameworks demand without requiring developers to manually maintain traceability matrices.

### 3. Auto-Generated Requirements from Untracked Code

When SENTRIK detects code that lacks corresponding requirements, it generates draft requirements and pushes them to your DevOps platform. No other scanning tool bridges the gap between code implementation and requirements documentation. This directly addresses the traceability findings that dominate IEC 62304 and SOC 2 audit non-conformities.

### 4. Zero-Config with Governance Profiles

Most compliance tools require weeks of configuration before they produce useful results. SENTRIK auto-detects the project, selects relevant packs, and scans immediately. Teams that need fine-grained control choose from three governance profiles (strict, standard, permissive) or author custom packs. The zero-to-value time is under 60 seconds.

---

## Who SENTRIK Is For

### By Role

- **Engineering leads** who need to ship AI-assisted code without slowing down for compliance reviews.
- **Security engineers** who want automated enforcement of security standards with real-time dashboards, not quarterly spreadsheet audits.
- **Quality/regulatory affairs managers** who need auditor-ready evidence packages with full traceability from finding to fix.
- **DevOps engineers** who want compliance gating that integrates natively with their existing CI/CD pipelines, PR workflows, and issue trackers.

### By Industry

- **Medical devices** — IEC 62304 compliance for software of unknown provenance (SOUP), including AI-generated code. Automated traceability from code to requirements to work items.
- **Financial services** — SOC 2, PCI DSS, and ISO 27001 enforcement across trading platforms, payment systems, and banking applications.
- **Healthcare IT** — HIPAA safeguard verification for applications handling PHI, with audit bundle export for OCR investigations.
- **SaaS / Cloud** — SOC 2 and OWASP Top 10 enforcement for teams shipping rapidly with AI coding assistants and needing continuous compliance evidence.
- **Defense and government** — ISO 27001 and custom pack support for organizations with internal security frameworks that extend beyond public standards.

---

## Getting Started

```bash
# Install globally
npm install -g sentrik

# Scan any repository immediately
cd your-project
sentrik scan

# Gate a PR in CI
sentrik gate --threshold strict

# Generate a trial license (30-day Enterprise)
sentrik trial
```

SENTRIK works with GitHub Actions, Azure Pipelines, GitLab CI, and any CI system that runs Node.js or Python. The VS Code and Cursor extension provides inline diagnostics on save with zero configuration.

**Documentation:** [docs.sentrik.dev](https://docs.sentrik.dev)
**Pricing:** [sentrik.dev/pricing](https://sentrik.dev/pricing)
**Contact:** hello@sentrik.dev
