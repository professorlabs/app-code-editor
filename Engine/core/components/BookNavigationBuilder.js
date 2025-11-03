/**
 * Book Navigation Builder
 * Constructs navigation components for book documents
 * Handles table of contents, sidebar navigation, and cross-references
 */

class BookNavigationBuilder {
    constructor() {
        this.navigationStructure = {
            tableOfContents: '',
            sidebar: '',
            breadcrumbs: '',
            crossReferences: []
        };
    }

    /**
     * Build complete table of contents
     */
    buildTableOfContents(content, bookStructure) {
        let tocHTML = '<div class="table-of-contents" id="table-of-contents">\n';
        tocHTML += '<h2 class="toc-title">Table of Contents</h2>\n';
        tocHTML += '<nav class="toc-navigation">\n';
        
        // Add parts
        if (bookStructure.parts.length > 0) {
            tocHTML += '<div class="toc-section toc-parts">\n';
            bookStructure.parts.forEach(part => {
                tocHTML += `<div class="toc-item toc-part">
                    <a href="#part-${part.number}" class="toc-link">
                        <span class="toc-number">Part ${part.number}</span>
                        <span class="toc-title">${part.title}</span>
                    </a>
                </div>\n`;
            });
            tocHTML += '</div>\n';
        }
        
        // Add chapters
        tocHTML += '<div class="toc-section toc-chapters">\n';
        bookStructure.chapters.forEach((chapter, index) => {
            const progress = Math.round(((index + 1) / bookStructure.chapters.length) * 100);
            
            tocHTML += `<div class="toc-item toc-chapter" data-progress="${progress}">
                <a href="#${chapter.id}" class="toc-link">
                    <span class="toc-number">Chapter ${chapter.number}</span>
                    <span class="toc-title">${chapter.title}</span>
                    <span class="toc-progress" style="width: ${progress}%"></span>
                </a>
            </div>\n`;
            
            // Add sections for this chapter
            const chapterSections = this.getSectionsInChapter(chapter, content);
            if (chapterSections.length > 0) {
                tocHTML += '<div class="toc-subsections">\n';
                chapterSections.forEach((section, sectionIndex) => {
                    const sectionId = `${chapter.id}-section-${sectionIndex + 1}`;
                    tocHTML += `<div class="toc-item toc-section">
                        <a href="#${sectionId}" class="toc-link">
                            <span class="toc-number">${sectionIndex + 1}</span>
                            <span class="toc-title">${section.title}</span>
                        </a>
                    </div>\n`;
                });
                tocHTML += '</div>\n';
            }
        });
        tocHTML += '</div>\n';
        
        tocHTML += '</nav>\n</div>\n';
        
        return content.replace(/\\tableofcontents\s*/, tocHTML);
    }

    /**
     * Build sidebar navigation
     */
    buildSidebar(bookStructure) {
        let sidebarHTML = '<aside class="book-sidebar sticky-sidebar">\n';
        sidebarHTML += '<div class="sidebar-header">\n';
        sidebarHTML += '<div class="sidebar-title">Navigation</div>\n';
        sidebarHTML += '<button class="sidebar-toggle">Menu</button>\n';
        sidebarHTML += '</div>\n';
        
        sidebarHTML += '<div class="sidebar-content">\n';
        sidebarHTML += '<div class="sidebar-nav">\n';
        
        // Quick navigation
        sidebarHTML += '<div class="nav-section quick-nav">\n';
        sidebarHTML += '<h4 class="nav-section-title">Quick Access</h4>\n';
        sidebarHTML += '<ul class="nav-list">\n';
        sidebarHTML += '<li><a href="#table-of-contents" class="nav-link">Table of Contents</a></li>\n';
        sidebarHTML += '</ul>\n';
        sidebarHTML += '</div>\n';
        
        // Parts navigation
        if (bookStructure.parts.length > 0) {
            sidebarHTML += '<div class="nav-section parts-nav">\n';
            sidebarHTML += '<h4 class="nav-section-title">Parts</h4>\n';
            sidebarHTML += '<ul class="nav-list">\n';
            bookStructure.parts.forEach(part => {
                sidebarHTML += `<li><a href="#part-${part.number}" class="nav-link part-link">Part ${part.number}: ${part.title}</a></li>\n`;
            });
            sidebarHTML += '</ul>\n';
            sidebarHTML += '</div>\n';
        }
        
        // Chapters navigation with progress
        sidebarHTML += '<div class="nav-section chapters-nav">\n';
        sidebarHTML += '<h4 class="nav-section-title">Chapters</h4>\n';
        sidebarHTML += '<div class="chapters-progress">\n';
        sidebarHTML += '<div class="progress-bar"><div class="progress-fill" style="width: 0%"></div></div>\n';
        sidebarHTML += '<div class="progress-text">0% Complete</div>\n';
        sidebarHTML += '</div>\n';
        sidebarHTML += '<ul class="nav-list">\n';
        
        bookStructure.chapters.forEach((chapter, index) => {
            const progress = Math.round(((index + 1) / bookStructure.chapters.length) * 100);
            sidebarHTML += `<li>
                <a href="#${chapter.id}" class="nav-link chapter-link" data-chapter="${chapter.number}" data-progress="${progress}">
                    <span class="chapter-number">${chapter.number}</span>
                    <span class="chapter-title">${chapter.title}</span>
                    <span class="chapter-progress" style="width: ${progress}%"></span>
                </a>
            </li>\n`;
        });
        
        sidebarHTML += '</ul>\n';
        sidebarHTML += '</div>\n';
        
        // Reading position indicator
        sidebarHTML += '<div class="nav-section reading-position">\n';
        sidebarHTML += '<h4 class="nav-section-title">Reading Position</h4>\n';
        sidebarHTML += '<div class="position-indicator">\n';
        sidebarHTML += '<div class="current-page">Page 1</div>\n';
        sidebarHTML += '<div class="scroll-progress">\n';
        sidebarHTML += '<div class="scroll-fill" style="height: 0%"></div>\n';
        sidebarHTML += '</div>\n';
        sidebarHTML += '</div>\n';
        sidebarHTML += '</div>\n';
        
        sidebarHTML += '</div>\n';
        sidebarHTML += '</div>\n';
        sidebarHTML += '</aside>\n';
        
        return sidebarHTML;
    }

