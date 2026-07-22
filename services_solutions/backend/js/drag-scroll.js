export function enableHorizontalDragScroll(container) {
  if (!container || container.dataset.dragScrollBound === 'true') return;

  container.dataset.dragScrollBound = 'true';

  let isPointerDown = false;
  let isDragging = false;
  let suppressClick = false;
  let pointerId = null;
  let startX = 0;
  let startScrollLeft = 0;
  let lastX = 0;
  let lastTime = 0;
  let velocity = 0;
  let momentumRaf = null;

  function canScroll() {
    return container.scrollWidth > container.clientWidth + 2;
  }

  function stopMomentum() {
    if (!momentumRaf) return;
    cancelAnimationFrame(momentumRaf);
    momentumRaf = null;
  }

  function getNearestSnapLeft() {
    const items = Array.from(container.children);
    if (!items.length) return container.scrollLeft;

    const current = container.scrollLeft;
    let nearest = current;
    let nearestDistance = Number.POSITIVE_INFINITY;

    items.forEach((item) => {
      const left = item.offsetLeft;
      const distance = Math.abs(left - current);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = left;
      }
    });

    const maxLeft = Math.max(0, container.scrollWidth - container.clientWidth);
    return Math.max(0, Math.min(nearest, maxLeft));
  }

  function snapToNearest() {
    const targetLeft = getNearestSnapLeft();
    container.scrollTo({ left: targetLeft, behavior: 'smooth' });
  }

  function startMomentum() {
    if (!canScroll() || Math.abs(velocity) < 0.08) {
      snapToNearest();
      return;
    }

    const maxLeft = Math.max(0, container.scrollWidth - container.clientWidth);
    let frameVelocity = velocity * 18;

    const step = () => {
      frameVelocity *= 0.92;

      if (Math.abs(frameVelocity) < 0.18) {
        momentumRaf = null;
        snapToNearest();
        return;
      }

      const next = Math.max(0, Math.min(maxLeft, container.scrollLeft - frameVelocity));
      container.scrollLeft = next;

      if (next === 0 || next === maxLeft) {
        momentumRaf = null;
        snapToNearest();
        return;
      }

      momentumRaf = requestAnimationFrame(step);
    };

    momentumRaf = requestAnimationFrame(step);
  }

  function onPointerDown(event) {
    if (!canScroll()) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    stopMomentum();
    isPointerDown = true;
    isDragging = false;
    pointerId = event.pointerId;
    startX = event.clientX;
    startScrollLeft = container.scrollLeft;
    lastX = event.clientX;
    lastTime = performance.now();
    velocity = 0;
  }

  function onPointerMove(event) {
    if (!isPointerDown || pointerId !== event.pointerId) return;

    const deltaX = event.clientX - startX;

    if (!isDragging) {
      if (Math.abs(deltaX) <= 4) return;
      isDragging = true;
      container.classList.add('is-dragging');
      try {
        container.setPointerCapture(event.pointerId);
      } catch {
        // Ignore if capture is unsupported.
      }
    }

    event.preventDefault();
    container.scrollLeft = startScrollLeft - deltaX;

    const now = performance.now();
    const elapsed = Math.max(1, now - lastTime);
    const deltaMove = event.clientX - lastX;
    velocity = deltaMove / elapsed;
    lastX = event.clientX;
    lastTime = now;
  }

  function onPointerEnd(event) {
    if (!isPointerDown || pointerId !== event.pointerId) return;

    isPointerDown = false;
    pointerId = null;
    container.classList.remove('is-dragging');

    if (isDragging) {
      suppressClick = true;
      setTimeout(() => {
        suppressClick = false;
      }, 180);
      startMomentum();
    }

    isDragging = false;
  }

  function onClickCapture(event) {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
  }

  container.addEventListener('pointerdown', onPointerDown);
  container.addEventListener('pointermove', onPointerMove, { passive: false });
  container.addEventListener('pointerup', onPointerEnd);
  container.addEventListener('pointercancel', onPointerEnd);
  container.addEventListener('mouseleave', () => {
    if (!isPointerDown || !isDragging) return;
    isPointerDown = false;
    pointerId = null;
    container.classList.remove('is-dragging');
    startMomentum();
    isDragging = false;
  });
  container.addEventListener('click', onClickCapture, true);
}
