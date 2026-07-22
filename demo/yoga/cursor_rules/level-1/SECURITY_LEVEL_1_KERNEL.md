# SECURITY LEVEL 1 - KERNEL

## PURPOSE
Level 1 is the minimum mandatory security baseline for every website or app.
This level applies to landing pages, blogs, portfolio sites, mini tools, and any project that may still receive user input.

## TRUST BOUNDARY
- Never trust client input.
- Frontend is a UX layer, not a trusted security layer.
- Hidden fields, query params, local state, CSS hiding, disabled buttons, or client flags MUST NOT be used as security controls.
- Role, permission, user_id, owner_id, tenant_id, price, discount, status, or feature access values from client input MUST be treated as untrusted.

## INPUT / OUTPUT SAFETY
- All request body, query params, route params, form fields, headers, and local persisted data MUST be validated.
- Validation MUST be explicit and schema-based where possible.
- Never render raw HTML from untrusted input without approved sanitization.
- Never build SQL, shell commands, file paths, or HTML using unsafe string concatenation.
- Output MUST be encoded based on rendering context.

## STRICT TYPING ENFORCEMENT
- All frontend and backend TypeScript projects MUST use `"strict": true`.
- Use of `any` is FORBIDDEN unless justified with a short inline comment.
- All external data MUST be typed and runtime-validated.
- Type assertions MUST NOT be used to bypass validation.
- Functions MUST define explicit input and output types when practical.

## DANGEROUS EXECUTION PROHIBITION
- `eval()` is STRICTLY FORBIDDEN.
- `new Function()` is FORBIDDEN.
- `setTimeout(string)` and `setInterval(string)` are FORBIDDEN.
- Never execute user-provided input as code.
- Dynamic behavior MUST use predefined handlers, maps, or config objects.

## DEPENDENCY SECURITY
- Every JavaScript or TypeScript project MUST use a lockfile.
- Allowed lockfiles:
  - `package-lock.json`
  - `pnpm-lock.yaml`
  - `yarn.lock`
- Floating versions such as `*` are FORBIDDEN.
- Critical runtime dependencies SHOULD avoid careless floating ranges.
- Prefer native APIs over unnecessary third-party packages.
- New dependencies MUST be checked for maintenance quality and necessity.

## SECRET MANAGEMENT
- Secrets MUST NOT be hardcoded in source files.
- Secrets MUST NOT be stored in frontend bundles.
- Real `.env` secrets MUST NOT be committed.
- Tokens, passwords, OTP, cookies, API keys, and credentials MUST NOT be logged.

## ERROR HANDLING
- Production responses MUST NOT expose stack traces.
- Errors MUST fail safely, not fail open.
- Security-sensitive failures MUST return generic client-safe messages.

## LOGGING
- Log important failures such as auth failure, permission denial, upload rejection, rate-limit events, and suspicious behavior.
- Logging MUST exclude secrets and sensitive raw payloads.

## HTTP / BROWSER SAFETY
- Production must use HTTPS.
- Sensitive cookies must use `HttpOnly`, `Secure`, and appropriate `SameSite`.
- Security headers should be configured by default.

## UPLOAD SAFETY
- Every upload MUST validate size, type, extension, and storage path.
- Never trust the original filename.
- Never allow direct execution from uploaded files.

## AI SELF-AUDIT ENFORCEMENT
- After generating or modifying security-relevant code, AI MUST perform a self-audit.
- Required prompt:
  "Act as a black-hat hacker. Identify at least 3 potential vulnerabilities, logic flaws, or attack vectors in the code above. Focus on access control bypass, input manipulation, injection vectors, state inconsistencies, and edge cases."
- AI MUST NOT claim code is secure or production-ready without this audit step.
