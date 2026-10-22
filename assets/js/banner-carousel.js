/* Homepage banner carousel: autoplay with pause, arrows, dots, keyboard and swipe. */
(() => {
  const carousel = document.querySelector('.banner-carousel');
  if (!carousel) return;
  const slides = [...carousel.querySelectorAll('.banner-slide')];
  const dots = [...carousel.querySelectorAll('.banner-dots button')];
  const status = carousel.querySelector('.banner-status');
  const pauseButton = carousel.querySelector('.banner-pause');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const INTERVAL_MS = 6000;
  if (slides.length < 2) return;

  let current = 0;
  let playing = !reducedMotion.matches;
  let paused = false; // hover or keyboard focus inside the carousel
  let timer;
  let touchStart;

  const updatePauseButton = () => {
    if (!pauseButton) return;
    pauseButton.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
    const icon = pauseButton.querySelector('i');
    if (icon) icon.className = playing ? 'bi bi-pause-fill' : 'bi bi-play-fill';
  };

  const schedule = () => {
    clearInterval(timer);
    if (playing && !paused && !document.hidden) timer = setInterval(() => show(current + 1), INTERVAL_MS);
  };

  // Slides 2+ keep their image addresses in data-src/data-srcset so they don't
  // compete with the first banner while the page is loading. They load when
  // shown, or shortly after the page has finished loading.
  const loadSlide = (slide) => {
    slide.querySelectorAll('[data-srcset]').forEach((el) => {
      el.setAttribute('srcset', el.getAttribute('data-srcset'));
      el.removeAttribute('data-srcset');
    });
    slide.querySelectorAll('img[data-src]').forEach((img) => {
      img.setAttribute('src', img.getAttribute('data-src'));
      img.removeAttribute('data-src');
    });
  };
  const loadAllSlides = () => slides.forEach(loadSlide);
  if (document.readyState === 'complete') setTimeout(loadAllSlides, 1500);
  else window.addEventListener('load', () => setTimeout(loadAllSlides, 1500), { once: true });

  const show = (index, announce = false) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      if (active) slide.removeAttribute('inert');
      else slide.setAttribute('inert', '');
      if (active) loadSlide(slide);
    });
    dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === current)));
    if (announce && status) {
      status.textContent = `Slide ${current + 1} of ${slides.length}: ${slides[current].getAttribute('aria-label') || ''}`;
    }
  };

  carousel.querySelector('.banner-prev')?.addEventListener('click', () => { show(current - 1, true); schedule(); });
  carousel.querySelector('.banner-next')?.addEventListener('click', () => { show(current + 1, true); schedule(); });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i, true); schedule(); }));
  pauseButton?.addEventListener('click', () => {
    playing = !playing;
    updatePauseButton();
    schedule();
  });

  carousel.addEventListener('mouseenter', () => { paused = true; schedule(); });
  carousel.addEventListener('mouseleave', () => { paused = false; schedule(); });
  carousel.addEventListener('focusin', () => { paused = true; schedule(); });
  carousel.addEventListener('focusout', (event) => {
    if (!carousel.contains(event.relatedTarget)) { paused = false; schedule(); }
  });
  carousel.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    show(current + (event.key === 'ArrowRight' ? 1 : -1), true);
    schedule();
  });

  carousel.addEventListener('touchstart', (event) => {
    const t = event.changedTouches[0];
    touchStart = { x: t.clientX, y: t.clientY };
  }, { passive: true });
  carousel.addEventListener('touchend', (event) => {
    if (!touchStart) return;
    const t = event.changedTouches[0];
    const dx = t.clientX - touchStart.x;
    const dy = t.clientY - touchStart.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { show(current + (dx < 0 ? 1 : -1), true); schedule(); }
    touchStart = null;
  }, { passive: true });
  carousel.addEventListener('touchcancel', () => { touchStart = null; });

  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', () => { playing = !reducedMotion.matches; updatePauseButton(); schedule(); });

  show(0);
  updatePauseButton();
  schedule();
})();
