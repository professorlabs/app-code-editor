/**
 * Book Typography Styles Component
 * Handles professional typography and LaTeX-like text formatting
 */

class BookTypographyStyles {
    constructor() {
        this.typographySettings = {
            baseFontSize: '11pt',
            lineHeight: '1.8',
            fontFamily: 'Georgia, serif',
            headingFont: 'Georgia, serif',
            codeFont: 'Courier New, monospace'
        };
    }

    /**
     * Generate typography CSS
     */
    generateCSS() {
        return `
/* Professional Typography */
body {
    font-family: ${this.typographySettings.fontFamily};
    font-size: ${this.typographySettings.baseFontSize};
    line-height: ${this.typographySettings.lineHeight};
    color: #1f2937;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Enhanced Paragraphs with LaTeX Styling */
.content-wrapper p,
.book-main p {
    margin: 1.2em 0;
    text-align: justify;
    text-align-last: justify;
    hyphens: auto;
    line-height: 1.8;
    color: #1f2937;
    text-indent: 1.5em;
    widows: 2;
    orphans: 2;
    word-spacing: 0.05em;
    font-variant-ligatures: common-ligatures;
    font-feature-settings: "kern" 1, "liga" 1;
}

.content-wrapper p:first-of-type,
.book-main p:first-of-type {
    text-indent: 0;
}

.content-wrapper p:first-child,
.book-main p:first-child {
    text-indent: 0;
}

/* Chapter opening paragraph special styling */
.book-main .book-chapter p:first-of-type,
.content-wrapper .book-chapter p:first-of-type {
    text-indent: 0;
    font-size: 1.1em;
    font-weight: 300;
    color: #374151;
    border-left: 3px solid #e74c3c;
    padding-left: 1rem;
    margin-left: -1rem;
}

/* Section anchor links */
.section-anchor {
    opacity: 0;
    margin-left: 0.5rem;
    text-decoration: none;
    color: #e74c3c;
    font-size: 0.8em;
    transition: all 0.3s ease;
    text-decoration: none;
}

h1:hover .section-anchor,
h2:hover .section-anchor,
h3:hover .section-anchor,
h4:hover .section-anchor,
h5:hover .section-anchor,
h6:hover .section-anchor {
    opacity: 1;
}

.section-anchor:hover {
    color: #dc2626;
    transform: scale(1.2);
}

/* Enhanced paragraph spacing for different content types */
.content-wrapper .abstract p {
    font-style: italic;
    color: #6b7280;
    text-indent: 0;
    padding: 0 1rem;
    border-left: 2px solid #d1d5db;
}

.content-wrapper .dedication-content p {
    text-align: center;
    font-style: italic;
    text-indent: 0;
    color: #6b7280;
    font-size: 1.1em;
}

.content-wrapper .theorem-content p,
.content-wrapper .proof-content p {
    text-align: left;
    text-indent: 0;
    margin: 0.8em 0;
}

/* Headings */
.book-main h1,
.content-wrapper h1 {
    font-size: 2.2em;
    margin: 50px 0 25px 0;
    color: #1a1a1a;
    border-bottom: 3px solid #e74c3c;
    padding-bottom: 15px;
    font-weight: 600;
    position: relative;
    overflow: hidden;
}

.book-main h1::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, #e74c3c, transparent);
    transition: width 0.5s ease;
}

.book-main h1:hover::after {
    width: 100%;
}

.book-main h2,
.content-wrapper h2 {
    font-size: 1.8em;
    margin: 40px 0 20px 0;
    color: #2c3e50;
    font-weight: 600;
    position: relative;
    overflow: hidden;
}

.book-main h2::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 2px;
    background: linear-gradient(90deg, #3498db, transparent);
    transition: width 0.5s ease;
}

.book-main h2:hover::after {
    width: 100%;
}

.book-main h3,
.content-wrapper h3 {
    font-size: 1.4em;
    margin: 30px 0 15px 0;
    color: #34495e;
    font-weight: 500;
}

.book-main h4,
.content-wrapper h4 {
    font-size: 1.2em;
    margin: 25px 0 12px 0;
    color: #495057;
    font-weight: 500;
}

.book-main h5,
.content-wrapper h5 {
    font-size: 1.1em;
    margin: 20px 0 10px 0;
    color: #6c757d;
    font-weight: 500;
}

.book-main h6,
.content-wrapper h6 {
    font-size: 1em;
    margin: 15px 0 8px 0;
    color: #6c757d;
    font-weight: 500;
}

/* Text Formatting */
.textbf {
    font-weight: 700;
    color: #2c3e50;
}

.textit {
    font-style: italic;
    color: #6b758d;
}

.texttt {
    font-family: ${this.typographySettings.codeFont};
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

/* Size Classes */
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

/* Lists */
.book-main ul,
.content-wrapper ul {
    margin: 20px 0 20px 30px;
    padding-left: 20px;
}

.book-main ol,
.content-wrapper ol {
    margin: 20px 0 20px 30px;
    padding-left: 20px;
}

.book-main li,
.content-wrapper li {
    margin: 10px 0;
    color: #495057;
    line-height: 1.6;
    text-align: left;
}

.book-main ul li::marker,
.content-wrapper ul li::marker {
    color: #e74c3c;
    font-size: 1.2em;
}

.book-main ol li::marker,
.content-wrapper ol li::marker {
    color: #e74c3c;
    font-weight: bold;
}

/* Item Lists */
.item-list {
    list-style: none;
    padding-left: 0;
}

.item-list li {
    margin: 0.8em 0;
    padding-left: 1.5em;
    position: relative;
}

.item-list li::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #e74c3c;
    font-weight: bold;
    font-size: 1.2em;
}

/* Numbered Lists */
.numbered-list {
    list-style: none;
    padding-left: 0;
    counter-reset: item;
}

.numbered-list li {
    margin: 0.8em 0;
    padding-left: 2em;
    position: relative;
    counter-increment: item;
}

.numbered-list li::before {
    content: counter(item) + '.';
    position: absolute;
    left: 0;
    color: #e74c3c;
    font-weight: bold;
}

/* Description Lists */
.description-list dt {
    font-weight: 600;
    color: #2c3e50;
    margin: 1em 0 0.5em 0;
}

.description-list dd {
    margin: 0 0 1em 1.5em;
    color: #495057;
    line-height: 1.6;
}

/* Enhanced Block Quotes */
.book-main blockquote,
.content-wrapper blockquote {
    margin: 1.5em 0;
    padding: 1em 1.5em;
    border-left: 4px solid #e74c3c;
    background: linear-gradient(90deg, #fef2f2 0%, #ffffff 100%);
    font-style: italic;
    color: #6b7280;
    text-align: justify;
    text-indent: 0;
}

.book-main blockquote p,
.content-wrapper blockquote p {
    text-indent: 0;
    margin: 0;
}

/* Tables */
.table-content {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
    font-size: 0.9em;
    background: #ffffff;
}

.table-content th,
.table-content td {
    padding: 0.75em;
    text-align: left;
    border-bottom: 1px solid #e9ecef;
}

.table-content th {
    font-weight: 600;
    color: #2c3e50;
    background: #f8f9fa;
    border-bottom: 2px solid #e74c3c;
}

.table-content tr:hover {
    background: #f8f9fa;
}

.table-caption {
    text-align: center;
    font-size: 0.9em;
    color: #6b757d;
    font-style: italic;
    margin: 0.5em 0 1em 0;
}

/* Figures */
.figure {
    margin: 1.5em 0;
    text-align: center;
}

.figure-content {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1em;
    background: #ffffff;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    margin-bottom: 0.5em;
}

.figure-image {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
}

.figcaption {
    margin-top: 0.5em;
    font-size: 0.9em;
    color: #6b7280;
    font-style: italic;
}

/* Equations */
.equation {
    margin: 1.5em 0;
    text-align: center;
    background: #f8f9fa;
    padding: 1em;
    border-radius: 8px;
    border: 1px solid #e9ecef;
}

.equation-content {
    font-family: 'Times New Roman', serif;
    font-size: 1.1em;
    color: #2c3e50;
}

/* Theorems */
.theorem {
    margin: 2rem 0;
    padding: 1.5rem;
    border: 2px solid #3498db;
    border-radius: 8px;
    background: #f8f9fa;
}

.theorem-content {
    color: #2c3e50;
    line-height: 1.6;
}

/* Proofs */
.proof {
    margin: 2rem 0;
    padding: 1.5rem;
    border-left: 4px solid #27ae60;
    background: #f8f9fa;
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

/* Interactive content highlighting */
.content-wrapper p:hover {
    background: linear-gradient(90deg, transparent 0%, rgba(231, 76, 60, 0.02) 50%, transparent 100%);
    transition: background 0.3s ease;
}

/* Code Blocks */
code {
    font-family: ${this.typographySettings.codeFont};
    background: #f8f9fa;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-size: 0.9em;
    color: #e74c3c;
    border: 1px solid #e9ecef;
}

pre {
    background: #f8f9fa;
    padding: 1em;
    border-radius: 4px;
    overflow-x: auto;
    border: 1px solid #e9ecef;
}

pre code {
    background: none;
    padding: 0;
    border: none;
}

/* Responsive Typography */
@media (max-width: 768px) {
    body {
        font-size: 10pt;
    }
    
    .book-main h1,
    .content-wrapper h1 {
        font-size: 1.8em;
    }
    
    .book-main h2,
    .content-wrapper h2 {
        font-size: 1.5em;
    }
    
    .book-main h3,
    .content-wrapper h3 {
        font-size: 1.3em;
    }
    
    .content-wrapper p,
    .book-main p {
        font-size: 10pt;
        line-height: 1.6;
        text-indent: 1.2em;
    }
}

/* Print Typography */
@media print {
    body {
        font-size: 12pt;
        line-height: 1.5;
        color: black;
    }
    
    .content-wrapper p,
    .book-main p {
        text-align: justify;
        hyphens: auto;
        page-break-inside: avoid;
        widows: 2;
        orphans: 2;
    }
    
    .book-main h1,
    .book-main h2 {
        page-break-after: avoid;
    }
    
    .figure,
    .table,
    .equation {
        page-break-inside: avoid;
    }
}`;
    }

