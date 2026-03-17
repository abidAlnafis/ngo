/**
 * DISA Bangladesh - Main JavaScript
 * Centralized logic for all pages
 */

document.addEventListener('DOMContentLoaded', () => {
    // ═══════════════════ GLOBAL LOGIC ═══════════════════

    // 1. Page Loader
    const pageLoader = document.getElementById('page-loader');
    if (pageLoader) {
        window.addEventListener('load', () => {
            setTimeout(() => pageLoader.classList.add('hidden'), 400);
        });
    }

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 60) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        });
    }

    // 3. Scroll to Top Button
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 4. Mobile Menu Navigation
    // toggleMenu is global because it's called by onclick in HTML
    window.toggleMenu = function() {
        document.body.classList.toggle('mobile-menu-open');
    };

    // Click outside to close mobile menu
    document.addEventListener('click', function (e) {
        if (!document.body.classList.contains('mobile-menu-open')) return;
        const nav = document.getElementById('navLinks');
        const hamburger = document.getElementById('hamburger');
        const closeBtn = document.querySelector('.mobile-close-btn');
        
        if (nav && hamburger && !nav.contains(e.target) && !hamburger.contains(e.target) && (!closeBtn || !closeBtn.contains(e.target))) {
            document.body.classList.remove('mobile-menu-open');
        }
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('mobile-menu-open');
        });
    });

    // 5. Scroll Animation Observer
    const observerOptions = { threshold: 0.12 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 80);
                
                // If it's a counter, start the animation
                if (entry.target.classList.contains('stat-num') && !entry.target.classList.contains('counted')) {
                    animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll, .stat-num').forEach(el => observer.observe(el));

    // ═══════════════════ PAGE-SPECIFIC LOGIC ═══════════════════

    // A. Counter Animation (Index)
    function animateCounter(el) {
        const span = el.querySelector('span');
        const suffix = span ? span.textContent : '';
        const targetText = el.textContent.replace(/[^0-9]/g, '');
        const target = parseInt(targetText);
        
        if (isNaN(target)) return;

        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out quad
            const easeProgress = progress * (2 - progress);
            const current = Math.floor(easeProgress * target);
            
            el.innerHTML = current.toLocaleString() + (span ? `<span>${suffix}</span>` : '');

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.innerHTML = target.toLocaleString() + (span ? `<span>${suffix}</span>` : '');
            }
        }
        requestAnimationFrame(update);
    }

    // B. Contact Form (Contact)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            this.style.display = 'none';
            const successMsg = document.getElementById('successMsg');
            if (successMsg) successMsg.style.display = 'block';
        });
    }

    // C. Gallery Functions (Gallery)
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        window.openLightbox = function(item) {
            const img = item.querySelector('img');
            const lbImg = document.getElementById('lightboxImg');
            const lbCap = document.getElementById('lightboxCaption');
            if (lbImg) {
                lbImg.src = img.src;
                lbImg.alt = img.alt;
            }
            if (lbCap) {
                lbCap.textContent = img.dataset.caption || img.alt;
            }
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        window.closeLightboxDirect = function() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        window.closeLightbox = function(e) {
            if (e.target === lightbox) closeLightboxDirect();
        };

        document.addEventListener('keydown', e => { 
            if (e.key === 'Escape') closeLightboxDirect(); 
        });
    }

    window.filterGallery = function(cat, btn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
        });
    };

    // D. Donation Functions (Donate)
    let selectedAmount = 1000;
    const amountDisplay = document.getElementById('amountDisplay');
    const customAmount = document.getElementById('customAmount');

    window.selectAmount = function(btn, amount) {
        document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        selectedAmount = amount || 0;
        if (amountDisplay) amountDisplay.textContent = selectedAmount ? selectedAmount.toLocaleString() : '...';
        if (amount === 0 && customAmount) customAmount.focus();
    };

    window.selectFreq = function(btn) {
        document.querySelectorAll('.freq-btn').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
    };

    window.selectPay = function(tab) {
        document.querySelectorAll('.pay-tab').forEach(t => t.classList.remove('active'));
        if (tab) tab.classList.add('active');
    };

    if (customAmount) {
        customAmount.addEventListener('input', function() {
            const val = parseInt(this.value) || 0;
            if (amountDisplay) amountDisplay.textContent = val.toLocaleString();
        });
    }

    window.handleDonate = function() {
        const success = document.getElementById('donateSuccess');
        if (success) {
            success.style.display = 'block';
            success.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };
});
