/* Shared interaction helpers for scroll lanes and detail sheet. */
export function enableDragScroll(container) {
  if (!container) return;
  let pressed = false;
  let moved = false;
  let startX = 0;
  let scrollLeft = 0;

  container.addEventListener("pointerdown", (event) => {
    pressed = true;
    moved = false;
    startX = event.pageX;
    scrollLeft = container.scrollLeft;
    container.classList.add("is-dragging");
    container.setPointerCapture?.(event.pointerId);
  });

  container.addEventListener("pointermove", (event) => {
    if (!pressed) return;
    const distance = event.pageX - startX;
    if (Math.abs(distance) > 4) moved = true;
    container.scrollLeft = scrollLeft - distance;
  });

  const endDrag = () => {
    pressed = false;
    container.classList.remove("is-dragging");
  };

  container.addEventListener("pointerup", endDrag);
  container.addEventListener("pointercancel", endDrag);
  container.addEventListener("pointerleave", endDrag);

  container.addEventListener("click", (event) => {
    if (moved) {
      event.preventDefault();
      event.stopPropagation();
      moved = false;
    }
  }, true);
}

export function bindDetailSheet(sheet, actions) {
  sheet.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (!action) return;
    if (action === "close-detail") actions.close();
    if (action === "pick-current") actions.pickCurrent();
    if (action === "jump-related") actions.next();
  });
}
