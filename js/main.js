// ==========================================================================
// PORTFOLIO JAVASCRIPT — SOMAY KHATRI
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // 1. PRELOADER DISMISSAL
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        if (preloader) {
            preloader.classList.add('loaded');
        }
    }, 800);

    // 2. LENIS SMOOTH SCROLL INITIALIZATION
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 3. HEADER SCROLL MORPHING (GSAP + SCROLLTRIGGER)
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top+=50',
        end: 'bottom top',
        onToggle: (self) => {
            if (!self.isActive) {
                document.body.classList.add('scrolled');
            } else {
                document.body.classList.remove('scrolled');
            }
        }
    });

    // 3.5. SMOOTH ANCHOR LINK CLICK & NAVBAR ACTIVE ANIMATIONS
    const navItems = document.querySelectorAll('.nav-menu-item');
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    
                    // Click press animation effect
                    anchor.classList.add('clicking');
                    setTimeout(() => anchor.classList.remove('clicking'), 300);

                    // Update active nav button immediately
                    navItems.forEach(item => {
                        if (item.getAttribute('href') === targetId) {
                            item.classList.add('active');
                            gsap.fromTo(item, { scale: 0.88 }, { scale: 1.06, duration: 0.4, ease: 'back.out(1.8)' });
                        } else {
                            item.classList.remove('active');
                        }
                    });

                    // Smooth Lenis Scroll
                    lenis.scrollTo(targetEl, {
                        offset: -70,
                        duration: 1.4,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    });
                }
            }
        });
    });

    // SCROLLSPY ACTIVE HIGHLIGHT ANIMATION FOR ALL SECTIONS
    const trackedSections = document.querySelectorAll('section[id]');
    trackedSections.forEach((section) => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top 50%',
            end: 'bottom 50%',
            onToggle: (self) => {
                if (self.isActive) {
                    const id = section.getAttribute('id');
                    navItems.forEach((item) => {
                        if (item.getAttribute('href') === `#${id}`) {
                            item.classList.add('active');
                            gsap.fromTo(item, { scale: 0.9 }, { scale: 1.06, duration: 0.4, ease: 'back.out(1.7)' });
                        } else {
                            item.classList.remove('active');
                        }
                    });
                }
            }
        });
    });

    // 3.6. GSAP STAGGERED ENTRANCE ANIMATIONS FOR ALL SECTIONS

    // Projects Section Stagger Reveal
    gsap.from('.work-card', {
        scrollTrigger: {
            trigger: '#projects',
            start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        clearProps: 'all'
    });

    // Skills Section Stagger Reveal
    gsap.from('.skill-category', {
        scrollTrigger: {
            trigger: '#skills',
            start: 'top 75%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // Experience Section Timeline Stagger Reveal
    gsap.from('.timeline-item', {
        scrollTrigger: {
            trigger: '#experience',
            start: 'top 75%',
        },
        x: -40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // FAQ Section Stagger Reveal
    gsap.from('.faq-item', {
        scrollTrigger: {
            trigger: '#faq',
            start: 'top 75%',
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out'
    });

    // 4. ANIMATED NUMBER COUNTERS
    const statElements = document.querySelectorAll('.stat-num, .nav-stat-number');
    statElements.forEach((el) => {
        const targetStr = el.getAttribute('data-target') || el.getAttribute('data-count');
        if (!targetStr) return;
        const targetVal = parseFloat(targetStr);

        ScrollTrigger.create({
            trigger: el,
            start: 'top 95%',
            once: true,
            onEnter: () => {
                let countObj = { val: 0 };
                gsap.to(countObj, {
                    val: targetVal,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: () => {
                        if (targetStr.includes('%')) {
                            el.textContent = Math.floor(countObj.val) + '%';
                        } else if (targetStr.includes('.')) {
                            el.textContent = countObj.val.toFixed(1);
                        } else {
                            el.textContent = Math.floor(countObj.val) + '+';
                        }
                    }
                });
            }
        });
    });

    // 5. FAQ ACCORDION TOGGLE
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
        const toggleBtn = item.querySelector('.faq-toggle');
        const answerWrap = item.querySelector('.faq-answer-wrap');

        toggleBtn.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            // Close all
            faqItems.forEach((i) => {
                i.classList.remove('active');
                i.querySelector('.faq-answer-wrap').style.maxHeight = null;
            });

            // Toggle current
            if (!isOpen) {
                item.classList.add('active');
                answerWrap.style.maxHeight = answerWrap.scrollHeight + 'px';
            }
        });
    });

    // 6. EMAIL COPY TO CLIPBOARD
    const emailCopyBtn = document.getElementById('emailCopyBtn');
    if (emailCopyBtn) {
        emailCopyBtn.addEventListener('click', () => {
            const email = 'Somaykhatri6555@gmail.com';
            navigator.clipboard.writeText(email).then(() => {
                const badge = emailCopyBtn.querySelector('.copy-badge');
                if (badge) {
                    const origText = badge.textContent;
                    badge.textContent = 'COPIED TO CLIPBOARD! ✨';
                    badge.style.color = '#000';
                    setTimeout(() => {
                        badge.textContent = origText;
                    }, 2500);
                }
            });
        });
    }

    // 7. HERO HEADING REVEAL ANIMATION
    gsap.from('.hero-heading .char-span', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power4.out',
        delay: 0.5
    });

    gsap.from('.hero-card', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 1.2
    });

});
