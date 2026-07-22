# AI Build Rules for Dynamic CV

1. Always render role cards first.
2. Never hard-code core role, group, item, or detail content into HTML.
3. The first meaningful layer after role selection must be group blocks and info bars.
4. Group blocks must contain captions inside the block.
5. Info bars may only show `!` when detail data exists.
6. Detail surfaces must support rich content, not plain alert text.
7. Role switching must preserve a clear exit-then-enter transition.
8. Animations must remain controlled and readable.
9. Reduced-motion users must still receive a clean usable interface.
10. The scaffold should remain modular so new roles and items can be added through JSON.