    /**
     * Get sections within a chapter
     */
    getSectionsInChapter(chapter, content) {
        const sectionPattern = new RegExp(`\\\\section\\{([^}]+)\\}`, 'g');
        const sections = [];
        let match;
        
        // Find sections that belong to this chapter
        const chapterStartIndex = content.indexOf(chapter.title);
        const nextChapterIndex = content.indexOf('\\chapter{', chapterStartIndex + 1);
        const chapterContent = nextChapterIndex > -1 
            ? content.substring(chapterStartIndex, nextChapterIndex)
            : content.substring(chapterStartIndex);
        
        while ((match = sectionPattern.exec(chapterContent)) !== null) {
            sections.push({
                title: match[1],
                id: `${chapter.id}-section-${sections.length + 1}`
            });
        }
        
        return sections;
    }

    /**
     * Build breadcrumb navigation
     */
    buildBreadcrumbs(currentSection, bookStructure) {
        let breadcrumbs = '<nav class="breadcrumbs">\n';
        breadcrumbs += '<ol class="breadcrumb-list">\n';
        
        // Add book title
        breadcrumbs += '<li><a href="#book-title">Book</a></li>\n';
        
        // Add part if applicable
        if (currentSection.part) {
            const part = bookStructure.parts.find(p => p.id === currentSection.part);
            if (part) {
                breadcrumbs += `<li><a href="#${part.id}">Part ${part.number}</a></li>\n`;
            }
        }
        
        // Add chapter
        if (currentSection.chapter) {
            const chapter = bookStructure.chapters.find(c => c.id === currentSection.chapter);
            if (chapter) {
                breadcrumbs += `<li><a href="#${chapter.id}">Chapter ${chapter.number}</a></li>\n`;
            }
        }
        
        // Add current section
        if (currentSection.section) {
            breadcrumbs += `<li class="current">${currentSection.section}</li>\n`;
        }
        
        breadcrumbs += '</ol>\n';
        breadcrumbs += '</nav>\n';
        
        return breadcrumbs;
    }

    /**
     * Generate cross-reference links
     */
    generateCrossReferences(content) {
        const references = [];
        
        // Find \ref commands
        const refPattern = /\\ref\{([^}]+)\}/g;
        let refMatch;
        
        while ((refMatch = refPattern.exec(content)) !== null) {
            references.push({
                type: 'reference',
                label: refMatch[1],
                text: `\\ref{${refMatch[1]}}`
            });
        }
        
        // Find \pageref commands
        const pageRefPattern = /\\pageref\{([^}]+)\}/g;
        let pageRefMatch;
        
        while ((pageRefMatch = pageRefPattern.exec(content)) !== null) {
            references.push({
                type: 'page_reference',
                label: pageRefMatch[1],
                text: `\\pageref{${pageRefMatch[1]}}`
            });
        }
        
        return references;
    }

    /**
     * Create navigation script
     */
    createNavigationScript() {
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
        
        // Initialize navigation
        setupSmoothScrolling();
        
        // Update active navigation on scroll
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY + 150;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.id;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    const sectionProgress = ((scrollPosition - sectionTop) / sectionHeight) * 100;
                    updateProgressIndicators(section, sectionProgress);
                }
            });
        });
    }
    
    initAdvancedNavigation();
});`;
    }
}

module.exports = BookNavigationBuilder;