    /**
     * Generate typography script
     */
    generateTypographyScript() {
        return `
// Typography enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Enhance text justification
    function enhanceTextJustification() {
        const paragraphs = document.querySelectorAll('.content-wrapper p, .book-main p');
        paragraphs.forEach(paragraph => {
            paragraph.style.textAlign = 'justify';
            paragraph.style.textAlignLast = 'justify';
            paragraph.style.hyphens = 'auto';
        });
    }
    
    // Add interactive highlighting
    function addInteractiveHighlighting() {
        const textElements = document.querySelectorAll('.content-wrapper p, .book-main h1, .book-main h2, .book-main h3');
        textElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'rgba(231, 76, 60, 0.02)';
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '';
            });
        });
    }
    
    // Font size controls
    function addFontSizeControls() {
        const increaseBtn = document.createElement('button');
        const decreaseBtn = document.createElement('button');
        const resetBtn = document.createElement('button');
        
        increaseBtn.textContent = 'A+';
        decreaseBtn.textContent = 'A-';
        resetBtn.textContent = 'A';
        
        const controls = document.createElement('div');
        controls.className = 'font-controls';
        controls.style.position = 'fixed';
        controls.style.top = '10px';
        controls.style.right = '10px';
        controls.style.zIndex = '1000';
        controls.style.display = 'flex';
        controls.style.gap = '5px';
        
        [increaseBtn, decreaseBtn, resetBtn].forEach(btn => {
            btn.style.padding = '5px 10px';
            btn.style.border = '1px solid #ccc';
            btn.style.background = '#fff';
            btn.style.cursor = 'pointer';
            btn.style.borderRadius = '3px';
        });
        
        controls.appendChild(increaseBtn);
        controls.appendChild(decreaseBtn);
        controls.appendChild(resetBtn);
        
        document.body.appendChild(controls);
        
        let currentSize = 100;
        
        increaseBtn.addEventListener('click', () => {
            currentSize += 5;
            document.body.style.fontSize = currentSize + '%';
        });
        
        decreaseBtn.addEventListener('click', () => {
            currentSize -= 5;
            if (currentSize < 50) currentSize = 50;
            document.body.style.fontSize = currentSize + '%';
        });
        
        resetBtn.addEventListener('click', () => {
            currentSize = 100;
            document.body.style.fontSize = '100%';
        });
    }
    
    enhanceTextJustification();
    addInteractiveHighlighting();
    // addFontSizeControls(); // Uncomment if font controls are needed
});`;
    }
}

module.exports = BookTypographyStyles;