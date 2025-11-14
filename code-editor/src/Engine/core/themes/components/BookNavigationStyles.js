/**
 * Book Navigation Styles Component
 * Handles sidebar navigation and table of contents styling
 */

class BookNavigationStyles {
    constructor() {
        this.navigationSettings = {
            sidebarWidth: '300px',
            stickyOffset: '60px',
            animationDuration: '0.3s'
        };
    }

    /**
     * Generate navigation CSS
     */
    generateCSS() {
        return `
/* Simple Sidebar Navigation */
.book-sidebar {
    padding: 0;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    z-index: 100;
}

.sticky-sidebar {
    position: fixed;
    top: 60px;
    left: 0;
    width: 320px;
    height: calc(100vh - 60px);
    transition: transform 0.3s ease;
}

/* Sidebar Header */
.sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 1rem 1rem 1rem;
    border-bottom: 1px solid #e0e0e0;
}

.sidebar-title {
    font-size: 1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.sidebar-toggle {
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
}

/* Sidebar Content */
.sidebar-content {
    padding: 1rem;
    color: #374151;
    height: calc(100% - 80px);
    overflow-y: auto;
}

/* Navigation Sections */
.nav-section {
    margin-bottom: 1rem;
    padding: 1rem;
}

.nav-section-title {
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 0.5rem;
}

/* Navigation Lists */
.nav-list {
    list-style: none;
    padding-left: 0;
    margin: 0;
}

.nav-list li {
    margin-bottom: 0.25rem;
}

/* Navigation Links */
.nav-link {
    color: #666666;
    text-decoration: none;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 0.5rem;
    font-size: 0.85rem;
    border-left: 3px solid transparent;
}

.nav-link:hover {
    color: #333333;
    border-left-color: #333333;
}

.nav-link.active {
    color: #333333;
    border-left-color: #333333;
    font-weight: 700;
}

/* Chapter-specific styling */
.chapter-link {
    position: relative;
}

.chapter-number {
    border: 1px solid #333333;
    color: #333333;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    flex-shrink: 0;
}

.chapter-title {
    flex: 1;
    margin-left: 0.75rem;
    font-size: 0.85rem;
    line-height: 1.3;
}

.chapter-progress {
    height: 2px;
    background: #333333;
    border-radius: 1px;
    margin-left: 0.5rem;
}

/* Progress Indicators */
.chapters-progress {
    margin-bottom: 1rem;
}

.progress-bar {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 0.5rem;
}

.progress-fill {
    height: 100%;
    background: #333333;
    border-radius: 3px;
}

.progress-text {
    font-size: 0.75rem;
    color: #666666;
    text-align: center;
    font-weight: 500;
}

/* Reading Position Indicator */
.reading-position {
    margin-top: 0.5rem;
}

.position-indicator {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.current-page {
    font-size: 0.85rem;
    font-weight: 600;
    color: #333333;
}

.scroll-progress {
    width: 40px;
    height: 60px;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
}

.scroll-fill {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #333333;
    border-radius: 20px;
}

/* Table of Contents */
.table-of-contents {
    margin: 2rem 0;
    padding: 2rem;
}

.toc-title {
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 2rem;
    border-bottom: 2px solid #333333;
    padding-bottom: 1rem;
}

.toc-navigation {
    line-height: 1.8;
}

.toc-section {
    margin-bottom: 1rem;
}

.toc-item {
    margin: 0.5rem 0;
}

.toc-link {
    display: flex;
    align-items: center;
    color: #495057;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.3s ease;
    border-left: 3px solid transparent;
}

.toc-link:hover {
    background: #333333;
    color: #ffffff;
}

.toc-number {
    font-weight: 600;
    margin-right: 1rem;
    min-width: 120px;
}

.toc-title-text {
    flex: 1;
}

.toc-progress {
    height: 2px;
    background: #333333;
    border-radius: 1px;
    margin-left: 0.5rem;
}

.toc-indicator {
    opacity: 0;
    transition: all 0.3s ease;
}

.toc-link:hover .toc-indicator {
    opacity: 1;
    transform: translateX(5px);
}

/* TOC Level Styling */
.toc-part .toc-link {
    font-size: 1.2rem;
    font-weight: 700;
    border-left-color: #333333;
}

.toc-chapter .toc-link {
    font-size: 1.1rem;
    font-weight: 600;
    border-left-color: #555555;
}

.toc-section .toc-link {
    font-size: 1rem;
    font-weight: 500;
    border-left-color: #777777;
    margin-left: 2rem;
}

.toc-subsection .toc-link {
    font-size: 0.9rem;
    font-weight: 400;
    border-left-color: #999999;
    margin-left: 4rem;
}

/* Breadcrumbs */
.breadcrumbs {
    padding: 1rem;
    border-bottom: 1px solid #e0e0e0;
}

.breadcrumb-list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
}

.breadcrumb-list li {
    margin-right: 0.5rem;
}

.breadcrumb-list li:not(:last-child)::after {
    content: '/';
    margin-left: 0.5rem;
    color: #6c757d;
}

.breadcrumb-list li.current {
    font-weight: 600;
    color: #2c3e50;
}

/* Sidebar Scrollbar */
.book-sidebar::-webkit-scrollbar {
    width: 6px;
}

.book-sidebar::-webkit-scrollbar-track {
    background: transparent;
}

.book-sidebar::-webkit-scrollbar-thumb {
    background: #333333;
    border-radius: 3px;
}

/* Responsive Navigation */
@media (max-width: 1024px) {
    .book-sidebar {
        position: relative;
        height: auto;
        margin-bottom: 2rem;
        border-right: none;
        border-bottom: 3px solid #e74c3c;
    }
    
    .sidebar-content {
        height: auto;
    }
}

@media (max-width: 768px) {
    .book-sidebar {
        padding: 0;
        margin-bottom: 1rem;
    }
    
    .sidebar-header {
        padding: 1rem;
    }
    
    .sidebar-content {
        padding: 0.5rem;
    }
    
    .nav-section {
        padding: 0.5rem;
        margin-bottom: 1rem;
    }
    
    .nav-link {
        font-size: 0.8rem;
        padding: 0.5rem;
    }
    
    .table-of-contents {
        padding: 1rem;
        margin: 1rem 0;
    }
}`;
    }

