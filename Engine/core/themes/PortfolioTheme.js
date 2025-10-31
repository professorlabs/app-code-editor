/**
 * Portfolio Theme - Professional Portfolio Layout
 * Advanced theme for portfolio documents with navbar, sidebars, and responsive design
 */

// Import CSS modules
const MathCSS = require('../styles/MathCSS.js');
const TikZCSS = require('../styles/TikZCSS.js');

class PortfolioTheme {
    constructor() {
        this.name = 'portfolio';
        this.displayName = 'Portfolio Theme';
        this.description = 'Professional portfolio theme with advanced layout components';
        
        this.css = `
/* ===== PORTFOLIO THEME + ENHANCED MATHEMATICAL TYPESETTING ===== */
${MathCSS}
${TikZCSS}

/* ===== PORTFOLIO THEME OVERRIDES FOR MATH ELEMENTS ===== */
/* ===== PORTFOLIO THEME STYLES ===== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #2c3e50;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* ===== TYPOGRAPHY ===== */
.title {
    text-align: center;
    font-size: 3.2em;
    margin-bottom: 15px;
    color: #1a1a1a;
    font-weight: 700;
    line-height: 1.2;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.author {
    text-align: center;
    font-size: 1.4em;
    color: #6c757d;
    margin-bottom: 20px;
    font-weight: 300;
}

.date {
    text-align: center;
    color: #868e96;
    margin-bottom: 40px;
    font-size: 1.1em;
}

/* ===== PORTFOLIO CONTAINER ===== */
.portfolio-container {
    max-width: 1400px;
    margin: 0 auto;
    background: #ffffff;
    min-height: 100vh;
    box-shadow: 0 0 50px rgba(0, 0, 0, 0.1);
}

/* ===== NAVBAR ===== */
.portfolio-navbar {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    color: #ffffff;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffffff;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.navbar-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
    align-items: center;
}

.navbar-item {
    position: relative;
}

.navbar-link {
    color: #ffffff;
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: all 0.3s ease;
    display: block;
}

.navbar-link:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

.navbar-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    width: 0;
    height: 2px;
    background: #3498db;
    transition: all 0.3s ease;
    transform: translateX(-50%);
}

.navbar-link:hover::after {
    width: 80%;
}

/* ===== MAIN LAYOUT ===== */
.portfolio-main {
    display: grid;
    grid-template-columns: 250px 1fr 300px;
    gap: 2rem;
    padding: 2rem;
    min-height: calc(100vh - 80px);
}

/* ===== SIDEBARS ===== */
.portfolio-left-sidebar,
.portfolio-right-sidebar {
    background: #f8f9fa;
    border-radius: 12px;
    padding: 1.5rem;
    height: fit-content;
    position: sticky;
    top: 100px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.portfolio-left-sidebar {
    border-left: 4px solid #3498db;
}

.portfolio-right-sidebar {
    border-right: 4px solid #e74c3c;
}

.sidebar-content {
    color: #495057;
}

/* ===== TABLE OF CONTENTS ===== */
.table-of-contents h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
    font-size: 1.2rem;
    font-weight: 600;
    border-bottom: 2px solid #3498db;
    padding-bottom: 0.5rem;
}

.toc-list {
    list-style: none;
    padding-left: 0;
}

.toc-item {
    margin-bottom: 0.5rem;
}

.toc-link {
    color: #3498db;
    text-decoration: none;
    font-weight: 500;
    display: block;
    padding: 0.3rem 0.5rem;
    border-radius: 4px;
    transition: all 0.3s ease;
}

.toc-link:hover {
    background: #3498db;
    color: #ffffff;
    transform: translateX(5px);
}

/* ===== RECENT POSTS ===== */
.recent-posts h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
    font-size: 1.2rem;
    font-weight: 600;
    border-bottom: 2px solid #e74c3c;
    padding-bottom: 0.5rem;
}

.posts-list {
    list-style: none;
    padding-left: 0;
}

.post-item {
    margin-bottom: 0.8rem;
}

.post-link {
    color: #e74c3c;
    text-decoration: none;
    font-weight: 500;
    display: block;
    padding: 0.3rem 0.5rem;
    border-radius: 4px;
    transition: all 0.3s ease;
    font-size: 0.9rem;
}

.post-link:hover {
    background: #e74c3c;
    color: #ffffff;
    transform: translateX(5px);
}

/* ===== SIDEBAR LISTS ===== */
.sidebar-list-container {
    margin: 1rem 0;
}

.sidebar-list {
    list-style: none;
    padding-left: 0;
}

.sidebar-list-unordered li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #e9ecef;
    position: relative;
    padding-left: 1.5rem;
}

.sidebar-list-unordered li::before {
    content: '▸';
    position: absolute;
    left: 0;
    color: #3498db;
    font-weight: bold;
}

.sidebar-list-ordered {
    counter-reset: sidebar-counter;
    list-style: none;
    padding-left: 0;
}

.sidebar-list-ordered li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #e9ecef;
    position: relative;
    padding-left: 2rem;
    counter-increment: sidebar-counter;
}

.sidebar-list-ordered li::before {
    content: counter(sidebar-counter);
    position: absolute;
    left: 0;
    background: #e74c3c;
    color: #ffffff;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: bold;
}

.sidebar-link {
    color: #3498db;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
}

.sidebar-link:hover {
    color: #2980b9;
    text-decoration: underline;
}

/* ===== LAYOUT IMAGES ===== */
.layout-image {
    max-width: 100%;
    height: auto;
    margin: 1rem 0;
    transition: all 0.3s ease;
}

.img-small {
    max-width: 80px;
    max-height: 80px;
}

.img-medium {
    max-width: 150px;
    max-height: 150px;
}

.img-large {
    max-width: 200px;
    max-height: 200px;
}

.img-square {
    border-radius: 8px;
}

.img-round {
    border-radius: 12px;
}

.img-circle {
    border-radius: 50%;
}

.img-resizable {
    cursor: nwse-resize;
}

.layout-image:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* ===== MAIN CONTENT ===== */
.portfolio-content {
    background: #ffffff;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

/* ===== SECTIONS ===== */
.portfolio-content h2 {
    font-size: 2.2em;
    margin: 40px 0 20px 0;
    color: #2c3e50;
    border-bottom: 3px solid #3498db;
    padding-bottom: 15px;
    font-weight: 600;
    position: relative;
}

.portfolio-content h3 {
    font-size: 1.8em;
    margin: 30px 0 15px 0;
    color: #34495e;
    font-weight: 500;
}

.portfolio-content h4 {
    font-size: 1.4em;
    margin: 25px 0 12px 0;
    color: #495057;
    font-weight: 500;
}

/* ===== PORTFOLIO COMPONENTS ===== */
.portfolio-project {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-left: 4px solid #28a745;
    padding: 1.5rem;
    margin: 2rem 0;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.portfolio-project:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.project-content {
    color: #495057;
    line-height: 1.6;
}

.blog-post {
    background: linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%);
    border-left: 4px solid #ffc107;
    padding: 1.5rem;
    margin: 2rem 0;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.blog-post:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.blog-content {
    color: #495057;
    line-height: 1.6;
}

.contact-section {
    background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);
    border-left: 4px solid #28a745;
    padding: 1.5rem;
    margin: 2rem 0;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.contact-content {
    color: #155724;
    font-weight: 500;
}

/* ===== FOOTER ===== */
.portfolio-footer {
    background: #2c3e50;
    color: #ffffff;
    padding: 2rem;
    text-align: center;
    margin-top: auto;
}

.footer-content {
    font-size: 1rem;
    line-height: 1.6;
}

/* ===== CONTACT INFO ===== */
.contact-info h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
    font-size: 1.2rem;
    font-weight: 600;
    border-bottom: 2px solid #17a2b8;
    padding-bottom: 0.5rem;
}

.contact-details p {
    margin-bottom: 0.8rem;
    color: #495057;
}

.social-links {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.social-link {
    background: #007bff;
    color: #ffffff;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
}

.social-link:hover {
    background: #0056b3;
    transform: translateY(-2px);
}

/* ===== PARAGRAPHS ===== */
.portfolio-paragraph {
    margin: 18px 0;
    text-align: justify;
    line-height: 1.8;
    color: #495057;
}

/* ===== LISTS ===== */
.portfolio-list {
    margin: 20px 0;
    padding-left: 30px;
}

.portfolio-list li {
    margin: 10px 0;
    color: #495057;
    line-height: 1.6;
}

.portfolio-list-unordered::marker {
    color: #3498db;
    font-size: 1.2em;
}

.portfolio-list-ordered::marker {
    color: #e74c3c;
    font-weight: bold;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 1200px) {
    .portfolio-main {
        grid-template-columns: 200px 1fr 250px;
        gap: 1.5rem;
    }
    
    .navbar-menu {
        gap: 1rem;
    }
}

@media (max-width: 992px) {
    .portfolio-main {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .portfolio-left-sidebar,
    .portfolio-right-sidebar {
        position: static;
        margin-bottom: 1rem;
    }
    
    .navbar-menu {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .navbar {
        flex-direction: column;
        text-align: center;
        padding: 1rem;
    }
}

@media (max-width: 768px) {
    body {
        padding: 0;
    }
    
    .title {
        font-size: 2.2em;
    }
    
    .portfolio-content {
        padding: 1rem;
    }
    
    .portfolio-left-sidebar,
    .portfolio-right-sidebar {
        padding: 1rem;
    }
    
    .portfolio-main {
        padding: 1rem;
    }
    
    .social-links {
        flex-direction: column;
        align-items: center;
    }
}

@media (max-width: 480px) {
    .title {
        font-size: 1.8em;
    }
    
    .portfolio-content {
        padding: 0.8rem;
    }
    
    .portfolio-main {
        padding: 0.8rem;
    }
    
    .navbar-brand {
        font-size: 1.2rem;
    }
    
    .navbar-link {
        padding: 0.3rem 0.6rem;
        font-size: 0.9rem;
    }
}

/* ===== PRINT STYLES ===== */
@media print {
    body {
        background: white;
        color: black;
    }
    
    .portfolio-container {
        box-shadow: none;
    }
    
    .portfolio-navbar {
        background: white;
        color: black;
        box-shadow: none;
        border-bottom: 2px solid black;
    }
    
    .portfolio-left-sidebar,
    .portfolio-right-sidebar {
        display: none;
    }
    
    .portfolio-main {
        grid-template-columns: 1fr;
        padding: 1rem;
    }
    
    .portfolio-footer {
        background: white;
        color: black;
        border-top: 2px solid black;
    }
}

/* ===== ANIMATIONS ===== */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.portfolio-content {
    animation: fadeIn 0.6s ease-out;
}

.portfolio-left-sidebar {
    animation: slideInLeft 0.6s ease-out;
}

.portfolio-right-sidebar {
    animation: slideInRight 0.6s ease-out;
}
`;
    }

