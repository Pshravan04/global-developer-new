document.addEventListener("DOMContentLoaded", () => {
    // --------------------------------------------------------
    // 1. PRELOADER ANIMATION
    // --------------------------------------------------------
    const preloader = document.getElementById('preloader');
    const percentEl = document.querySelector('.loader-percentage');
    
    let tlPreloader = gsap.timeline();
    
    // Fake loading percentage
    let loadingObj = { value: 0 };
    tlPreloader.to(loadingObj, {
        value: 100,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: function() {
            percentEl.innerHTML = Math.round(loadingObj.value) + "%";
        }
    }, 0);
    
    tlPreloader.to(".preloader-title", { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 0.5)
               .to(".preloader-subtitle", { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 0.7)
               .to(".loader-percentage", { opacity: 1, duration: 0.5 }, 0.7)
               .to(".loader-line", { width: "100%", duration: 2, ease: "power2.inOut" }, 0)
               .to(preloader, { yPercent: -100, duration: 1, ease: "power4.inOut" }, 2.5)
               .from(".hero-content", { y: 50, opacity: 0, duration: 1, ease: "power3.out" }, 3)
               .from(".parallax-img", { scale: 1.1, duration: 2, ease: "power2.out" }, 2.5);

    // --------------------------------------------------------
    // 2. HEADER SCROLL & MOBILE CTA
    // --------------------------------------------------------
    const header = document.getElementById('header');
    
    // Add mobile sticky CTA if on mobile
    if (window.innerWidth <= 768) {
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
    // 6. POPUP LOGIC
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
    
    // Prevent form submission for demo
    const form = document.querySelector('.enquiry-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Thank you for your interest. We will contact you soon.");
            popup.close();
        });
    }

    // Show popup after 8 seconds
    setTimeout(showPopup, 8000);
});
