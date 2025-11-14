/**
 * Book Page Formatter
 * Handles A4-style page formatting and layout
 * Manages page headers, footers, and responsive design
 */

class BookPageFormatter {
    constructor() {
        this.pageSettings = {
            pageSize: 'A4',
            margin: '20mm',
            lineHeight: 1.8,
            fontSize: '11pt',
            fontFamily: 'Georgia, serif'
        };
        
        this.currentPage = 1;
        this.totalPages = 1;
    }

    /**
     * Format content as A4 pages
     */
    formatPages(content, bookStructure) {
        // Split content by page breaks
        const pages = content.split(/<div class="page-break"><\/div>/);
        this.totalPages = pages.length;
        
        let formattedContent = '';
        
        pages.forEach((page, index) => {
            const pageNumber = index + 1;
            const pageType = this.determinePageType(page, pageNumber);
            const matterClass = this.determineMatterClass(pageNumber);
            
            formattedContent += this.createA4Page(page, pageNumber, pageType, matterClass, bookStructure);
        });
        
        return formattedContent;
    }

    /**
     * Create A4-style page
     */
    createA4Page(content, pageNumber, pageType, matterClass, bookStructure) {
        let pageHTML = `<div class="a4-page ${matterClass} ${pageType}" data-page="${pageNumber}" data-total="${this.totalPages}">\n`;
        
        // Add page header
        pageHTML += this.createPageHeader(pageNumber, pageType, bookStructure);
        
        // Add page content
        pageHTML += this.createPageContent(content, pageType);
        
        // Add page footer
        pageHTML += this.createPageFooter(pageNumber, matterClass);
        
        pageHTML += '</div>\n\n';
        
        return pageHTML;
    }

    /**
     * Create page header
     */
    createPageHeader(pageNumber, pageType, bookStructure) {
        let headerHTML = '<div class="a4-page-header">\n';
        headerHTML += `<div class="page-header-left">${this.getHeaderInfo(pageNumber, pageType, bookStructure)}</div>\n`;
        headerHTML += `<div class="page-header-right">${this.formatPageNumber(pageNumber)}</div>\n`;
        headerHTML += '</div>\n';
        
        return headerHTML;
    }

    /**
     * Create page content area
     */
    createPageContent(content, pageType) {
        let contentHTML = '<div class="a4-page-content">\n';
        contentHTML += '<div class="content-wrapper">\n';
        contentHTML += content.trim();
        contentHTML += '</div>\n';
        contentHTML += '</div>\n';
        
        return contentHTML;
    }

    /**
     * Create page footer
     */
    createPageFooter(pageNumber, matterClass) {
        let footerHTML = '<div class="a4-page-footer">\n';
        footerHTML += '<div class="page-footer-left">Professional eBook</div>\n';
        footerHTML += `<div class="page-footer-right">Page ${this.formatPageNumber(pageNumber)} of ${this.formatPageNumber(this.totalPages)}</div>\n`;
        footerHTML += '</div>\n';
        
        return footerHTML;
    }

    /**
     * Determine page type based on content
     */
    determinePageType(page, pageNumber) {
        if (page.includes('title-page')) return 'title-page';
        if (page.includes('table-of-contents')) return 'toc-page';
        if (page.includes('part-title-page')) return 'part-page';
        if (page.includes('chapter-title-page')) return 'chapter-page';
        if (page.includes('dedication-page')) return 'dedication-page';
        if (page.includes('abstract')) return 'abstract-page';
        if (pageNumber === 1) return 'first-page';
        return 'content-page';
    }

    /**
     * Determine matter class for page numbering
     */
    determineMatterClass(pageNumber) {
        // Simple logic - can be enhanced based on content analysis
        return pageNumber <= 3 ? 'frontmatter' : 'mainmatter';
    }

    /**
     * Get header information for page
     */
    getHeaderInfo(pageNumber, pageType, bookStructure) {
        switch (pageType) {
            case 'title-page':
                return 'Title';
            case 'toc-page':
                return 'Table of Contents';
            case 'part-page':
                const currentPart = this.getCurrentPart(pageNumber, bookStructure);
                return currentPart ? `Part ${currentPart.number}: ${currentPart.title}` : 'Contents';
            case 'chapter-page':
                const currentChapter = this.getCurrentChapter(pageNumber, bookStructure);
                return currentChapter ? `Chapter ${currentChapter.number}: ${currentChapter.title}` : 'Contents';
            default:
                return 'Contents';
        }
    }

    /**
     * Get current part based on page number
     */
    getCurrentPart(pageNumber, bookStructure) {
        // Simple estimation - can be enhanced with actual content analysis
        const estimatedPartIndex = Math.floor((pageNumber - 1) / 5);
        return bookStructure.parts[estimatedPartIndex] || null;
    }

