/**
 * Professional eBook Book Theme
 * Advanced theme for book documents with security features, pagination, and professional styling
 */

class BookTheme {
    constructor() {
        this.name = 'book';
        this.displayName = 'Professional eBook Theme';
        this.description = 'Advanced theme for professional eBooks with security and pagination';
        
        this.css = `
/* ===== PROFESSIONAL EBOOK THEME STYLES ===== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Georgia', 'Times New Roman', serif;
    line-height: 1.6;
    color: #2c3e50;
    background: #f5f5f5;
    overflow-x: hidden;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* ===== BOOK CONTAINER ===== */
.book-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
}

/* ===== BOOK HEADER ===== */
.book-header {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    color: #ffffff;
    padding: 1rem 2rem;
    text-align: center;
    border-bottom: 3px solid #e74c3c;
}

.book-title {
    font-size: 1.5rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 0.5rem;
}

.book-author {
    font-size: 1.1rem;
    font-weight: 300;
    opacity: 0.9;
}

/* ===== BOOK LAYOUT ===== */
.book-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
    flex: 1;
    min-height: calc(100vh - 120px);
}

/* ===== SIDEBAR NAVIGATION ===== */
.book-sidebar {
    background: #f8f9fa;
    border-right: 3px solid #e74c3c;
    padding: 2rem 1.5rem;
    position: sticky;
    top: 0;
    height: calc(100vh - 120px);
    overflow-y: auto;
}

.sidebar-content {
    color: #495057;
}

.sidebar-content h3 {
    color: #2c3e50;
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
    font-weight: 600;
    border-bottom: 2px solid #e74c3c;
    padding-bottom: 0.5rem;
}

.sidebar-nav {
    margin-top: 1rem;
}

.nav-list {
    list-style: none;
    padding-left: 0;
    margin: 0;
}

.nav-list li {
    margin-bottom: 0.5rem;
}

.nav-link {
    color: #495057;
    text-decoration: none;
    font-weight: 500;
    display: block;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    transition: all 0.3s ease;
    font-size: 0.9rem;
    border-left: 3px solid transparent;
}

.nav-link:hover {
    background: #e74c3c;
    color: #ffffff;
    border-left-color: #c0392b;
    transform: translateX(5px);
}

.nav-link.active {
    background: #e74c3c;
    color: #ffffff;
    border-left-color: #c0392b;
}

/* ===== MAIN BOOK CONTENT ===== */
.book-main {
    padding: 2rem;
    background: #ffffff;
    overflow-y: auto;
    max-height: calc(100vh - 120px);
}

/* ===== PAGES ===== */
.page {
    min-height: calc(100vh - 200px);
    margin-bottom: 3rem;
    padding: 3rem 4rem;
    background: #ffffff;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    position: relative;
}

.page-content {
    min-height: calc(100vh - 280px);
    margin-bottom: 2rem;
}

.page-footer {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid #e9ecef;
    font-size: 0.9rem;
    color: #6c757d;
}

.page-number {
    font-weight: 600;
    color: #2c3e50;
}

/* ===== MATTER CLASSES ===== */
.page.frontmatter .page-number {
    font-family: 'Times New Roman', serif;
    font-style: italic;
}

.page.mainmatter .page-number {
    font-family: 'Georgia', serif;
}

.page.appendix .page-number {
    font-family: 'Georgia', serif;
}

/* ===== TITLE PAGE ===== */
.title-page {
    min-height: calc(100vh - 200px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 4rem 2rem;
}

.title-page-titles h1 {
    font-size: 3rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 1rem;
    line-height: 1.2;
    text-transform: uppercase;
    letter-spacing: 3px;
}

.title-page-authors {
    margin: 2rem 0;
}

.title-page-author {
    font-size: 1.5rem;
    color: #495057;
    margin-bottom: 0.5rem;
    font-weight: 300;
}

.title-page-date {
    font-size: 1.1rem;
    color: #6c757d;
    margin-top: 2rem;
    font-style: italic;
}

.title-page-publisher,
.title-page-location,
.title-page-isbn,
.title-page-edition {
    font-size: 1rem;
    color: #6c757d;
    margin-top: 1rem;
    font-weight: 300;
}

/* ===== DEDICATION PAGE ===== */
.dedication-page {
    min-height: calc(100vh - 200px);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-style: italic;
    font-size: 1.2rem;
    color: #6c757d;
    padding: 4rem 2rem;
}

/* ===== PART TITLE PAGE ===== */
.book-part {
    min-height: calc(100vh - 200px);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin: 2rem 0;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 8px;
}

.part-title-page {
    padding: 2rem;
}

.part-header {
    font-size: 2rem;
    font-weight: 700;
    color: #e74c3c;
    text-transform: uppercase;
    letter-spacing: 4px;
    margin-bottom: 1rem;
}

.part-title {
    font-size: 2.5rem;
    font-weight: 300;
    color: #2c3e50;
    line-height: 1.2;
    margin-bottom: 0.5rem;
}

.part-subtitle {
    font-size: 1.5rem;
    color: #6c757d;
    font-weight: 300;
    font-style: italic;
}

/* ===== CHAPTER TITLE PAGE ===== */
.book-chapter {
    margin: 2rem 0;
}

.chapter-title-page {
    text-align: center;
    padding: 2rem;
    border-bottom: 3px solid #e74c3c;
    margin-bottom: 2rem;
}

.chapter-number {
    font-size: 1.8rem;
    font-weight: 700;
    color: #e74c3c;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 0.5rem;
}

.chapter-title {
    font-size: 2rem;
    font-weight: 300;
    color: #2c3e50;
    line-height: 1.2;
}

.chapter-subtitle {
    font-size: 1.3rem;
    color: #6c757d;
    font-weight: 300;
    font-style: italic;
    margin-top: 0.5rem;
}

/* ===== SECTIONS ===== */
.book-main h1 {
    font-size: 2.2em;
    margin: 50px 0 25px 0;
    color: #1a1a1a;
    border-bottom: 3px solid #e74c3c;
    padding-bottom: 15px;
    font-weight: 600;
}

.book-main h2 {
    font-size: 1.8em;
    margin: 40px 0 20px 0;
    color: #2c3e50;
    font-weight: 600;
}

.book-main h3 {
    font-size: 1.4em;
    margin: 30px 0 15px 0;
    color: #34495e;
    font-weight: 500;
}

.book-main h4 {
    font-size: 1.2em;
    margin: 25px 0 12px 0;
    color: #495057;
    font-weight: 500;
}

/* ===== THEOREM ENVIRONMENTS ===== */
.theorem {
    margin: 2rem 0;
    padding: 1.5rem;
    border: 2px solid #3498db;
    border-radius: 8px;
    background: #f8f9fa;
}

.theorem-header {
    font-weight: 700;
    color: #3498db;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.theorem-content {
    color: #2c3e50;
    line-height: 1.6;
}

.theorem-proof-marker {
    text-align: right;
    margin-top: 1rem;
    font-size: 1.2rem;
    color: #3498db;
    font-weight: 700;
}

.proof {
    margin: 2rem 0;
    padding: 1.5rem;
    border-left: 4px solid #27ae60;
    background: #f8f9fa;
}

.proof-header {
    font-weight: 700;
    color: #27ae60;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.proof-content {
    color: #2c3e50;
    line-height: 1.6;
}

.proof-end {
    text-align: right;
    margin-top: 1rem;
    font-size: 1.2rem;
    color: #27ae60;
    font-weight: 700;
}

/* ===== PARAGRAPHS ===== */
.book-main p {
    margin: 18px 0;
    text-align: justify;
    line-height: 1.8;
    color: #2c3e50;
    text-indent: 2em;
}

.book-main p:first-of-type {
    text-indent: 0;
}

/* ===== TEXT FORMATTING ===== */
.textbf {
    font-weight: 700;
    color: #2c3e50;
}

.textit {
    font-style: italic;
    color: #6c757d;
}

.texttt {
    font-family: 'Courier New', monospace;
    background: #f1f3f4;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.9em;
    color: #d63384;
}

.emph {
    font-style: italic;
    color: #e74c3c;
}

.underline {
    text-decoration: underline;
    text-decoration-color: #e74c3c;
    text-underline-offset: 4px;
}

.small-caps {
    font-variant: small-caps;
    color: #495057;
}

.sans-serif {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.roman {
    font-family: 'Georgia', 'Times New Roman', serif;
}

/* ===== SIZE CLASSES ===== */
.size-tiny { font-size: 0.7em; }
.size-scriptsize { font-size: 0.8em; }
.size-footnotesize { font-size: 0.9em; }
.size-small { font-size: 0.95em; }
.size-normalsize { font-size: 1em; }
.size-large { font-size: 1.2em; }
.size-Large { font-size: 1.44em; }
.size-LARGE { font-size: 1.728em; }
.size-huge { font-size: 2.074em; }
.size-Huge { font-size: 2.488em; }

/* ===== LISTS ===== */
.book-main ul {
    margin: 20px 0 20px 30px;
    padding-left: 20px;
}

.book-main ol {
    margin: 20px 0 20px 30px;
    padding-left: 20px;
}

.book-main li {
    margin: 10px 0;
    color: #495057;
    line-height: 1.6;
}

.book-main ul li::marker {
    color: #e74c3c;
    font-size: 1.2em;
}

.book-main ol li::marker {
    color: #e74c3c;
    font-weight: bold;
}

/* ===== TABLE OF CONTENTS ===== */
.table-of-contents {
    margin: 2rem 0;
    padding: 2rem;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    background: #f8f9fa;
}

.toc-title {
    font-size: 2rem;
    text-align: center;
    color: #2c3e50;
    margin-bottom: 2rem;
    border-bottom: 3px solid #e74c3c;
    padding-bottom: 1rem;
}

.toc-content {
    line-height: 1.8;
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
    background: #e74c3c;
    color: #ffffff;
    transform: translateX(5px);
}

.toc-number {
    font-weight: 600;
    margin-right: 1rem;
    min-width: 120px;
}

.toc-title-text {
    flex: 1;
}

.toc-part .toc-link {
    font-size: 1.2rem;
    font-weight: 700;
    border-left-color: #e74c3c;
}

.toc-chapter .toc-link {
    font-size: 1.1rem;
    font-weight: 600;
    border-left-color: #3498db;
}

.toc-section .toc-link {
    font-size: 1rem;
    font-weight: 500;
    border-left-color: #95a5a6;
    margin-left: 2rem;
}

.toc-subsection .toc-link {
    font-size: 0.9rem;
    font-weight: 400;
    border-left-color: #bdc3c7;
    margin-left: 4rem;
}

/* ===== BOOK FOOTER ===== */
.book-footer {
    background: #2c3e50;
    color: #ffffff;
    padding: 2rem;
    text-align: center;
    border-top: 3px solid #e74c3c;
}

.footer-content p {
    margin: 0.5rem 0;
    color: #ffffff;
}

.copy-protected {
    background: #e74c3c;
    color: #ffffff;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-weight: 600;
    display: inline-block;
}

/* ===== PAGE BREAK ===== */
.page-break {
    page-break-before: always;
    margin: 3rem 0;
    border-top: 2px dashed #e9ecef;
    padding-top: 2rem;
    text-align: center;
    color: #adb5bd;
    font-style: italic;
}

.page-break::before {
    content: "— Page Break —";
    display: block;
    margin-bottom: 1rem;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 1024px) {
    .book-layout {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .book-sidebar {
        position: relative;
        height: auto;
        margin-bottom: 2rem;
        border-right: none;
        border-bottom: 3px solid #e74c3c;
    }
    
    .page {
        padding: 2rem;
    }
}

@media (max-width: 768px) {
    .book-container {
        margin: 0;
        box-shadow: none;
    }
    
    .book-header {
        padding: 1rem;
    }
    
    .book-title {
        font-size: 1.2rem;
    }
    
    .book-main {
        padding: 1rem;
    }
    
    .page {
        padding: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .title-page-titles h1 {
        font-size: 2rem;
    }
    
    .part-title {
        font-size: 2rem;
    }
    
    .chapter-title {
        font-size: 1.8rem;
    }
}

@media (max-width: 480px) {
    .book-header {
        padding: 0.5rem;
    }
    
    .book-title {
        font-size: 1rem;
        letter-spacing: 1px;
    }
    
    .book-main {
        padding: 0.5rem;
    }
    
    .page {
        padding: 1rem;
    }
    
    .title-page-titles h1 {
        font-size: 1.5rem;
    }
    
    .part-title {
        font-size: 1.5rem;
    }
    
    .chapter-title {
        font-size: 1.3rem;
    }
    
    .book-sidebar {
        padding: 1rem;
    }
    
    .nav-link {
        font-size: 0.8rem;
        padding: 0.3rem 0.5rem;
    }
}

/* ===== PRINT STYLES ===== */
@media print {
    body {
        background: white;
        color: black;
    }
    
    .book-container {
        max-width: 100%;
        box-shadow: none;
        margin: 0;
    }
    
    .book-header,
    .book-sidebar,
    .book-footer {
        display: none;
    }
    
    .book-layout {
        grid-template-columns: 1fr;
        gap: 0;
    }
    
    .page {
        min-height: calc(100vh - 100px);
        margin: 0;
        border: none;
        box-shadow: none;
        page-break-inside: avoid;
        padding: 2rem;
    }
    
    .page-break {
        page-break-before: always;
        border: none;
        margin: 0;
        padding: 0;
    }
    
    .page-break::before {
        display: none;
    }
}

/* ===== SECURITY FEATURES ===== */
.copy-protected::selection {
    background: #e74c3c;
    color: #ffffff;
}

.no-copy {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}

.no-screenshot {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    position: relative;
}

.no-screenshot::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    pointer-events: none;
}

/* ===== SCROLLBARS ===== */
.book-sidebar::-webkit-scrollbar {
    width: 8px;
}

.book-sidebar::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.book-sidebar::-webkit-scrollbar-thumb {
    background: #e74c3c;
    border-radius: 4px;
}

.book-sidebar::-webkit-scrollbar-thumb:hover {
    background: #c0392b;
}

.book-main::-webkit-scrollbar {
    width: 8px;
}

.book-main::-webkit-scrollbar-track {
    background: #f1f1f1;
}

.book-main::-webkit-scrollbar-thumb {
    background: #95a5a6;
    border-radius: 4px;
}

.book-main::-webkit-scrollbar-thumb:hover {
    background: #7f8c8d;
}

/* ===== LOADING ANIMATIONS ===== */
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

.book-main > * {
    animation: fadeIn 0.6s ease-out;
}
`;
    }

