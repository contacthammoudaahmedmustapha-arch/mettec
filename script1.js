// ============================================
// METTEC — GLOBAL SCRIPTS
// Structure COGEPAM · Contenu METTEC
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    initLoader();
    initNavigation();
    initScrollTop();
    initStatsCounter();
    initSmoothScroll();
    initReveal();
    initConfigurator();
    initTestimonials();
});

// ============================================
// LOADER
// ============================================



function triggerStatsAnimation() {
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

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    const navbar = document.querySelector('.navbar');

    // Scroll shadow
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 60) {
            navbar && navbar.classList.add('scrolled');
        } else {
            navbar && navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // Mobile toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks && navLinks.classList.add('active');
            navOverlay && navOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    function closeMenu() {
        navLinks && navLinks.classList.remove('active');
        navOverlay && navOverlay.classList.remove('active');
        document.body.style.overflow = '';
        dropdowns.forEach(d => d.classList.remove('active'));
    }

    if (menuClose) menuClose.addEventListener('click', closeMenu);
    if (navOverlay) navOverlay.addEventListener('click', closeMenu);

    // Dropdown toggles
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.nav-dropdown-toggle');
        if (!toggle) return;

        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            dropdowns.forEach(d => {
                if (d !== dropdown) d.classList.remove('active');
            });

            dropdown.classList.toggle('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
            dropdowns.forEach(d => d.classList.remove('active'));
        }
    });
}

// ============================================
// SCROLL TO TOP
// ============================================

function initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.pageYOffset > 500);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// STATS COUNTER
// ============================================

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

function animateCounter(el, target) {
    let current = 0;
    const increment = target / 60;
    const duration = 2000;
    const stepTime = duration / 60;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.textContent = target + (el.dataset.suffix || '+');
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current);
        }
    }, stepTime);
}

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile menu if open
                document.getElementById('navLinks')?.classList.remove('active');
                document.getElementById('navOverlay')?.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

// ============================================
// REVEAL ON SCROLL
// ============================================

function initReveal() {
    const els = document.querySelectorAll('.reveal, .reveal-l');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => observer.observe(el));
}

// ============================================
// CONFIGURATEUR
// ============================================

function initConfigurator() {
    const BASE_PRICE_PER_M2 = 750; // TND per m²

    const sliders = {
        L: document.getElementById('sL'),
        W: document.getElementById('sW'),
        H: document.getElementById('sH')
    };

    const displays = {
        L: document.getElementById('vL'),
        W: document.getElementById('vW'),
        H: document.getElementById('vH')
    };

    if (!sliders.L) return;

    function calcPrice() {
        const L = parseFloat(sliders.L.value);
        const W = parseFloat(sliders.W.value);
        const H = parseFloat(sliders.H.value);

        // Update displays
        if (displays.L) displays.L.textContent = L;
        if (displays.W) displays.W.textContent = W;
        if (displays.H) displays.H.textContent = H;

        const surface = L * W;
        const basePrice = Math.round(surface * BASE_PRICE_PER_M2 * (1 + (H - 2.4) * 0.06));

        // Config radio
        const selectedConfig = document.querySelector('input[name="config"]:checked');
        const configPrice = selectedConfig ? parseInt(selectedConfig.value) || 0 : 0;

        // Checkboxes
        let extrasPrice = 0;
        document.querySelectorAll('.cfg-check input[type="checkbox"]:checked').forEach(cb => {
            extrasPrice += parseInt(cb.dataset.price) || 0;
        });

        const total = basePrice + configPrice + extrasPrice;

        // Update UI
        const surfaceEl = document.getElementById('cfgSurface');
        const baseEl = document.getElementById('cfgBase');
        const totalEl = document.getElementById('cfgTotal');
        const configLine = document.getElementById('cfgConfigLine');
        const configVal = document.getElementById('cfgConfigVal');
        const extrasLine = document.getElementById('cfgExtrasLine');
        const extrasVal = document.getElementById('cfgExtrasVal');

        if (surfaceEl) surfaceEl.textContent = surface.toFixed(1) + ' m²';
        if (baseEl) baseEl.textContent = formatPrice(basePrice) + ' TND';
        if (totalEl) totalEl.textContent = formatPrice(total);

        if (configLine && configVal) {
            if (configPrice > 0) {
                configLine.style.display = 'flex';
                configVal.textContent = '+' + formatPrice(configPrice) + ' TND';
            } else {
                configLine.style.display = 'none';
            }
        }

        if (extrasLine && extrasVal) {
            if (extrasPrice > 0) {
                extrasLine.style.display = 'flex';
                extrasVal.textContent = '+' + formatPrice(extrasPrice) + ' TND';
            } else {
                extrasLine.style.display = 'none';
            }
        }
    }

    function formatPrice(n) {
        return n.toLocaleString('fr-TN');
    }

    // Attach listeners
    Object.values(sliders).forEach(s => s && s.addEventListener('input', calcPrice));

    document.querySelectorAll('input[name="config"]').forEach(radio => {
        radio.addEventListener('change', () => {
            document.querySelectorAll('.cfg-opt').forEach(opt => opt.classList.remove('sel'));
            radio.closest('.cfg-opt')?.classList.add('sel');
            calcPrice();
        });
    });

    document.querySelectorAll('.cfg-check input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', calcPrice);
    });

    // Initial calc
    calcPrice();
}

// ============================================
// TESTIMONIALS SLIDER
// ============================================

function initTestimonials() {
    const slider = document.getElementById('testiSlider');
    const prevBtn = document.getElementById('testiPrev');
    const nextBtn = document.getElementById('testiNext');

    if (!slider) return;

    let current = 0;
    const cards = slider.querySelectorAll('.testi-card');
    const perSlide = window.innerWidth < 768 ? 1 : 2;
    const total = Math.ceil(cards.length / perSlide);

    function updateSlider() {
        const offset = current * (100 / perSlide);
        slider.style.transform = `translateX(-${offset}%)`;
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            current = (current - 1 + total) % total;
            updateSlider();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            current = (current + 1) % total;
            updateSlider();
        });
    }

    // Auto-advance
    setInterval(() => {
        current = (current + 1) % total;
        updateSlider();
    }, 6000);
}

// ============================================
// FORM SUBMISSION
// ============================================

function submitForm(e) {
    e.preventDefault();

    const form = e.target;
    const required = form.querySelectorAll('[required]');
    let valid = true;

    required.forEach(field => {
        if (!field.value.trim()) {
            valid = false;
            field.classList.add('field-error');
            field.style.animation = 'shake 0.5s';
            setTimeout(() => { field.style.animation = ''; }, 500);
        } else {
            field.classList.remove('field-error');
        }
    });

    if (valid) {
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Envoi en cours...';
        }

        // Simulate send (replace with real API call)
        setTimeout(() => {
            form.style.display = 'none';
            const successEl = document.getElementById('formSuccess');
            if (successEl) successEl.style.display = 'block';
        }, 1200);
    }
}

// ============================================
// LAZY IMAGES
// ============================================

if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                }
                imgObserver.unobserve(img);
            }
        });
    }, { rootMargin: '200px' });

    document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
}

// ============================================
// DEBOUNCE UTILITY
// ============================================

function debounce(fn, wait) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), wait);
    };
}

// Optimized scroll
const optimizedScroll = debounce(() => { /* scroll hooks */ }, 16);
window.addEventListener('scroll', optimizedScroll, { passive: true });
