# Tasks: Basic Security Check

### Phase 1: Automation & Auditing (Completed)
- [x] Create `security-expert` skill directory and documentation.
- [x] Implement `audit.cjs` script for dependency and config scanning.
- [x] Implement initial secret scanner with regex patterns.
- [x] Run initial security audit and analyze results (`APP_DEBUG` check).
- [x] Verify backend validation (FormRequests) and authorization (Policies) patterns.

### Phase 2: Roadmapped Hardening (Future Developments)
- [ ] Implement global `RateLimiting` on the upload endpoint (as per README).
- [ ] Configure `Security Headers` (CSP, HSTS) for production readiness.
- [ ] Implement `Authentication` (Sanctum/JWT) to secure API access.
- [ ] Review `Frontend` components for any `dangerouslySetInnerHTML` usage.
- [ ] Verify CSRF token handling for Axios in `api.ts`.
- [ ] Update production `.env` to disable `APP_DEBUG`.

### Phase 3: Validation
- [ ] Run a final automated audit to confirm zero vulnerabilities.
- [ ] Generate final security compliance report.