    generateHTML(metadata, content) {
        const securityHTML = this.generateSecurityHTML();
        
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata.title}</title>
    <meta name="author" content="${metadata.author}">
    <meta name="description" content="Professional eBook generated from LaTeX">
    <meta name="keywords" content="ebook, ${metadata.title}, ${metadata.author}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="book">
    <meta property="og:title" content="${metadata.title}">
    <meta property="og:description" content="Professional eBook">
    <meta property="og:author" content="${metadata.author}">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="${metadata.title}">
    <meta property="twitter:description" content="Professional eBook">
    <meta property="twitter:author" content="${metadata.author}">
    
    <!-- Security headers -->
    <meta name="robots" content="noindex, nofollow">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-Frame-Options" content="DENY">
    
    <style>
${this.css}
${securityHTML}
    </style>
</head>
<body class="no-copy no-screenshot">
    ${content}
    
    <script>
// Professional eBook Security and Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Prevent right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Prevent text selection
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Prevent drag
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Prevent print screen attempts (basic detection)
    document.addEventListener('keydown', function(e) {
        // Print shortcuts
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            alert('Printing is disabled for this protected content.');
            return false;
        }
        
        // Screenshot shortcuts (Windows + Mac)
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            return false;
        }
        
        if (e.metaKey && e.shiftKey && e.key === '4') {
            e.preventDefault();
            return false;
        }
        