    generateHTML(metadata, content) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata.title}</title>
    <meta name="author" content="${metadata.author}">
    <meta name="description" content="Professional portfolio">
    <meta name="keywords" content="portfolio, professional, projects">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${metadata.title}">
    <meta property="og:description" content="Professional portfolio">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="${metadata.title}">
    <meta property="twitter:description" content="Professional portfolio">
    
    <style>
${this.css}
    </style>
</head>
<body>
    ${content}
    
    <script>
// Portfolio JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Active navigation highlighting
    const sections = document.querySelectorAll('h2[id], h3[id]');
    const navLinks = document.querySelectorAll('.navbar-link, .toc-link, .post-link');
    
    function highlightActiveSection() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveSection);
    
    // Navbar hide/show on scroll
    let lastScrollTop = 0;
    const navbar = document.querySelector('.portfolio-navbar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
    
    // Image lazy loading and error handling
    const images = document.querySelectorAll('.layout-image');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0zMCA2MEg3MFY0MEgzMFY2MFoiIGZpbGw9IiNEREREREQiLz4KPHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI0MCIgeT0iNDAiPgo8cGF0aCBkPSJNMTAgNEM2LjY4NjMgNCA0IDYuNjg2MyA0IDEwUzYuNjg2MyAxNiAxMCAxNlMxNiAxMy4zMTM3IDE2IDEwUzEzLjMxMzcgNCAxMCA0Wk0xMCA4QzguODk1NDMgOCA4IDguODk1NDMgOCAxMFM4Ljg5NTQzIDEyIDEwIDEyUzEyIDExLjEwNDYgMTIgMTBTMTEuMTA0NiA4IDEwIDhaIiBmaWxsPSIjOTk5OTk5Ii8+Cjwvc3ZnPgo8L3N2Zz4K';
        });
    });
    
    // Portfolio grid layout for projects
    const projects = document.querySelectorAll('.portfolio-project');
    if (projects.length > 1) {
        projects.forEach((project, index) => {
            project.style.animationDelay = `${index * 0.1}s`;
            project.style.animation = 'fadeIn 0.6s ease-out forwards';
        });
    }
    
    // Interactive hover effects
    const portfolioItems = document.querySelectorAll('.portfolio-project, .blog-post');
    
    portfolioItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Copy functionality for contact info
    const contactEmail = document.querySelector('.contact-content');
    if (contactEmail) {
        contactEmail.style.cursor = 'pointer';
        contactEmail.addEventListener('click', function() {
            const email = this.textContent;
            navigator.clipboard.writeText(email).then(() => {
                const originalText = this.textContent;
                this.textContent = 'Copied to clipboard!';
                this.style.background = '#28a745';
                this.style.color = '#ffffff';
                
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.background = '';
                    this.style.color = '';
                }, 2000);
            });
        });
    }
});
</script>
</body>
</html>`;
    }
}

module.exports = PortfolioTheme;