    /**
     * Generate navigation script
     */
    generateNavigationScript() {
        return `
// Enhanced Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    function initAdvancedNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const tocLinks = document.querySelectorAll('.toc-link');
        const sections = document.querySelectorAll('.book-part, .book-chapter, .a4-page');
        const sidebar = document.querySelector('.book-sidebar');
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        
        // Sidebar toggle functionality
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', function() {
                sidebar.classList.toggle('collapsed');
                this.textContent = sidebar.classList.contains('collapsed') ? 'Menu' : 'Close';
            });
        }
        
        // Smooth scrolling for navigation links
        function setupSmoothScrolling() {
            [...navLinks, ...tocLinks].forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        const headerHeight = 80;
                        const targetPosition = targetSection.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        history.pushState(null, null, targetId);
                        
                        // Flash effect
                        targetSection.style.transition = 'background-color 0.3s ease';
                        targetSection.style.backgroundColor = '#fef2f2';
                        setTimeout(() => {
                            targetSection.style.backgroundColor = '';
                        }, 1000);
                    }
                });
            });
        }
        
        // Update progress indicators
        function updateProgressIndicators(currentSection, progress) {
            const chapterLinks = document.querySelectorAll('.chapter-link');
            chapterLinks.forEach(link => {
                const linkSection = link.getAttribute('href');
                if (linkSection && currentSection.id.includes(linkSection.replace('#', ''))) {
                    const progressBar = link.querySelector('.chapter-progress');
                    if (progressBar) {
                        progressBar.style.width = progress + '%';
                    }
                }
            });
        }
        
        // Intersection Observer for scroll animations
        function setupIntersectionObserver() {
            const observerOptions = {
                threshold: [0.1, 0.5, 0.9],
                rootMargin: '-100px 0px -100px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        
                        // Update active navigation
                        const navLink = document.querySelector(\`.nav-link[href="#\${entry.target.id}"]\`);
                        if (navLink) {
                            navLinks.forEach(link => link.classList.remove('active'));
                            navLink.classList.add('active');
                        }
                    }
                });
            }, observerOptions);
            
            sections.forEach(section => observer.observe(section));
        }
        
        // Keyboard navigation
        function setupKeyboardNavigation() {
            document.addEventListener('keydown', function(e) {
                if (e.altKey) {
                    switch(e.key) {
                        case 'ArrowLeft':
                            e.preventDefault();
                            navigateToPreviousSection();
                            break;
                        case 'ArrowRight':
                            e.preventDefault();
                            navigateToNextSection();
                            break;
                        case 'ArrowUp':
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                            break;
                    }
                }
            });
        }
        
        function navigateToPreviousSection() {
            const currentSection = [...sections].find(section => 
                window.scrollY >= section.offsetTop - 100 && 
                window.scrollY < section.offsetTop + section.offsetHeight - 100
            );
            
            if (currentSection) {
                const currentIndex = [...sections].indexOf(currentSection);
                if (currentIndex > 0) {
                    const prevSection = sections[currentIndex - 1];
                    prevSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
        
        function navigateToNextSection() {
            const currentSection = [...sections].find(section => 
                window.scrollY >= section.offsetTop - 100 && 
                window.scrollY < section.offsetTop + section.offsetHeight - 100
            );
            
            if (currentSection) {
                const currentIndex = [...sections].indexOf(currentSection);
                if (currentIndex < sections.length - 1) {
                    const nextSection = sections[currentIndex + 1];
                    nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
        
        // Initialize all navigation features
        setupSmoothScrolling();
        setupIntersectionObserver();
        setupKeyboardNavigation();
        
        // Update active nav on scroll
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY + 150;
            
            let currentSection = null;
            let currentProgress = 0;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.id;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = section;
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        const href = link.getAttribute('href');
                        if (href === \`#\${sectionId}\` || href.includes(sectionId)) {
                            link.classList.add('active');
                        }
                    });
                    
                    tocLinks.forEach(link => {
                        link.classList.remove('active');
                        const href = link.getAttribute('href');
                        if (href === \`#\${sectionId}\`) {
                            link.classList.add('active');
                        }
                    });
                    
                    const sectionProgress = ((scrollPosition - sectionTop) / sectionHeight) * 100;
                    currentProgress = Math.min(sectionProgress, 100);
                }
            });
            
            updateProgressIndicators(currentSection, currentProgress);
        });
    }
    
    initAdvancedNavigation();
});`;
    }
}

module.exports = BookNavigationStyles;