        // Copy shortcuts
        if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'x' || e.key === 'a')) {
            e.preventDefault();
            return false;
        }
        
        // F12 and other developer tools shortcuts
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
            e.preventDefault();
            return false;
        }
    });
    
    // Prevent paste
    document.addEventListener('paste', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Add watermark
    function addWatermark() {
        const watermark = document.createElement('div');
        watermark.style.position = 'fixed';
        watermark.style.top = '50%';
        watermark.style.left = '50%';
        watermark.style.transform = 'translate(-50%, -50%) rotate(-45deg)';
        watermark.style.fontSize = '100px';
        watermark.style.color = 'rgba(231, 76, 60, 0.1)';
        watermark.style.fontWeight = 'bold';
        watermark.style.pointerEvents = 'none';
        watermark.style.zIndex = '9999';
        watermark.style.userSelect = 'none';
        watermark.textContent = 'PROTECTED';
        document.body.appendChild(watermark);
    }
    
    addWatermark();
    
    // Navigation functionality
    function initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.book-part, .book-chapter, .page');
        
        // Highlight active navigation
        function highlightActiveNav() {
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.id;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    
                    const activeLink = document.querySelector(\`.nav-link[href="#\${sectionId}"]\`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                        activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }
                }
            });
        }
        
        // Smooth scrolling for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Update active nav on scroll
        window.addEventListener('scroll', highlightActiveNav);
        highlightActiveNav(); // Initial call
    }
    
    initNavigation();
    
    // Page detection and current page highlighting
    function initPagination() {
        const pages = document.querySelectorAll('.page');
        const sidebarLinks = document.querySelectorAll('.nav-link');
        
        function updateCurrentPage() {
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            
            pages.forEach((page, index) => {
                const pageTop = page.offsetTop;
                const pageBottom = pageTop + page.offsetHeight;
                
                if (scrollPosition >= pageTop && scrollPosition < pageBottom) {
                    // Update page number display
                    const pageNumber = page.dataset.page;
                    document.title = \`Page \${pageNumber} - \${document.title.replace(/^Page \\d+ - /, '')}\`;
                }
            });
        }
        
        window.addEventListener('scroll', updateCurrentPage);
        updateCurrentPage();
    }
    
    initPagination();
    
    // Console protection
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    
    console.log = function() {
        // Silently suppress console.log
        return false;
    };
    
    console.warn = function() {
        // Silently suppress console.warn
        return false;
    };
    
    console.error = function() {
        // Allow error logging for debugging
        return originalError.apply(console, arguments);
    };
    
    // Detection for developer tools
    setInterval(function() {
        const devtools = /./;
        devtools.toString = function() {
            window.location.href = 'about:blank';
        };
        
        // Check if devtools is open
        if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
            // Devtools detected
            document.body.innerHTML = '<h1>Access Denied</h1><p>This content is protected.</p>';
        }
    }, 1000);
    
    // Basic anti-debugging
    setInterval(function() {
        const debuggerTrigger = function() {
            debugger;
        };
        debuggerTrigger();
    }, 500);
    
    // Show loading message
    console.clear();
    console.log('%c📚 Professional eBook Reader', 'font-size: 20px; color: #e74c3c; font-weight: bold;');
    console.log('%cThis content is protected.', 'color: #95a5a6;');
    console.log('%cAll rights reserved.', 'color: #95a5a6;');
});

// Additional security measures
(function() {
    'use strict';
    
    // Prevent iframe embedding
    if (window.top !== window.self) {
        window.top.location.href = window.self.location.href;
    }
    
    // Remove access to window methods
    delete window.open;
    delete window.print;
    delete window.saveAs;
    
    // Prevent image saving
    document.addEventListener('mousedown', function(e) {
        if (e.button === 2 || e.ctrlKey || e.metaKey) {
            e.preventDefault();
            return false;
        }
    });
    
    // Keyboard shortcut blocking
    document.addEventListener('keydown', function(e) {
        // Alt + Print Screen
        if (e.altKey && e.key === 'PrintScreen') {
            e.preventDefault();
            return false;
        }
        
        // Ctrl + Shift + C (dev tools)
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            return false;
        }
    });
})();
</script>
</body>
</html>`;
    }

    /**
     * Generate security HTML
     */
    generateSecurityHTML() {
        return `
/* Enhanced Security Styles */
body {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
}

* {
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
}

img {
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
    pointer-events: none;
}

img::selection {
    background: transparent;
}

::-moz-selection {
    background: transparent;
}

::selection {
    background: transparent;
}

/* Hide scrollbars for cleaner appearance */
::-webkit-scrollbar {
    display: none;
}

body::-webkit-scrollbar {
    display: none;
}

/* Prevent context menu */
body {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
`;
    }
}

module.exports = BookTheme;