/**
 * ============================================================================
 * WEDDING INVITATION APPLICATION CONFIGURATION
 * Central configuration object for quick modifications.
 * ============================================================================
 */
const weddingConfig = {
    coupleNames: "Harman & Sara",
    weddingDate: "December 20, 2026",
    countdownDate: "2026-12-20T18:00:00",
    venueName: "The Royal Palace Grand Ballroom",
    venueAddress: "Ahmedabad, Gujarat",
    mapsUrl: "https://maps.google.com/?q=The+Royal+Palace+Ahmedabad",
    musicEnabled: true
};

document.addEventListener("DOMContentLoaded", () => {
    initConfiguration();
    initAudioPlayer();
    initCountdown();
    initScrollAnimations();
    initParallaxCollage();
    initGalleryLightbox();
    initRSVPForm();
});

/**
 * Binds configuration parameters to designated DOM element nodes.
 */
function initConfiguration() {
    document.title = `Wedding Invitation | ${weddingConfig.coupleNames}`;

    const names = weddingConfig.coupleNames.split("&").map(s => s.trim());
    const groom = names[0] || "Harman";
    const bride = names[1] || "Sara";

    document.querySelectorAll(".config-groom").forEach(el => el.textContent = groom);
    document.querySelectorAll(".config-bride").forEach(el => el.textContent = bride);
    document.querySelectorAll(".config-names-inline").forEach(el => el.textContent = weddingConfig.coupleNames);
    document.querySelectorAll(".config-date-str").forEach(el => el.textContent = weddingConfig.weddingDate);
    document.querySelectorAll(".config-venue-name").forEach(el => el.textContent = weddingConfig.venueName);
    document.querySelectorAll(".config-venue-address").forEach(el => el.textContent = weddingConfig.venueAddress);

    document.querySelectorAll(".config-maps-btn").forEach(btn => {
        btn.setAttribute("href", weddingConfig.mapsUrl);
    });
}

/**
 * Handles HTML5 audio controller interactions and browser autoplay restrictions.
 */
function initAudioPlayer() {
    const audio = document.getElementById("wedding-audio");
    const musicBtn = document.getElementById("music-btn");
    const iconPlay = document.getElementById("music-icon-play");
    const iconPause = document.getElementById("music-icon-pause");

    if (!weddingConfig.musicEnabled) {
        musicBtn.classList.add("hidden");
        return;
    }

    let isPlaying = false;

    function toggleAudio() {
        if (isPlaying) {
            audio.pause();
            musicBtn.classList.remove("playing");
            iconPlay.classList.remove("hidden");
            iconPause.classList.add("hidden");
            isPlaying = false;
        } else {
            audio.play().then(() => {
                musicBtn.classList.add("playing");
                iconPlay.classList.add("hidden");
                iconPause.classList.remove("hidden");
                isPlaying = true;
            }).catch(err => {
                console.warn("Audio playback blocked by browser policy:", err);
            });
        }
    }

    musicBtn.addEventListener("click", toggleAudio);
}

/**
 * Real-time ISO Countdown Engine calculating remaining time.
 */
function initCountdown() {
    const daysEl = document.getElementById("timer-days");
    const hoursEl = document.getElementById("timer-hours");
    const minutesEl = document.getElementById("timer-minutes");
    const secondsEl = document.getElementById("timer-seconds");
    const timerGrid = document.getElementById("countdown-timer");
    const completeMsg = document.getElementById("countdown-complete");

    const weddingDate = new Date(weddingConfig.countdownDate);
    const targetTime = weddingDate.getTime();

    function updateTimer() {
        const now = new Date().getTime();
        const difference = targetTime - now;

        if (difference <= 0) {
            timerGrid.classList.add("hidden");
            completeMsg.classList.remove("hidden");
            clearInterval(timerInterval);
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, "0");
        hoursEl.textContent = String(hours).padStart(2, "0");
        minutesEl.textContent = String(minutes).padStart(2, "0");
        secondsEl.textContent = String(seconds).padStart(2, "0");
    }

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
}

/**
 * Configures IntersectionObserver triggers for scroll-based entrance animations.
 */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll(".scroll-reveal");

    const observerOptions = {
        root: null,
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal-active");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * Applies differential y-axis transform offsets for collage elements based on scroll position.
 */
function initParallaxCollage() {
    const items = document.querySelectorAll(".collage-item");
    if (items.length === 0 || window.innerWidth <= 768) return;

    window.addEventListener("scroll", () => {
        const scrolled = window.pageYOffset;
        items.forEach(item => {
            const speed = parseFloat(item.getAttribute("data-parallax-speed")) || 0.04;
            const yPos = -(scrolled * speed);
            item.style.transform = `translateY(${yPos}px) ${getExistingRotation(item)}`;
        });
    });

    function getExistingRotation(el) {
        if (el.classList.contains("item-1")) return "rotate(-6deg)";
        if (el.classList.contains("item-2")) return "rotate(5deg)";
        if (el.classList.contains("item-3")) return "rotate(-3deg)";
        if (el.classList.contains("item-4")) return "rotate(8deg)";
        return "";
    }
}

/**
 * Initializes Lightbox modal functionality, including touch swipe gestures and keyboard navigation.
 */
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll(".gallery-item");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = document.getElementById("lightbox-close");
    const prevBtn = document.getElementById("lightbox-prev");
    const nextBtn = document.getElementById("lightbox-next");

    let currentIndex = 0;
    const imageSources = Array.from(galleryItems).map(item => item.querySelector("img").src);

    function openLightbox(index) {
        currentIndex = index;
        lightboxImg.src = imageSources[currentIndex];
        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "auto";
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
        lightboxImg.src = imageSources[currentIndex];
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % imageSources.length;
        lightboxImg.src = imageSources[currentIndex];
    }

    galleryItems.forEach(item => {
        item.addEventListener("click", () => {
            const idx = parseInt(item.getAttribute("data-index"));
            openLightbox(idx);
        });
    });

    closeBtn.addEventListener("click", closeLightbox);
    prevBtn.addEventListener("click", showPrev);
    nextBtn.addEventListener("click", showNext);

    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard Navigation
    document.addEventListener("keydown", (e) => {
        if (!lightbox.classList.contains("active")) return;
        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") showPrev();
        if (e.key === "ArrowRight") showNext();
    });

    // Mobile Swipe Handling
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 40) showNext();
        if (touchEndX > touchStartX + 40) showPrev();
    }, { passive: true });
}

/**
 * Handles client-side validation and feedback state management for the RSVP form.
 */
function initRSVPForm() {
    const form = document.getElementById("rsvp-form");
    const successMsg = document.getElementById("rsvp-success");

    if (!form) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("rsvp-name").value.trim();
        const email = document.getElementById("rsvp-email").value.trim();

        if (name === "" || email === "") {
            alert("Please complete all required fields.");
            return;
        }

        form.classList.add("hidden");
        successMsg.classList.remove("hidden");
    });
}


