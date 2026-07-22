# BACKEND-FIRST ENFORCEMENT - QUICK EXAMPLES

## EXAMPLE 1 - REWARD CLAIM
WRONG:
- frontend checks child points
- frontend subtracts points
- frontend sets reward request status = approved

RIGHT:
- frontend submits reward request
- backend verifies identity, family scope, points, reward rules, cooldown, and status transition
- backend writes canonical result
- frontend renders backend response

## EXAMPLE 2 - DISCOUNT / PRICE
WRONG:
- frontend computes final payable amount and sends it as trusted total

RIGHT:
- frontend sends selected items / coupon
- backend validates coupon, stock rules, user eligibility, usage limit, and returns canonical total

## EXAMPLE 3 - ADMIN APPROVAL
WRONG:
- frontend hides approve button from non-admin and assumes that is enough

RIGHT:
- frontend may hide button for UX
- backend still verifies admin permission and valid transition before approval

## EXAMPLE 4 - FILE UPLOAD
WRONG:
- frontend checks extension and assumes file is safe

RIGHT:
- frontend may preview file
- backend validates size, MIME, extension, ownership, storage path, and acceptance rules