    /**
     * Get current chapter based on page number
     */
    getCurrentChapter(pageNumber, bookStructure) {
        // Simple estimation - can be enhanced with actual content analysis
        const estimatedChapterIndex = Math.floor((pageNumber - 1) / 3);
        return bookStructure.chapters[estimatedChapterIndex] || null;
    }

    /**
     * Format page number based on matter class
     */
    formatPageNumber(pageNumber, matterClass) {
        switch (matterClass) {
            case 'frontmatter':
                return this.convertToRoman(pageNumber);
            default:
                return pageNumber.toString();
        }
    }

    /**
     * Convert number to Roman numerals
     */
    convertToRoman(num) {
        const romanNumerals = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
        const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
        
        let result = '';
        for (let i = 0; i < romanNumerals.length; i++) {
            while (num >= values[i]) {
                result += romanNumerals[i];
                num -= values[i];
            }
        }
        return result;
    }

    /**
     * Generate CSS for page formatting
     */
    generatePageCSS() {
        return `
/* A4 Page Styles */
.a4-page {
    width: 100%;
    max-width: 210mm;
    min-height: 297mm;
    margin: 20px auto;
    background: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    page-break-after: always;
}

.a4-page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15mm 20mm 10mm 20mm;
    border-bottom: 1px solid #e5e7eb;
    background: linear-gradient(90deg, #f9fafb 0%, #ffffff 100%);
    min-height: 20mm;
}

.page-header-left {
    font-size: 10pt;
    font-weight: 600;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    max-width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.page-header-right {
    font-size: 10pt;
    font-weight: 500;
    color: #6b7280;
    font-family: 'Times New Roman', serif;
}

.a4-page-content {
    flex: 1;
    padding: 10mm 20mm;
    background: #ffffff;
    min-height: calc(297mm - 60mm);
}

.content-wrapper {
    max-width: 100%;
    margin: 0 auto;
    text-align: justify;
    line-height: 1.8;
    font-size: 11pt;
    color: #1f2937;
    font-family: 'Georgia', 'Times New Roman', serif;
}

.a4-page-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10mm 20mm 15mm 20mm;
    border-top: 1px solid #e5e7eb;
    background: linear-gradient(90deg, #ffffff 0%, #f9fafb 100%);
    min-height: 15mm;
}

.page-footer-left {
    font-size: 9pt;
    color: #6b7280;
    font-weight: 500;
}

.page-footer-right {
    font-size: 9pt;
    color: #6b7280;
    font-weight: 500;
    font-family: 'Times New Roman', serif;
}

/* Page Type Specific Styles */
.a4-page.title-page .content-wrapper {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: calc(297mm - 60mm);
}

.a4-page.toc-page .content-wrapper {
    font-size: 10pt;
}

.a4-page.chapter-page .a4-page-header {
    background: linear-gradient(90deg, #fef2f2 0%, #ffffff 100%);
    border-bottom: 2px solid #dc2626;
}

.a4-page.part-page .a4-page-header {
    background: linear-gradient(90deg, #f0f9ff 0%, #ffffff 100%);
    border-bottom: 2px solid #2563eb;
}

.a4-page.first-page .a4-page-header {
    background: linear-gradient(90deg, #f0fdf4 0%, #ffffff 100%);
    border-bottom: 2px solid #16a34a;
}

/* Responsive Design */
@media (max-width: 1024px) {
    .a4-page {
        max-width: 100%;
        margin: 10px auto;
        min-height: auto;
    }
    
    .a4-page-header {
        padding: 10mm 15mm 8mm 15mm;
    }
    
    .a4-page-content {
        padding: 8mm 15mm;
        min-height: auto;
    }
    
    .a4-page-footer {
        padding: 8mm 15mm 10mm 15mm;
    }
    
    .content-wrapper {
        font-size: 10pt;
    }
}

@media (max-width: 768px) {
    .a4-page {
        margin: 5px;
        border-radius: 4px;
    }
    
    .a4-page-header,
    .a4-page-content,
    .a4-page-footer {
        padding: 5mm 10mm;
    }
    
    .page-header-left {
        font-size: 9pt;
    }
    
    .content-wrapper {
        font-size: 9pt;
        line-height: 1.6;
    }
}

/* Print Styles */
@media print {
    .a4-page {
        max-width: 100%;
        margin: 0;
        border: none;
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
     * Generate page formatting script
     */
    createPageScript() {
        return `
// Page functionality
document.addEventListener('DOMContentLoaded', function() {
    function initPagination() {
        const pages = document.querySelectorAll('.a4-page');
        const currentPageDisplay = document.querySelector('.current-page');
        const scrollFill = document.querySelector('.scroll-fill');
        
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
                    
                    if (scrollFill) {
                        const progress = ((index + 1) / pages.length) * 100;
                        scrollFill.style.height = progress + '%';
                    }
                }
            });
        }
        
        window.addEventListener('scroll', updateCurrentPage);
        updateCurrentPage();
    }
    
    initPagination();
});`;
    }
}

module.exports = BookPageFormatter;