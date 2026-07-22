# SECURITY LEVEL 1 - CHECKLIST

## BASELINE
- [ ] Frontend is not being used as a real security layer
- [ ] All external input is validated
- [ ] Output encoding/sanitization is present where needed

## TYPES
- [ ] TypeScript strict mode enabled
- [ ] No unjustified `any`
- [ ] Runtime validation exists for external input

## DANGEROUS EXECUTION
- [ ] No `eval()`
- [ ] No `new Function()`
- [ ] No `setTimeout(string)` or `setInterval(string)`

## DEPENDENCIES
- [ ] Lockfile exists
- [ ] No careless floating versions
- [ ] New dependencies are justified

## SECRETS / LOGGING
- [ ] No secrets in frontend
- [ ] No secrets in logs
- [ ] No production stack trace exposure

## UPLOAD / HTTP
- [ ] Upload validation exists if uploads are supported
- [ ] HTTPS and secure cookie policy are defined

## AI AUDIT
- [ ] Hacker-style self-audit completed
- [ ] At least 3 weaknesses checked
- [ ] Fixes applied or explicitly documented
