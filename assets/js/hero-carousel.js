(() => {
  const carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;
  const slides = [...carousel.querySelectorAll('.hero-carousel-slide')];
  const dots = [...carousel.querySelectorAll('.hero-carousel-dots button')];
  const status = carousel.querySelector('.hero-carousel-status');
  const pauseButton = carousel.querySelector('.hero-carousel-pause');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const INTERVAL_MS = 5000;
  let current = 0;
  let playing = !reducedMotion.matches;
  let hovering = false;
  let timer;
  let touchStart;

  const updatePauseButton = () => {
    if (!pauseButton) return;
    pauseButton.setAttribute('aria-pressed', String(!playing));
    pauseButton.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
    const icon = pauseButton.querySelector('i');
    if (icon) icon.className = playing ? 'bi bi-pause-fill' : 'bi bi-play-fill';
  };
  const schedule = () => {
    clearInterval(timer);
    if (playing && !hovering && !document.hidden) timer = setInterval(() => show(current + 1), INTERVAL_MS);
  };
  const show = (index, manual = false) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
    dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === current)));
    if (manual) {
      status.textContent = `${current + 1} of ${slides.length}: ${slides[current].querySelector('figcaption').textContent}`;
      schedule();
    }
  };
  carousel.querySelector('.hero-carousel-prev').addEventListener('click', () => show(current - 1, true));
  carousel.querySelector('.hero-carousel-next').addEventListener('click', () => show(current + 1, true));
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i, true)));
  if (pauseButton) {
    pauseButton.addEventListener('click', () => {
      playing = !playing;
      updatePauseButton();
      schedule();
    });
  }
  carousel.addEventListener('mouseenter', () => { hovering = true; schedule(); });
  carousel.addEventListener('mouseleave', () => { hovering = false; schedule(); });
  carousel.addEventListener('focusin', () => { hovering = true; schedule(); });
  carousel.addEventListener('focusout', (event) => {
    if (!carousel.contains(event.relatedTarget)) { hovering = false; schedule(); }
  });
  carousel.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    show(current + (event.key === 'ArrowRight' ? 1 : -1), true);
  });
  carousel.addEventListener('touchstart', (event) => {
    const touch = event.changedTouches[0];
    touchStart = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });
  carousel.addEventListener('touchend', (event) => {
    if (!touchStart) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStart.x;
    const dy = touch.clientY - touchStart.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1), true);
    touchStart = null;
  }, { passive: true });
  carousel.addEventListener('touchcancel', () => { touchStart = null; });
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', () => { playing = !reducedMotion.matches; updatePauseButton(); schedule(); });
  updatePauseButton();
  schedule();
})();
