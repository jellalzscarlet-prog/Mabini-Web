// NEWS CAROUSEL
(function () {
    'use strict';

    const AUTOPLAY_MS = 6000;

    const carousel = document.getElementById('newsCarousel');
    if (!carousel) return;

    const slides = Array.from(carousel.querySelectorAll('.news-slide'));
    const prevBtn = document.getElementById('newsPrev');
    const nextBtn = document.getElementById('newsNext');
    const dotsWrap = document.getElementById('newsDots');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let current = Math.max(0, slides.findIndex(s => s.classList.contains('active')));
    let timer = null;

    // Build dots
    const dots = slides.map((_, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'news-dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        dot.addEventListener('click', () => { goTo(i); restart(); });
        dotsWrap.appendChild(dot);
        return dot;
    });

    function goTo(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => {
            const on = i === current;
            slide.classList.toggle('active', on);
            slide.setAttribute('aria-hidden', on ? 'false' : 'true');
            // keep hidden slides out of the tab order
            slide.querySelectorAll('.news-scroll-content').forEach(el => {
                el.tabIndex = on ? 0 : -1;
            });
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === current);
            dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
        });
    }

    const next = () => goTo(current + 1);
    const prev = () => goTo(current - 1);

    function start() {
        if (reduceMotion || timer) return;
        timer = setInterval(next, AUTOPLAY_MS);
    }
    function stop() {
        clearInterval(timer);
        timer = null;
    }
    function restart() { stop(); start(); }

    // Buttons
    nextBtn.addEventListener('click', () => { next(); restart(); });
    prevBtn.addEventListener('click', () => { prev(); restart(); });

    // Keyboard (when the carousel has focus)
    carousel.addEventListener('keydown', e => {
        if (e.target.closest('.news-scroll-content')) return; // let the list scroll
        if (e.key === 'ArrowRight') { next(); restart(); }
        if (e.key === 'ArrowLeft')  { prev(); restart(); }
    });

    // Pause while hovering, focused, or reading the applicant list
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('focusin', stop);
    carousel.addEventListener('focusout', start);

    // Pause when the tab is hidden
    document.addEventListener('visibilitychange', () => {
        document.hidden ? stop() : start();
    });

    // Touch swipe
    let startX = 0, startY = 0;
    carousel.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        stop();
    }, { passive: true });

    carousel.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
            dx < 0 ? next() : prev();
        }
        start();
    }, { passive: true });

    goTo(current);
    start();
})();
