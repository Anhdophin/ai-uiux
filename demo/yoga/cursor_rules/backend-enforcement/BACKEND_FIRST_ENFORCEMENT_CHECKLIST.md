# BACKEND-FIRST ENFORCEMENT - CHECKLIST

## OWNERSHIP OF LOGIC
- [ ] Trust, access, money, status, and persistence rules are in backend
- [ ] Frontend is thin and presentation-focused
- [ ] No critical workflow decision exists only in browser code

## VALIDATION
- [ ] Backend validates all mutation inputs
- [ ] Frontend validation is only UX support, not the final gate

## AUTHORIZATION
- [ ] Backend checks role/permission/ownership
- [ ] No frontend-only protection is relied upon

## STATUS / WORKFLOW
- [ ] Backend controls status transitions
- [ ] Browser cannot set final authoritative states directly

## INTEGRATIONS / SECRETS
- [ ] Secret-bearing calls are kept server-side
- [ ] Webhook/callback trust is verified in backend

## FINAL REVIEW
- [ ] Could DevTools manipulation bypass this feature?
- [ ] If yes, logic has been moved to backend
