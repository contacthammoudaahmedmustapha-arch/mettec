// ============================================
// METTEC – GLOBAL SCRIPTS (inspiré COGEPAM)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initLoader();
    initNavigation();
    initScrollTop();
    initStatsCounter();
    initSmoothScroll();
});

// ---------- LOADER ----------
function initLoader() {
    const loader = document.getElementById('pageLoader');
    const progressBar = document.querySelector('.progress-bar');
    if (!loader) return;
    if (sessionStorage.getItem('mettec-loaded')) {
        loader.style.display = 'none';
        loader.remove();
        return;
    }
    let progress = 0;
    const minLoadTime = 2000;
    const startTime = Date.now();
    const hideLoader = () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, minLoadTime - elapsed);
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.5s';
            setTimeout(() => {
                loader.style.display = 'none';
                loader.remove();
                sessionStorage.setItem('mettec-loaded', 'true');
                triggerStatsAnimation();
            }, 500);
        }, remaining);
    };
    const onLoad = () => {
        let visualProgress = 0;
        const interval = setInterval(() => {
            visualProgress += Math.random() * 15;
            if (visualProgress > 90) visualProgress = 90;
            if (progressBar) progressBar.style.width = visualProgress + '%';
        }, 200);
        setTimeout(() => {
            clearInterval(interval);
            if (progressBar) progressBar.style.width = '100%';
            hideLoader();
        }, minLoadTime - 500);
    };
    if (document.readyState === 'complete') onLoad();
    else window.addEventListener('load', onLoad);
    setTimeout(() => {
        if (loader.style.display !== 'none') {
            if (progressBar) progressBar.style.width = '100%';
            hideLoader();
        }
    }, 4000);
}

function triggerStatsAnimation() {
    const stats = document.querySelectorAll('.stat-number[data-count]');
    if (!stats.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    stats.forEach(s => observer.observe(s));
}

function animateCounter(el, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.textContent = target + (target > 100 ? '+' : '');
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current);
        }
    }, 40);
}

// ---------- NAVIGATION ----------
function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.add('active');
            navOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    const closeMenu = () => {
        navLinks.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
        dropdowns.forEach(d => d.classList.remove('active'));
    };
    if (menuClose) menuClose.addEventListener('click', closeMenu);
    if (navOverlay) navOverlay.addEventListener('click', closeMenu);
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.nav-dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropdowns.forEach(d => { if (d !== dropdown) d.classList.remove('active'); });
                dropdown.classList.toggle('active');
            });
        }
    });
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) dropdowns.forEach(d => d.classList.remove('active'));
    });
}

// ---------- SCROLL TOP ----------
function initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.pageYOffset > 500);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ---------- STATS COUNTER (already covered) ----------
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number[data-count]');
    if (!stats.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target, parseInt(entry.target.dataset.count));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    stats.forEach(s => observer.observe(s));
}

// ---------- SMOOTH SCROLL ----------
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // close mobile menu if open
                const navLinks = document.getElementById('navLinks');
                const overlay = document.getElementById('navOverlay');
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
}

// ---------- FORM (inline in HTML) ----------
// Already handled via inline submitForm in index.html