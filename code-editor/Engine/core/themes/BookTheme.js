/**
 * Book Theme
 * Specialized theme for LaTeX book documents
 * Provides professional book styling with A4 pages and navigation
 */

const BaseTheme = require('./BaseTheme');
const BookLayoutStyles = require('./components/BookLayoutStyles');
const BookNavigationStyles = require('./components/BookNavigationStyles');
const BookTypographyStyles = require('./components/BookTypographyStyles');
const BookAnimationStyles = require('./components/BookAnimationStyles');

class BookTheme extends BaseTheme {
    constructor() {
        super();
        this.name = 'book';
        this.displayName = 'Professional Book Theme';
        this.description = 'Premium theme for book documents with A4 layout and navigation';
        
        this.layoutStyles = new BookLayoutStyles();
        this.navigationStyles = new BookNavigationStyles();
        this.typographyStyles = new BookTypographyStyles();
        this.animationStyles = new BookAnimationStyles();
        
        this.generateStyles();
        this.generateScripts();
    }

    /**
     * Generate all theme styles
     */
    generateStyles() {
        this.styles = `
${this.layoutStyles.generateCSS()}
${this.navigationStyles.generateCSS()}
${this.typographyStyles.generateCSS()}
${this.animationStyles.generateCSS()}
`;
    }

    /**
     * Generate theme scripts
     */
    generateScripts() {
        this.scripts = `
${this.navigationStyles.generateNavigationScript()}
${this.layoutStyles.generateLayoutScript()}
${this.animationStyles.generateAnimationScript()}
`;
    }

    /**
     * Generate complete HTML with book theme
     */
    generateHTML(data) {
        const { html, context, metadata } = data;
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata.title || 'Professional Book'}</title>
    <meta name="author" content="${metadata.author || 'Author'}">
    <meta name="description" content="Professional book generated from LaTeX">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="book">
    <meta property="og:title" content="${metadata.title || 'Professional Book'}">
    <meta property="og:description" content="Professional book generated from LaTeX">
    <meta property="og:author" content="${metadata.author || 'Author'}">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="${metadata.title || 'Professional Book'}">
    <meta property="twitter:description" content="Professional book generated from LaTeX">
    <meta property="twitter:author" content="${metadata.author || 'Author'}">
    
    <!-- Security headers -->
    <meta name="robots" content="noindex, nofollow">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-Frame-Options" content="DENY">
    
    <style>
${this.generateBaseCSS()}
${this.generateBookSpecificCSS()}
${this.styles}
    </style>
</head>
<body>
    ${html}
    
    <script>
${this.generateBaseScript()}
${this.scripts}
    </script>
</body>
</html>`;
    }

    /**
     * Generate book-specific CSS
     */
    generateBookSpecificCSS() {
        return `
/* Book Theme Specific Styles */
body {
    background: #f5f5f5;
    overflow-x: hidden;
}

/* Book Container */
.book-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    max-width: 100%;
    margin: 0 auto;
    background: #ffffff;
}

/* Book Header */
.book-header {
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    color: #ffffff;
    padding: 1rem 2rem;
    text-align: center;
    border-bottom: 3px solid #e74c3c;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 100;
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

/* Book Layout */
.book-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 0;
    flex: 1;
    min-height: calc(100vh - 120px);
}

/* Book Main Content */
.book-main {
    padding: 0;
    background: #f5f5f5;
    overflow-y: auto;
    max-height: calc(100vh - 120px);
}

/* Book Footer */
.book-footer {
    background: #2c3e50;
    color: #ffffff;
    padding: 1rem;
    text-align: center;
    border-top: 3px solid #e74c3c;
}

.footer-content p {
    margin: 0.5rem 0;
    color: #ffffff;
    text-align: center;
}

/* Demo Mode Watermark */
.demo-watermark {
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: rgba(231, 76, 60, 0.9);
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 1000;
    pointer-events: none;
}

/* Responsive Book Layout */
@media (max-width: 1024px) {
    .book-layout {
        grid-template-columns: 1fr;
    }
    
    .book-sidebar {
        position: relative !important;
        height: auto !important;
        margin-bottom: 1rem;
        border-right: none !important;
        border-bottom: 3px solid #e74c3c !important;
    }
}

@media (max-width: 768px) {
    .book-container {
        margin: 0;
    }
    
    .book-header {
        padding: 1rem;
    }
    
    .book-title {
        font-size: 1.2rem;
    }
    
    .book-layout {
        display: flex;
        flex-direction: column;
    }
    
    .book-sidebar {
        order: 2;
        margin-bottom: 0;
        border-bottom: none !important;
    }
    
    .book-main {
        order: 1;
        padding: 1rem;
    }
}`;
    }
}

module.exports = BookTheme;