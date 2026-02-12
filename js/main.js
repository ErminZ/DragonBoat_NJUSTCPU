// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            const navLinks = document.getElementById('navLinks');
            const hamburger = document.getElementById('hamburger');
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('active')) {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
});

// Navbar background on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Re-observe when gallery items are added
function observeGalleryItems() {
    document.querySelectorAll('.gallery-item').forEach(el => {
        if (!el.classList.contains('visible')) {
            observer.observe(el);
        }
    });
}

// Zoom merchandise function
function zoomMerch(element, event) {
    event.stopPropagation();
    const img = element.querySelector('img');
    if (!img) return;
    
    const overlay = document.getElementById('merchZoom');
    const zoomImg = document.getElementById('merchZoomImg');
    
    zoomImg.src = img.src;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMerchZoom() {
    const overlay = document.getElementById('merchZoom');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Close merch zoom on click outside
document.getElementById('merchZoom')?.addEventListener('click', (e) => {
    if (e.target.id === 'merchZoom') {
        closeMerchZoom();
    }
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    observeGalleryItems();
});
