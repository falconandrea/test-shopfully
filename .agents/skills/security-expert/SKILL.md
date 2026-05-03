---
name: security-expert
description: Senior Security Engineer for full-stack applications. Conducts vulnerability audits (OWASP Top 10), dependency analysis, and secure code reviews for Laravel and React. Use this skill to identify security risks, scan for secrets, and implement defensive coding patterns.
---

# Security Expert Skill

Expert guide and automation toolset for auditing and securing Laravel (Backend) and React (Frontend) applications.

## When to Use This Skill

- Conducting a security audit on a new or existing codebase.
- Reviewing code for vulnerabilities (XSS, SQLi, CSRF, IDOR).
- Scanning for hardcoded secrets, API keys, or insecure configurations.
- Auditing dependencies for known vulnerabilities.
- Implementing authentication or authorization logic.

## Core Concepts

### 1. OWASP Top 10 Focus
| Category | focus in this Project |
| -------- | --------------------- |
| **Broken Access Control** | Validate `authorize()` calls in Laravel and route guards in React. |
| **Cryptographic Failures** | Ensure sensitive data is encrypted and HTTPS is enforced. |
| **Injection** | Enforce parameter binding in Laravel and prevent `dangerouslySetInnerHTML` in React. |
| **Insecure Design** | Review architectural decisions for logical flaws. |
| **Security Misconfiguration** | Check `APP_DEBUG`, `.env` exposure, and CORS settings. |
| **Vulnerable Components** | Run `npm audit` and `composer audit` regularly. |

### 2. Audit Workflow

1. **Automated Scan**: Run the included audit script to catch low-hanging fruit.
   ```bash
   node .agents/skills/security-expert/scripts/audit.cjs
   ```
2. **Static Analysis**: Review Controllers and Components for common anti-patterns.
3. **Secret Detection**: Scan the codebase for patterns resembling API keys or tokens.
4. **Remediation**: Categorize findings by severity and provide secure code examples.

## Tools & Scripts

### 1. Automated Audit (`audit.cjs`)
Runs dependency checks and basic secret scans.

### 2. Secret Scanner (`secrets-scan.cjs`)
Regex-based scanner for API keys, tokens, and sensitive strings.

### 3. Laravel Security Check
Checks for common Laravel misconfigurations (CSRF, mass assignment, debug mode).

## Secure Coding Principles

### Laravel (Backend)
- **Validation**: Never trust user input. Use `FormRequest`.
- **Authorization**: Use `Gate` or `Policy` for every endpoint.
- **Mass Assignment**: Use `$fillable` or `$guarded` strictly.
- **CSRF**: Ensure `VerifyCsrfToken` middleware is active.

### React (Frontend)
- **XSS Prevention**: Let React handle escaping. Avoid `dangerouslySetInnerHTML`.
- **Data Storage**: Don't store sensitive info (like passwords) in `localStorage`.
- **Content Security Policy (CSP)**: Implement headers to restrict resource loading.

---
*Maintained by the Security Expert Agent.*
