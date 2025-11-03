/**
 * Book Animation Styles Component
 * Handles premium animations and micro-interactions
 */

class BookAnimationStyles {
    constructor() {
        this.animationSettings = {
            duration: '0.6s',
            delay: '0.1s',
            easing: 'ease-out'
        };
    }

    /**
     * Generate animation CSS
     */
    generateCSS() {
        return `
/* Premium Animations and Transitions */

/* Page entrance animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes pageTurn {
    0% {
        transform: rotateY(0deg);
        opacity: 1;
    }
    50% {
        transform: rotateY(90deg);
        opacity: 0.8;
    }
    100% {
        transform: rotateY(0deg);
        opacity: 1;
    }
}

@keyframes slideAcross {
    0%, 100% {
        transform: translateX(-100%);
    }
    50% {
        transform: translateX(100%);
    }
}

@keyframes shimmer {
    0%, 100% {
        transform: translateX(-100%);
    }
    50% {
        transform: translateX(100%);
    }
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.8;
        transform: scale(1.05);
    }
}

@keyframes pageReveal {
    from {
        opacity: 0;
        transform: translateY(20px) scale(0.98);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* Enhanced page animations */
.a4-page {
    animation: fadeInUp 0.8s ease-out;
    transform-style: preserve-3d;
    transition: all 0.3s ease;
}

.a4-page:nth-child(even) {
    animation-delay: 0.2s;
}

.a4-page:nth-child(odd) {
    animation-delay: 0.1s;
}

.a4-page:hover {
    transform: translateY(-2px);
    box-shadow: 
        0 8px 35px rgba(0, 0, 0, 0.15),
        0 4px 15px rgba(0, 0, 0, 0.08);
}

/* Premium sidebar animations */
.book-sidebar {
    animation: slideInLeft 0.6s ease-out;
}

/* Navigation link animations */
.nav-link {
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #e74c3c, #dc2626);
    transition: width 0.3s ease;
}

.nav-link:hover::after {
    width: 100%;
}

/* Enhanced chapter title animations */
.chapter-title-page {
    animation: fadeInUp 1s ease-out;
}

.part-title-page {
    animation: fadeInUp 1.2s ease-out;
}

/* Reading progress indicator enhancements */
.reading-position {
    position: relative;
    overflow: hidden;
}

.reading-position::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #10b981, #059669, #10b981);
    border-radius: 8px;
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ease;
    animation: shimmer 2s infinite;
}

.reading-position:hover::before {
    opacity: 0.3;
}

/* Premium book container effects */
.book-container {
    position: relative;
    overflow: hidden;
}

.book-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #e74c3c, #dc2626, #e74c3c);
    animation: slideAcross 3s ease-in-out infinite;
}

/* Enhanced hover effects for interactive elements */
.toc-link {
    position: relative;
    transition: all 0.3s ease;
}

.toc-link:hover {
    transform: translateX(8px) scale(1.02);
}

.toc-indicator {
    transition: all 0.3s ease;
    opacity: 0;
}

.toc-link:hover .toc-indicator {
    opacity: 1;
    transform: translateX(5px);
}

/* Premium page transitions */
.a4-page.in-view {
    animation: pageReveal 0.8s ease-out;
}

/* Enhanced scrollbar styling */
.book-sidebar::-webkit-scrollbar {
    width: 6px;
}

.book-sidebar::-webkit-scrollbar-track {
    background: linear-gradient(180deg, #f1f3f4 0%, #e8eaed 100%);
    border-radius: 3px;
}

.book-sidebar::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #e74c3c 0%, #dc2626 100%);
    border-radius: 3px;
    transition: all 0.3s ease;
}

.book-sidebar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #dc2626 0%, #b91c1c 100%);
    transform: scaleY(1.2);
}

.book-main::-webkit-scrollbar {
    width: 8px;
}

.book-main::-webkit-scrollbar-track {
    background: linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%);
    border-radius: 4px;
}

.book-main::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #9ca3af 0%, #6b7280 100%);
    border-radius: 4px;
    transition: all 0.3s ease;
}

.book-main::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #6b7280 0%, #4b5563 100%);
}

/* Premium print-like shadows */
.a4-page {
    box-shadow: 
        0 2px 4px rgba(0, 0, 0, 0.04),
        0 4px 8px rgba(0, 0, 0, 0.04),
        0 8px 16px rgba(0, 0, 0, 0.04),
        0 16px 32px rgba(0, 0, 0, 0.04),
        0 32px 64px rgba(0, 0, 0, 0.04);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.a4-page:hover {
    box-shadow: 
        0 4px 8px rgba(0, 0, 0, 0.06),
        0 8px 16px rgba(0, 0, 0, 0.06),
        0 16px 32px rgba(0, 0, 0, 0.06),
        0 32px 64px rgba(0, 0, 0, 0.06),
        0 64px 128px rgba(0, 0, 0, 0.06);
}

/* Interactive content highlighting */
.content-wrapper p:hover {
    background: linear-gradient(90deg, transparent 0%, rgba(231, 76, 60, 0.02) 50%, transparent 100%);
    transition: background 0.3s ease;
}

/* Premium loading animation */
.book-loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.book-loading::after {
    content: 'Loading Premium eBook...';
    color: white;
    font-size: 1.5rem;
    font-weight: 300;
    animation: pulse 1.5s ease-in-out infinite;
}

/* Enhanced focus states for accessibility */
.nav-link:focus,
.toc-link:focus,
.section-anchor:focus {
    outline: 3px solid #e74c3c;
    outline-offset: 2px;
    border-radius: 4px;
}

/* Premium typography enhancements */
.book-main h1,
.book-main h2,
.book-main h3,
.book-main h4,
.book-main h5,
.book-main h6 {
    position: relative;
    overflow: hidden;
}

/* Interactive chapter markers */
.chapter-number,
.part-header {
    position: relative;
    transition: all 0.3s ease;
}

.chapter-number:hover,
.part-header:hover {
    transform: scale(1.1);
    color: #dc2626;
}

/* Premium table of contents enhancements */
.table-of-contents {
    position: relative;
    overflow: hidden;
}

.table-of-contents::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: linear-gradient(135deg, rgba(231, 76, 60, 0.02) 0%, transparent 100%);
    pointer-events: none;
}

/* Content animation on scroll */
.book-main > * {
    opacity: 0;
    animation: fadeInUp 0.6s ease-out forwards;
}

.book-main > *:nth-child(1) { animation-delay: 0.1s; }
.book-main > *:nth-child(2) { animation-delay: 0.2s; }
.book-main > *:nth-child(3) { animation-delay: 0.3s; }
.book-main > *:nth-child(4) { animation-delay: 0.4s; }
.book-main > *:nth-child(5) { animation-delay: 0.5s; }

/* Smooth transitions for all interactive elements */
button, a, .nav-link, .toc-link {
    transition: all 0.3s ease;
}

/* Reduced motion for accessibility */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
    
    .a4-page,
    .book-sidebar,
    .chapter-title-page,
    .part-title-page {
        animation: none;
    }
    
    .book-container::before {
        animation: none;
    }
    
    .reading-position::before {
        animation: none;
    }
}

/* Responsive Animations */
@media (max-width: 768px) {
    .a4-page {
        animation-duration: 0.4s;
    }
    
    .toc-link:hover {
        transform: translateX(5px) scale(1.01);
    }
    
    .nav-link:hover {
        transform: translateX(3px);
    }
    
    .a4-page:hover {
        transform: translateY(-1px);
    }
}

/* Performance optimizations */
.a4-page {
    will-change: transform;
    backface-visibility: hidden;
}

.nav-link,
.toc-link {
    will-change: transform;
}

/* Loading skeleton animation */
@keyframes skeleton-loading {
    0% {
        background-position: -200px 0;
    }
    100% {
        background-position: calc(200px + 100%) 0;
    }
}

.skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200px 100%;
    animation: skeleton-loading 1.5s infinite;
}

/* Progress bar animations */
.progress-fill {
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.chapter-progress {
    transition: width 0.3s ease;
}

.scroll-fill {
    transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}`;
    }

