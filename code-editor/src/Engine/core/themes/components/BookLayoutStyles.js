/**
 * Simple Book Layout Styles Component
 * Clean A4 page layout with responsive design
 */

class BookLayoutStyles {
    constructor() {
        this.pageSettings = {
            pageSize: 'A4',
            margin: '20mm',
            lineHeight: '1.6',
            fontSize: '11pt'
        };
    }

    /**
     * Generate layout CSS
     */
    generateCSS() {
        return `
/* Two Column Layout */
.book-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    min-height: 100vh;
}

/* Simple A4 Page Layout */
.a4-page {
    width: 100%;
    max-width: 210mm;
    min-height: 297mm;
    margin: 10px auto;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

/* Simple Page Header */
.a4-page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12mm 20mm 6mm 20mm;
    border-bottom: 1px solid #e0e0e0;
    min-height: 25px;
}

.page-header-left {
    font-size: 11px;
    font-weight: 600;
    color: #333333;
    text-transform: uppercase;
    max-width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.page-header-right {
    font-size: 11px;
    color: #666666;
    font-family: 'Times New Roman', serif;
}

/* Book Content Container */
.book-content {
    padding: 20px;
    min-height: 100vh;
}

/* Page Content */
.a4-page-content {
    flex: 1;
    padding: 10mm 20mm;
    min-height: calc(297mm - 65mm);
}

.content-wrapper {
    max-width: 100%;
    margin: 0 auto;
    text-align: justify;
    line-height: 1.6;
    font-size: 11pt;
    color: #333333;
    font-family: 'Georgia', 'Times New Roman', serif;
}

/* Page Footer */
.a4-page-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8mm 20mm 12mm 20mm;
    border-top: 1px solid #e0e0e0;
    min-height: 20px;
}

.page-footer-left {
    font-size: 10px;
    color: #666666;
}

.page-footer-right {
    font-size: 10px;
    color: #666666;
    font-family: 'Times New Roman', serif;
}

/* Page Type Styles */
.a4-page.title-page .content-wrapper {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: calc(297mm - 65mm);
}

.a4-page.toc-page .content-wrapper {
    font-size: 10pt;
}

/* Sidebar Toggle Button */
.sidebar-toggle {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 1000;
    border: 1px solid #333333;
    padding: 10px 15px;
    cursor: pointer;
    font-size: 14px;
}

.sidebar-toggle.collapsed {
    left: 20px;
}

/* Sidebar States */
.book-sidebar {
    transition: transform 0.3s ease;
}

.book-sidebar.collapsed {
    transform: translateX(-100%);
    margin-left: -280px;
}

.book-content.expanded {
    margin-left: 0;
    grid-column: 1 / -1;
}

/* Responsive Design */
@media (max-width: 1200px) {
    .book-layout {
        grid-template-columns: 250px 1fr;
    }
    
    .a4-page {
        max-width: 190mm;
        margin: 8px auto;
    }
}

@media (max-width: 1024px) {
    .book-layout {
        grid-template-columns: 1fr;
    }
    
    .book-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        z-index: 999;
        transform: translateX(-100%);
    }
    
    .book-sidebar.active {
        transform: translateX(0);
    }
    
    .book-sidebar.collapsed {
        transform: translateX(-100%);
        margin-left: 0;
    }
    
    .book-content {
        grid-column: 1 / -1;
        margin-left: 0;
    }
    
    .sidebar-toggle {
        display: block;
    }
    
    .a4-page {
        max-width: 100%;
        margin: 5px auto;
        min-height: auto;
    }
    
    .a4-page-header {
        padding: 12mm 15mm 6mm 15mm;
    }
    
    .a4-page-content {
        padding: 8mm 15mm;
        min-height: auto;
    }
    
    .a4-page-footer {
        padding: 6mm 15mm 10mm 15mm;
    }
    
    .content-wrapper {
        font-size: 10pt;
    }
}

@media (max-width: 768px) {
    .a4-page {
        margin: 3px;
        border-radius: 0;
        box-shadow: none;
    }
    
    .a4-page-header,
    .a4-page-content,
    .a4-page-footer {
        padding: 5mm 10mm;
    }
    
    .page-header-left {
        font-size: 10px;
    }
    
    .content-wrapper {
        font-size: 9pt;
        line-height: 1.5;
    }
    
    .sidebar-toggle {
        top: 15px;
        left: 15px;
        padding: 8px 12px;
        font-size: 12px;
    }
}

@media (max-width: 480px) {
    .a4-page {
        margin: 2px;
    }
    
    .a4-page-header,
    .a4-page-content,
    .a4-page-footer {
        padding: 4mm 8mm;
    }
    
    .page-header-left {
        font-size: 9px;
    }
    
    .content-wrapper {
        font-size: 8pt;
        line-height: 1.4;
    }
    
    .sidebar-toggle {
        top: 10px;
        left: 10px;
        padding: 6px 10px;
        font-size: 11px;
    }
}

/* Print Styles */
@media print {
    .a4-page {
        max-width: 100%;
        margin: 0;
        border: 1px solid #000;
        box-shadow: none;
        page-break-inside: avoid;
        padding: 0;
    }
    
    .a4-page-header,
    .a4-page-footer {
        background: transparent;
        color: black;
    }
}`;
    }

    /**
     * Generate layout script
     */
    generateLayoutScript() {
        return `
// Simple layout functionality with sidebar toggle
document.addEventListener('DOMContentLoaded', function() {
    function initSidebarToggle() {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'sidebar-toggle';
        toggleBtn.innerHTML = '☰';
        toggleBtn.setAttribute('aria-label', 'Toggle sidebar');
        
        const sidebar = document.querySelector('.book-sidebar');
        const bookContent = document.querySelector('.book-content');
        
        if (!sidebar || !bookContent) return;
        
        document.body.appendChild(toggleBtn);
        
        function toggleSidebar() {
            const isCollapsed = sidebar.classList.contains('collapsed');
            
            if (window.innerWidth <= 1024) {
                // Mobile behavior
                sidebar.classList.toggle('active');
                toggleBtn.innerHTML = isCollapsed ? '☰' : '✕';
            } else {
                // Desktop behavior
                sidebar.classList.toggle('collapsed');
                bookContent.classList.toggle('expanded');
                toggleBtn.innerHTML = isCollapsed ? '☰' : '✕';
            }
        }
        
        toggleBtn.addEventListener('click', toggleSidebar);
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 1024) {
                sidebar.classList.remove('active');
                sidebar.classList.add('collapsed');
                bookContent.classList.add('expanded');
                toggleBtn.innerHTML = '☰';
            }
        });
        
        // Initial state for desktop
        if (window.innerWidth > 1024) {
            sidebar.classList.add('collapsed');
            bookContent.classList.add('expanded');
        }
    }
    
    function initPagination() {
        const pages = document.querySelectorAll('.a4-page');
        const currentPageDisplay = document.querySelector('.current-page');
        
        function updateCurrentPage() {
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            
            pages.forEach((page, index) => {
                const pageTop = page.offsetTop;
                const pageBottom = pageTop + page.offsetHeight;
                
                if (scrollPosition >= pageTop && scrollPosition < pageBottom) {
                    const pageNumber = page.dataset.page;
                    
                    if (currentPageDisplay) {
                        currentPageDisplay.textContent = \`Page \${pageNumber}\`;
                    }
                }
            });
        }
        
        window.addEventListener('scroll', updateCurrentPage);
        updateCurrentPage();
    }
    
    initSidebarToggle();
    initPagination();
});`;
    }
}

module.exports = BookLayoutStyles;