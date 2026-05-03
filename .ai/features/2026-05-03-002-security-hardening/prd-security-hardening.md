# Feature: Basic Security Check & Automated Auditing

## Overview
This feature implements a comprehensive security layer for the Campaign Manager application. It includes automated auditing for dependencies, secret detection, and hardening the full-stack infrastructure against OWASP Top 10 vulnerabilities.

## User Stories
- As a developer, I want to automatically check for vulnerable dependencies in both Laravel and React so I can update them before they are exploited.
- As a system administrator, I want to scan the codebase for hardcoded secrets (API keys, tokens) to prevent accidental exposure in version control.
- As a security officer, I want to verify that the application follows best practices for CSRF, XSS, and broken access control.

## Acceptance Criteria
- [x] Dedicated **Security Expert Skill** implemented with documentation and automated scripts.
- [x] Automated dependency auditing integrated (`npm audit`, `composer audit`).
- [x] Regexp-based secret scanner to detect hardcoded API keys and tokens.
- [x] Backend configuration audit (detection of `APP_DEBUG=true` in non-local environments).
- [ ] Implement global **Rate Limiting** on the Laravel API to prevent Brute Force/DoS.
- [ ] Configure **Secure Security Headers** (CSP, XSTS, X-Frame-Options) in the backend.
- [ ] Verification of **CSRF protection** for all state-changing API endpoints.
- [ ] Verification of **XSS protection** in React (ensuring no `dangerouslySetInnerHTML` without sanitization).

## Out of Scope
- Full penetration testing or bounty program.
- Implementation of an IDS/IPS (Intrusion Detection/Prevention System).
- Hardware-level security audits.

## Technical Notes
- The `security-expert` skill uses a custom `audit.cjs` script to orchestrate multiple security checks.
- Laravel's native validation and authorization (Policies/Gates) are the primary defense against IDOR and Injection.
- React's default escaping is the primary defense against XSS.

## UI/UX Notes
- Security errors (e.g., 403 Forbidden, 429 Too Many Requests) should be handled gracefully with user-friendly messages on the frontend.
- No sensitive error details (stack traces) should be shown to the end user in production (`APP_DEBUG=false`).