    /**
     * Generate animation script
     */
    generateAnimationScript() {
        return `
// Animation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for scroll animations
    function setupScrollAnimations() {
        const observerOptions = {
            threshold: [0.1, 0.5, 0.9],
            rootMargin: '-50px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    
                    // Animate progress bars
                    const progressBars = entry.target.querySelectorAll('.progress-fill, .chapter-progress');
                    progressBars.forEach(bar => {
                        const width = bar.style.width || '0%';
                        bar.style.width = '0%';
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 100);
                    });
                }
            });
        }, observerOptions);
        
        // Observe all major elements
        const elementsToObserve = document.querySelectorAll('.a4-page, .book-chapter, .book-part');
        elementsToObserve.forEach(el => observer.observe(el));
    }
    
    // Page turn effect simulation
    function addPageTurnEffect() {
        const pages = document.querySelectorAll('.a4-page');
        let currentPage = 0;
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                currentPage = Math.min(currentPage + 1, pages.length - 1);
                pages[currentPage].scrollIntoView({ behavior: 'smooth' });
            } else if (e.key === 'ArrowLeft') {
                currentPage = Math.max(currentPage - 1, 0);
                pages[currentPage].scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Smooth scroll enhancement
    function enhanceSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offset = 80; // Account for sticky header
                    const targetPosition = target.offsetTop - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Add brief highlight effect
                    target.style.transition = 'background-color 0.3s ease';
                    target.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
                    setTimeout(() => {
                        target.style.backgroundColor = '';
                    }, 1000);
                }
            });
        });
    }
    
    // Loading animation
    function showLoadingAnimation() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'book-loading';
        document.body.appendChild(loadingDiv);
        
        setTimeout(() => {
            loadingDiv.style.opacity = '0';
            setTimeout(() => {
                loadingDiv.remove();
            }, 500);
        }, 1000);
    }
    
    // Parallax effect for headers
    function addParallaxEffect() {
        const headers = document.querySelectorAll('.book-header, .a4-page-header');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            headers.forEach(header => {
                const rate = scrolled * -0.5;
                header.style.transform = \`translateY(\${rate}px)\`;
            });
        });
    }
    
    // Initialize animations based on user preferences
    function initAnimations() {
        // Respect prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (!prefersReducedMotion.matches) {
            setupScrollAnimations();
            addPageTurnEffect();
            addParallaxEffect();
        }
        
        enhanceSmoothScroll();
        // showLoadingAnimation(); // Uncomment if loading screen is desired
    }
    
    initAnimations();
});`;
    }
}

module.exports = BookAnimationStyles;