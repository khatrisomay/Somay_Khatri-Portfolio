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

    // 3.5. SEO FRIENDLY DEEP-LINKING & URL HASH ROUTING
    const navItems = document.querySelectorAll('.nav-menu-item, .mobile-drawer-link');
    
    function setActiveNavLink(targetHash) {
        navItems.forEach(item => {
            if (item.getAttribute('href') === targetHash) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    
                    anchor.classList.add('clicking');
                    setTimeout(() => anchor.classList.remove('clicking'), 300);

                    // Update URL Hash for SEO & Refresh Persistence
                    if (history.pushState) {
                        history.pushState(null, null, targetId);
                    } else {
                        window.location.hash = targetId;
                    }

                    setActiveNavLink(targetId);

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

    // SCROLLSPY THAT UPDATES URL HASH & ACTIVE NAV BUTTON AS YOU SCROLL
    const trackedSections = document.querySelectorAll('section[id]');
    trackedSections.forEach((section) => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top 50%',
            end: 'bottom 50%',
            onToggle: (self) => {
                if (self.isActive) {
                    const id = section.getAttribute('id');
                    const hash = `#${id}`;
                    setActiveNavLink(hash);
                    if (history.replaceState) {
                        history.replaceState(null, null, hash);
                    }
                }
            }
        });
    });

    // HANDLE PAGE REFRESH OR DIRECT DEEP LINKING VIA URL HASH
    function handleInitialHashScroll() {
        if (window.location.hash) {
            const initialTarget = document.querySelector(window.location.hash);
            if (initialTarget) {
                setActiveNavLink(window.location.hash);
                setTimeout(() => {
                    lenis.scrollTo(initialTarget, {
                        offset: -70,
                        duration: 1,
                        immediate: false
                    });
                }, 350);
            }
        }
    }
    
    // Trigger initial hash scroll after preloader dismissal
    setTimeout(handleInitialHashScroll, 850);

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

    // 8. MOBILE MENU DRAWER LOGIC
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobileDrawerClose = document.getElementById('mobileDrawerClose');
    const mobileDrawerLinks = document.querySelectorAll('.mobile-drawer-link');

    if (mobileMenuBtn && mobileDrawer) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileDrawer.classList.add('open');
        });
    }

    if (mobileDrawerClose && mobileDrawer) {
        mobileDrawerClose.addEventListener('click', () => {
            mobileDrawer.classList.remove('open');
        });
    }

    mobileDrawerLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (mobileDrawer) {
                mobileDrawer.classList.remove('open');
            }
        });
    });

    // 9. ANIMATED TERMINAL TYPEWRITER LOGIC
    const terminalCommands = [
        { text: 'terraform apply -auto-approve', cmdId: 'cmd1', statusId: 'status1' },
        { text: 'docker build -t app:v2 .', cmdId: 'cmd2', statusId: 'status2' },
        { text: 'kubectl get pods --namespace=prod', cmdId: 'cmd3', statusId: 'status3' }
    ];

    function typeWriterCommand(cmdObj, charIndex, callback) {
        const el = document.getElementById(cmdObj.cmdId);
        if (!el) return;

        if (charIndex < cmdObj.text.length) {
            el.textContent += cmdObj.text.charAt(charIndex);
            setTimeout(() => typeWriterCommand(cmdObj, charIndex + 1, callback), 35);
        } else {
            const statusEl = document.getElementById(cmdObj.statusId);
            if (statusEl) {
                statusEl.classList.add('visible');
            }
            setTimeout(callback, 600);
        }
    }

    function runTerminalSequence() {
        terminalCommands.forEach(c => {
            const cmdEl = document.getElementById(c.cmdId);
            const statusEl = document.getElementById(c.statusId);
            if (cmdEl) cmdEl.textContent = '';
            if (statusEl) statusEl.classList.remove('visible');
        });

        typeWriterCommand(terminalCommands[0], 0, () => {
            typeWriterCommand(terminalCommands[1], 0, () => {
                typeWriterCommand(terminalCommands[2], 0, () => {
                    setTimeout(runTerminalSequence, 6000); // Re-run sequence loop after 6 seconds
                });
            });
        });
    }

    // Start terminal typing sequence after hero entrance
    setTimeout(runTerminalSequence, 1000);

    // 10. HERO INTERACTIVE CANVAS PARTICLE GRID & MOUSE FOLLOW LIGHT
    const canvas = document.getElementById('heroCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = canvas.offsetWidth;
        let height = canvas.height = canvas.offsetHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        });

        let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.targetX = e.clientX - rect.left;
            mouse.targetY = e.clientY - rect.top;
        });

        // Generate 45 floating tech particle nodes
        const particles = [];
        const particleCount = Math.min(45, Math.floor(width / 30));

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.8,
                vy: (Math.random() - 0.5) * 0.8,
                radius: Math.random() * 2 + 1,
                color: Math.random() > 0.3 ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 35, 0.8)'
            });
        }

        function drawCanvas() {
            ctx.clearRect(0, 0, width, height);

            // Smooth mouse interpolation
            mouse.x += (mouse.targetX - mouse.x) * 0.05;
            mouse.y += (mouse.targetY - mouse.y) * 0.05;

            // Draw subtle mouse cursor glow spotlight
            const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 250);
            glow.addColorStop(0, 'rgba(255, 255, 35, 0.12)');
            glow.addColorStop(1, 'rgba(255, 255, 35, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 250, 0, Math.PI * 2);
            ctx.fill();

            // Update & draw particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();

                // Draw connecting lines between close particles
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 110) {
                        ctx.strokeStyle = `rgba(0, 0, 0, ${0.12 * (1 - dist / 110)})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }

                // Connect particles to mouse cursor
                const mdx = p.x - mouse.x;
                const mdy = p.y - mouse.y;
                const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

                if (mdist < 140) {
                    ctx.strokeStyle = `rgba(255, 255, 35, ${0.4 * (1 - mdist / 140)})`;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }

            requestAnimationFrame(drawCanvas);
        }

        drawCanvas();
    }

});
