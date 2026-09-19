document.addEventListener("DOMContentLoaded", () => {
    // --------------------------------------------------------
    // 1. CINEMATIC PRELOADER
    // --------------------------------------------------------
    const preloader = document.getElementById('preloader');
    const percentEl = document.querySelector('.loader-percentage');
    const shutterPanels = document.querySelectorAll('.shutter-panel');
    const palmLeaves = document.querySelectorAll('.palm-leaf');
    const palmTrunks = document.querySelectorAll('.palm-trunk');
    const orbitArcs = document.querySelectorAll('.orbit-arc');
    const globeMotif = document.querySelector('.globe-motif');
    const palmEls = document.querySelectorAll('.palm');
    const horizonEl = document.querySelector('.preloader-horizon');
    const hasPlayed = sessionStorage.getItem('fno_intro_played');

    // Assign shutter panel colors (forest greens, darkening)
    const shutterColors = ['#1a3c34','#1f4840','#163630','#12302a','#0e2922','#0a2220'];
    shutterPanels.forEach((panel, i) => {
        panel.style.background = shutterColors[i % shutterColors.length];
    });

    function finishLoader() {
        if (preloader) {
            preloader.style.opacity = '0';
            preloader.style.transition = 'opacity 0.3s ease';
            setTimeout(() => { preloader.style.display = 'none'; }, 350);
        }
        // Animate hero in
        gsap.from(".hero-content", { y: 50, opacity: 0, duration: 1, ease: "power3.out", delay: 0.2 });
    }

    if (hasPlayed || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Skip loader — instant reveal
        if (preloader) preloader.style.display = 'none';
        gsap.from(".hero-content", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" });
    } else {
        sessionStorage.setItem('fno_intro_played', '1');

        // Phase 1: Logo + counter fade in
        let tlPre = gsap.timeline();
        let loadObj = { value: 0 };

        tlPre
            .to('.preloader-logo-wrapper', { opacity: 1, scale: 1, duration: 0.9, ease: 'power3.out' }, 0.3)
            .to('.loader-percentage', { opacity: 1, duration: 0.4 }, 0.6)
            .to(loadObj, {
                value: 100,
                duration: 2,
                ease: 'power2.inOut',
                onUpdate() {
                    if (percentEl) percentEl.textContent = Math.round(loadObj.value) + '%';
                }
            }, 0.6)
            // Draw SVG strokes
            .to([...palmLeaves, ...palmTrunks, ...orbitArcs], {
                strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', stagger: 0.08
            }, 0.8)
            // Fade palm + globe motifs in
            .to([...palmEls, globeMotif], { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.12 }, 1.2)
            // Horizon glow
            .to(horizonEl, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 1.6)
            // Phase 2: Shutter exit — panels slide up staggered
            .to(shutterPanels, {
                yPercent: -105,
                duration: 1.1,
                ease: 'cubic-bezier(0.76, 0, 0.24, 1)',
                stagger: 0.06
            }, 2.8)
            .call(finishLoader, null, 3.9);
    }

    // --------------------------------------------------------
    // 1B. HERO SLIDER LOGIC
    // --------------------------------------------------------
    const slides = document.querySelectorAll('.hero-slide');
    const nextBtn = document.querySelector('.next-slide');
    const prevBtn = document.querySelector('.prev-slide');
    let currentSlide = 0;
    const totalSlides = slides.length;
    let slideInterval;

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        currentSlide = (index + totalSlides) % totalSlides;
        slides[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function resetSlider() {
        clearInterval(slideInterval);
        startSlider();
    }

    if (slides.length > 0) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetSlider();
        });
        
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetSlider();
        });

        startSlider();
    }

    // --------------------------------------------------------
    // 2. HEADER SCROLL & MOBILE CTA
    // --------------------------------------------------------
    const header = document.getElementById('header');

    // Add mobile sticky CTA if on mobile (inserted once)
    if (window.innerWidth <= 768 && !document.querySelector('.mobile-sticky-cta')) {
        const mobileCTA = document.createElement('button');
        mobileCTA.className = 'mobile-sticky-cta open-popup';
        mobileCTA.innerText = 'Register Your Interest';
        document.body.appendChild(mobileCTA);
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --------------------------------------------------------
    // 2B. HAMBURGER MENU
    // --------------------------------------------------------
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const backdrop = document.querySelector('.menu-backdrop');
    let focusableEls = [];

    function openMobileMenu() {
        mobileMenu.hidden = false;
        hamburger.classList.add('is-open');
        hamburger.setAttribute('aria-expanded', 'true');
        if (backdrop) backdrop.classList.add('is-visible');
        document.body.classList.add('modal-open');
        // Focus trap — collect focusable items
        focusableEls = Array.from(mobileMenu.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ));
        if (focusableEls.length) focusableEls[0].focus();
    }

    function closeMobileMenu() {
        mobileMenu.hidden = true;
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        if (backdrop) backdrop.classList.remove('is-visible');
        document.body.classList.remove('modal-open');
        hamburger.focus();
    }

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.hidden ? openMobileMenu() : closeMobileMenu();
        });

        if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
        if (backdrop) backdrop.addEventListener('click', closeMobileMenu);

        // Close on nav link click
        mobileNavLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

        // ESC key closes
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !mobileMenu.hidden) closeMobileMenu();
            // Focus trap Tab
            if (e.key === 'Tab' && !mobileMenu.hidden && focusableEls.length) {
                const first = focusableEls[0];
                const last = focusableEls[focusableEls.length - 1];
                if (e.shiftKey) {
                    if (document.activeElement === first) { e.preventDefault(); last.focus(); }
                } else {
                    if (document.activeElement === last) { e.preventDefault(); first.focus(); }
                }
            }
        });
    }

    // --------------------------------------------------------
    // 3. GSAP SCROLLTRIGGER ANIMATIONS
    // --------------------------------------------------------
    gsap.registerPlugin(ScrollTrigger);

    // Parallax Images
    gsap.utils.toArray('.parallax-img').forEach(img => {
        gsap.to(img, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Fade Up Elements
    gsap.utils.toArray('.fade-up').forEach(elem => {
        gsap.from(elem, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: elem,
                start: "top 85%",
            }
        });
    });

    // Route Line Drawing (Map)
    const routeLine = document.getElementById('routeLine');
    if (routeLine) {
        const length = routeLine.getTotalLength();
        gsap.set(routeLine, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(routeLine, {
            strokeDashoffset: 0,
            duration: 2,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: ".location-map-container",
                start: "top 75%"
            }
        });
    }



    // Horizontal Scroll Gallery
    if (window.innerWidth > 768) {
        const galleryWrapper = document.querySelector('.gallery-wrapper');
        if (galleryWrapper) {
            gsap.to(galleryWrapper, {
                x: () => -(galleryWrapper.scrollWidth - window.innerWidth + window.innerWidth * 0.1),
                ease: "none",
                scrollTrigger: {
                    trigger: ".horizontal-gallery-section",
                    start: "top center",
                    end: "bottom top",
                    scrub: 1,
                    pin: false
                }
            });
        }
    }

    // --------------------------------------------------------
    // 4. STICKY SCROLL SECTION (DESTINATION)
    // --------------------------------------------------------
    const scrollPoints = document.querySelectorAll('.scrolling-point');
    const stickyImages = document.querySelectorAll('.sticky-img-container');
    
    function switchStickyImage(targetId) {
        scrollPoints.forEach(p => p.classList.remove('active'));
        stickyImages.forEach(img => img.classList.remove('active'));
        
        const activePoint = Array.from(scrollPoints).find(p => p.dataset.target === targetId);
        const activeImg = document.getElementById(`sticky-img-${targetId}`);
        
        if (activePoint) activePoint.classList.add('active');
        if (activeImg) activeImg.classList.add('active');
    }

    // Scroll interaction using GSAP ScrollTrigger
    if (scrollPoints.length > 0) {
        // Initialize the first one as active
        switchStickyImage('1');
        
        scrollPoints.forEach(point => {
            ScrollTrigger.create({
                trigger: point,
                start: "top center",
                end: "bottom center",
                onEnter: () => switchStickyImage(point.dataset.target),
                onEnterBack: () => switchStickyImage(point.dataset.target)
            });
        });
    }

    // --------------------------------------------------------
    // 5. FAQ ACCORDION
    // --------------------------------------------------------
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');
            
            // Close all others
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-content').style.maxHeight = null;
                }
            });
            
            // Toggle current
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // --------------------------------------------------------
    // 6. FEATURES SLIDER LOGIC
    // --------------------------------------------------------
    const featureTrack = document.querySelector('.feature-slider-track');
    const featurePrevBtn = document.querySelector('.feature-slider-nav .prev-btn');
    const featureNextBtn = document.querySelector('.feature-slider-nav .next-btn');

    if (featureTrack && featurePrevBtn && featureNextBtn) {
        let currentFeatureIndex = 0;
        
        function updateFeatureSlider() {
            const cards = featureTrack.querySelectorAll('.feature-card');
            if (cards.length === 0) return;
            const cardWidth = cards[0].offsetWidth;
            const gap = parseFloat(window.getComputedStyle(featureTrack).gap) || 0;
            const moveAmount = cardWidth + gap;
            
            // Calculate max index based on visible items
            const containerWidth = document.querySelector('.feature-slider-container').offsetWidth;
            const visibleCards = Math.floor(containerWidth / moveAmount);
            const maxIndex = Math.max(0, cards.length - visibleCards);
            
            // Clamp index
            if (currentFeatureIndex > maxIndex) currentFeatureIndex = maxIndex;
            if (currentFeatureIndex < 0) currentFeatureIndex = 0;
            
            // Apply transform
            featureTrack.style.transform = `translateX(-${currentFeatureIndex * moveAmount}px)`;
            
            // Update button states
            featurePrevBtn.style.opacity = currentFeatureIndex === 0 ? "0.5" : "1";
            featurePrevBtn.style.pointerEvents = currentFeatureIndex === 0 ? "none" : "auto";
            
            featureNextBtn.style.opacity = currentFeatureIndex === maxIndex ? "0.5" : "1";
            featureNextBtn.style.pointerEvents = currentFeatureIndex === maxIndex ? "none" : "auto";
        }
        
        featureNextBtn.addEventListener('click', () => {
            currentFeatureIndex++;
            updateFeatureSlider();
        });
        
        featurePrevBtn.addEventListener('click', () => {
            currentFeatureIndex--;
            updateFeatureSlider();
        });
        
        // Initial setup
        window.addEventListener('resize', () => {
            // Reset on resize to avoid weird offsets
            currentFeatureIndex = 0;
            updateFeatureSlider();
        });
        
        // Run once
        setTimeout(updateFeatureSlider, 100);
    }

    // --------------------------------------------------------
    // 7. POPUP LOGIC
    // --------------------------------------------------------
    const popup = document.getElementById('enquiry-popup');
    const openBtns = document.querySelectorAll('.open-popup');
    const closeBtn = document.querySelector('.close-popup');
    let hasShownPopup = false;
    
    function showPopup() {
        if (!popup.open && !hasShownPopup) {
            popup.showModal();
            hasShownPopup = true;
        }
    }
    
    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            popup.showModal();
            hasShownPopup = true;
        });
    });
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            popup.close();
        });
    }
    
    // Close on backdrop click
    popup.addEventListener('click', (e) => {
        const dialogDimensions = popup.getBoundingClientRect();
        if (
            e.clientX < dialogDimensions.left ||
            e.clientX > dialogDimensions.right ||
            e.clientY < dialogDimensions.top ||
            e.clientY > dialogDimensions.bottom
        ) {
            popup.close();
        }
    });
    
    // Prevent form submission for demo — show success message instead
    const form = document.querySelector('.enquiry-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Show success
            const successMsg = form.querySelector('.form-success') || (() => {
                const el = document.createElement('div');
                el.className = 'form-success is-visible';
                el.innerHTML = '<h4>Thank You!</h4><p>We will be in touch shortly.</p>';
                form.appendChild(el);
                return el;
            })();
            form.querySelectorAll('.form-group, .form-row, button[type=submit]').forEach(el => el.style.display = 'none');
            successMsg.classList.add('is-visible');
            setTimeout(() => { popup.close(); }, 2500);
        });
    }

    // --------------------------------------------------------
    // 9. SCROLL REVEAL (IntersectionObserver fallback for no GSAP ScrollTrigger)
    // --------------------------------------------------------
    const revealEls = document.querySelectorAll('.reveal-fade, .reveal-slide-up, .reveal-scale');
    if ('IntersectionObserver' in window && revealEls.length) {
        const revealIO = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealIO.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
        revealEls.forEach(el => revealIO.observe(el));
    } else {
        // Fallback: show all immediately
        revealEls.forEach(el => el.classList.add('is-visible'));
    }

    // Show popup after 8 seconds
    setTimeout(showPopup, 8000);

    // Sync body.modal-open with popup open/close for scroll lock
    if (popup) {
        popup.addEventListener('close', () => document.body.classList.remove('modal-open'));
    }
    openBtns.forEach(btn => {
        btn.addEventListener('click', () => document.body.classList.add('modal-open'));
    });
});
