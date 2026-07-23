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
