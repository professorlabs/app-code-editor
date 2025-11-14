/**
 * Base Theme Class
 * Foundation for all document themes
 * Provides common styling and functionality
 */

class BaseTheme {
    constructor() {
        this.name = 'base';
        this.displayName = 'Base Theme';
        this.description = 'Base theme for all document types';
        this.styles = '';
        this.scripts = '';
    }

    /**
     * Generate HTML with theme
     */
    generateHTML(data) {
        const { html, context, metadata } = data;
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata.title || 'Document'}</title>
    <meta name="author" content="${metadata.author || 'Author'}">
    <meta name="description" content="${this.description}">
    
    <style>
${this.generateBaseCSS()}
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
     * Generate base CSS
     */
    generateBaseCSS() {
        return `
/* Base Theme Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Georgia', 'Times New Roman', serif;
    line-height: 1.6;
    color: #2c3e50;
    background: #ffffff;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Container */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: 0.5em;
}

h1 { font-size: 2.5em; color: #1a1a1a; }
h2 { font-size: 2em; color: #2c3e50; }
h3 { font-size: 1.5em; color: #34495e; }
h4 { font-size: 1.2em; color: #495057; }
h5 { font-size: 1em; color: #6c757d; }
h6 { font-size: 0.9em; color: #6c757d; }

p {
    margin: 1em 0;
    text-align: justify;
    line-height: 1.8;
}

a {
    color: #3498db;
    text-decoration: none;
    transition: color 0.3s ease;
}

a:hover {
    color: #2980b9;
    text-decoration: underline;
}

strong {
    font-weight: 700;
    color: #2c3e50;
}

em {
    font-style: italic;
    color: #7f8c8d;
}

code {
    font-family: 'Courier New', monospace;
    background: #f8f9fa;
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-size: 0.9em;
    color: #e74c3c;
}

/* Lists */
ul, ol {
    margin: 1em 0;
    padding-left: 2em;
}

li {
    margin: 0.5em 0;
    line-height: 1.6;
}

/* Block Elements */
blockquote {
    margin: 1.5em 0;
    padding: 1em 1.5em;
    border-left: 4px solid #3498db;
    background: #f8f9fa;
    font-style: italic;
    color: #6c757d;
}

hr {
    border: none;
    height: 1px;
    background: #e9ecef;
    margin: 2em 0;
}

/* Tables */
table {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
    font-size: 0.9em;
}

th, td {
    padding: 0.75em;
    text-align: left;
    border-bottom: 1px solid #e9ecef;
}

th {
    font-weight: 600;
    color: #2c3e50;
    background: #f8f9fa;
}

tr:hover {
    background: #f8f9fa;
}

/* Figures */
figure {
    margin: 1.5em 0;
    text-align: center;
}

img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
}

figcaption {
    margin-top: 0.5em;
    font-size: 0.9em;
    color: #6c757d;
    font-style: italic;
}

/* Utility Classes */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }
.text-justify { text-align: justify; }

.small-caps {
    font-variant: small-caps;
    text-transform: lowercase;
}

.nowrap {
    white-space: nowrap;
}

.break-word {
    word-wrap: break-word;
}

/* Spacing */
.mt-0 { margin-top: 0; }
.mt-1 { margin-top: 0.25em; }
.mt-2 { margin-top: 0.5em; }
.mt-3 { margin-top: 1em; }
.mt-4 { margin-top: 1.5em; }
.mt-5 { margin-top: 2em; }

.mb-0 { margin-bottom: 0; }
.mb-1 { margin-bottom: 0.25em; }
.mb-2 { margin-bottom: 0.5em; }
.mb-3 { margin-bottom: 1em; }
.mb-4 { margin-bottom: 1.5em; }
.mb-5 { margin-bottom: 2em; }

.pt-0 { padding-top: 0; }
.pt-1 { padding-top: 0.25em; }
.pt-2 { padding-top: 0.5em; }
.pt-3 { padding-top: 1em; }
.pt-4 { padding-top: 1.5em; }
.pt-5 { padding-top: 2em; }

.pb-0 { padding-bottom: 0; }
.pb-1 { padding-bottom: 0.25em; }
.pb-2 { padding-bottom: 0.5em; }
.pb-3 { padding-bottom: 1em; }
.pb-4 { padding-bottom: 1.5em; }
.pb-5 { padding-bottom: 2em; }

/* Responsive Design */
@media (max-width: 768px) {
    .container {
        padding: 0 10px;
    }
    
    h1 { font-size: 2em; }
    h2 { font-size: 1.5em; }
    h3 { font-size: 1.2em; }
    
    p {
        font-size: 0.95em;
        line-height: 1.6;
    }
    
    table {
        font-size: 0.8em;
    }
    
    th, td {
        padding: 0.5em;
    }
}

@media print {
    body {
        background: white;
        color: black;
        font-size: 12pt;
    }
    
    a {
        color: black;
        text-decoration: none;
    }
    
    .container {
        max-width: 100%;
        padding: 0;
    }
}`;
    }

    /**
     * Generate base JavaScript
     */
    generateBaseScript() {
        return `
// Base Theme Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded successfully');
    
    // Smooth scrolling for anchor links
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
    
    // Add copy link functionality for headers
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(header => {
        if (header.id) {
            const link = document.createElement('a');
            link.href = '#' + header.id;
            link.className = 'header-link';
            link.textContent = 'Link';
            link.style.fontSize = '0.7em';
            link.style.opacity = '0';
            link.style.marginLeft = '0.5em';
            link.style.transition = 'opacity 0.3s';
            
            header.appendChild(link);
            
            header.addEventListener('mouseenter', () => {
                link.style.opacity = '0.7';
            });
            
            header.addEventListener('mouseleave', () => {
                link.style.opacity = '0';
            });
        }
    });
});`;
    }

    /**
     * Add custom styles
     */
    addStyles(styles) {
        this.styles += styles;
        return this;
    }

    /**
     * Add custom scripts
     */
    addScripts(scripts) {
        this.scripts += scripts;
        return this;
    }

    /**
     * Get theme information
     */
    getInfo() {
        return {
            name: this.name,
            displayName: this.displayName,
            description: this.description
        };
    }
}

module.exports = BaseTheme;