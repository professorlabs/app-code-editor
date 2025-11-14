/**
 * Default Theme - Clean, Modern, Professional
 * Suitable for articles, reports, and general documents
 */

class DefaultTheme {
    constructor() {
        this.name = 'default';
        this.displayName = 'Default Theme';
        this.description = 'Clean, modern theme suitable for most documents';
        
        this.css = `
/* ===== DEFAULT THEME STYLES ===== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Georgia', 'Times New Roman', serif;
    line-height: 1.7;
    color: #2c3e50;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 20px;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* ===== TYPOGRAPHY ===== */
.title {
    text-align: center;
    font-size: 2.8em;
    margin-bottom: 10px;
    color: #1a1a1a;
    font-weight: 300;
    line-height: 1.2;
}

.author {
    text-align: center;
    font-size: 1.3em;
    color: #6c757d;
    margin-bottom: 15px;
    line-height: 1.4;
}

.author-name {
    color: #495057;
    font-style: normal;
}

.author-name sup {
    font-size: 0.7em;
    vertical-align: super;
    color: #007bff;
}

.affiliations {
    text-align: center;
    margin-bottom: 15px;
    font-size: 1.1em;
    line-height: 1.4;
}

.affiliation {
    color: #6c757d;
    margin-bottom: 5px;
}

.affiliation sup {
    color: #007bff;
    font-weight: bold;
    margin-right: 5px;
}

.emails {
    text-align: center;
    margin-bottom: 20px;
    font-size: 0.95em;
}

.email {
    color: #495057;
    margin: 0 8px;
}

.email code {
    background: #f8f9fa;
    padding: 2px 6px;
    border-radius: 3px;
    color: #007bff;
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', monospace;
}

.date {
    text-align: center;
    color: #868e96;
    margin-bottom: 40px;
    font-size: 1.1em;
}

.small-caps {
    font-variant: small-caps;
}

.roman {
    font-family: 'Georgia', 'Times New Roman', serif;
}

.sans-serif {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.abstract {
    background: #f8f9fa;
    border-left: 4px solid #007bff;
    padding: 20px;
    margin: 30px 0;
    border-radius: 0 8px 8px 0;
    font-size: 0.95em;
    line-height: 1.6;
}

.abstract-title {
    font-weight: bold;
    margin-bottom: 10px;
    color: #495057;
    text-transform: uppercase;
    font-size: 0.9em;
    letter-spacing: 1px;
}

/* ===== SECTIONS ===== */
h1 {
    font-size: 2.2em;
    margin: 50px 0 25px 0;
    color: #1a1a1a;
    border-bottom: 3px solid #007bff;
    padding-bottom: 15px;
    font-weight: 600;
}

h2 {
    font-size: 1.8em;
    margin: 40px 0 20px 0;
    color: #2c3e50;
    font-weight: 600;
}

h3 {
    font-size: 1.4em;
    margin: 30px 0 15px 0;
    color: #34495e;
    font-weight: 500;
}

h4 {
    font-size: 1.2em;
    margin: 25px 0 12px 0;
    color: #495057;
    font-weight: 500;
}

/* ===== NAVIGATION ===== */
nav {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    margin-bottom: 40px;
    border: 1px solid #e9ecef;
}

nav ul {
    list-style: none;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 15px;
}

nav li {
    padding: 10px 20px;
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;
    border-radius: 25px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 500;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

nav li:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(0, 123, 255, 0.3);
}

nav li:active {
    transform: translateY(0);
}

nav a {
    color: white;
    text-decoration: none;
    display: block;
}

/* ===== BOXES & CONTAINERS ===== */
.box {
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 12px;
    padding: 25px;
    margin: 30px 0;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
    position: relative;
    transition: all 0.3s ease;
}

.box:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
}

.box-title {
    position: absolute;
    top: -12px;
    left: 25px;
    background: linear-gradient(135deg, #007bff, #0056b3);
    color: white;
    padding: 8px 20px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.9em;
    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
}

/* ===== LISTS ===== */
ul {
    margin: 20px 0 20px 30px;
    padding-left: 20px;
}

ol {
    margin: 20px 0 20px 30px;
    padding-left: 20px;
}

li {
    margin: 10px 0;
    color: #495057;
    line-height: 1.6;
}

ul li::marker {
    color: #007bff;
    font-size: 1.2em;
}

ol li::marker {
    color: #007bff;
    font-weight: bold;
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
    color: #007bff;
}

.underline {
    text-decoration: underline;
    text-decoration-color: #007bff;
    text-underline-offset: 4px;
}

/* ===== PARAGRAPHS ===== */
p {
    margin: 18px 0;
    text-align: justify;
    text-indent: 2em;
    line-height: 1.8;
}

p:first-of-type {
    text-indent: 0;
}

/* ===== QUOTES ===== */
blockquote {
    border-left: 4px solid #007bff;
    margin: 25px 0;
    padding: 15px 25px;
    background: #f8f9fa;
    font-style: italic;
    color: #495057;
    border-radius: 0 8px 8px 0;
}

blockquote p {
    text-indent: 0;
}

/* ===== CODE BLOCKS ===== */
.code-box {
    background: #1e1e1e;
    border-radius: 4px;
    margin: 16px 0;
    overflow: hidden;
    border: 1px solid #444;
}

/* GRAY THEME STYLES */
.code-box.gray-bg {
    background: #2d3748;
    border: 1px solid #4a5568;
    color: #e2e8f0;
}


.code-box.gray-bg .code-tabs {
    background: #1a202c;
    border-bottom: 1px solid #4a5568;
}

.code-box.gray-bg .code-tab {
    color: #cbd5e0;
}

.code-box.gray-bg .code-tab:hover {
    color: #e2e8f0;
    background: #2d3748;
}

.code-box.gray-bg .code-tab.active {
    color: #e2e8f0;
    background: #2d3748;
}

.code-box.gray-bg .code-tab.active::after {
    background: linear-gradient(90deg, #4fc08d, #68d391);
}

.code-box.gray-bg .code-content {
    background: #2d3748;
    color: #e2e8f0;
}

.code-box.gray-bg .code-header {
    border-bottom: 1px solid #4a5568;
}

.code-box.gray-bg .code-title {
    color: #4fc08d;
}

.code-box.gray-bg .copy-btn {
    background: linear-gradient(135deg, #4299e1, #3182ce);
}

.code-box.gray-bg .copy-btn:hover {
    background: linear-gradient(135deg, #3182ce, #2c5282);
}

.code-tabs {
    display: flex;
    background: #2d2d30;
    padding: 0;
    position: relative;
    border-bottom: 1px solid #3e3e42;
}

.code-tab {
    padding: 12px 24px;
    background: transparent;
    color: #969696;
    border: none;
    cursor: pointer;
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
    font-size: 14px;
    transition: all 0.3s ease;
    position: relative;
}

.code-tab:hover {
    color: #fff;
    background: #383838;
}

.code-tab.active {
    color: #fff;
    background: #1e1e1e;
}

.code-tab.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #007acc, #0099ff);
}

.code-pane {
    display: none;
}

.code-pane.active {
    display: block;
}

.code-pane pre {
    margin: 0;
    padding: 16px;
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
    font-size: 14px;
    line-height: 1.5;
    overflow-x: auto;
    white-space: pre;
    background: transparent;
    color: inherit;
}

.code-content code {
    display: block;
    white-space: pre;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
    tab-size: 4;
}


.code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    border-bottom: 1px solid #3e3e42;
    background: rgba(0, 0, 0, 0.1);
}

.code-title {
    color: #569cd6;
    font-weight: 600;
    font-size: 16px;
}

.copy-btn {
    background: linear-gradient(135deg, #007acc, #005a9e);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    font-family: inherit;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    gap: 6px;
}

.copy-btn:hover {
    background: linear-gradient(135deg, #005a9e, #004578);
}

.copy-btn.success {
    background: linear-gradient(135deg, #4caf50, #388e3c);
}

.copy-icon {
    transition: all 0.3s ease;
}

.copy-btn.success .copy-icon {
    transform: scale(1.2);
}

/* SYNTAX HIGHLIGHTING */
.syntax-keyword { color: #569cd6; font-weight: 600; }
.syntax-string { color: #ce9178; }
.syntax-number { color: #b5cea8; }
.syntax-comment { color: #6a9955; font-style: italic; }
.syntax-function { color: #dcdcaa; }
.syntax-variable { color: #9cdcfe; }
.syntax-operator { color: #d4d4d4; }
.syntax-type { color: #4ec9b0; }
.syntax-annotation { color: #ff9800; }
.syntax-preprocessor { color: #c586c0; }
.syntax-template { color: #ce9178; }
.syntax-selector { color: #d7ba7d; }
.syntax-property { color: #9cdcfe; }
.syntax-value { color: #ce9178; }
.syntax-tag { color: #569cd6; }
.syntax-attribute { color: #92c5f8; }
.syntax-command { color: #dcdcaa; }
.syntax-decorator { color: #c586c0; }

/* GRAY THEME SYNTAX HIGHLIGHTING */
.code-box.gray-bg .syntax-keyword { color: #4fc08d; font-weight: 600; }
.code-box.gray-bg .syntax-string { color: #ed64a6; }
.code-box.gray-bg .syntax-number { color: #f6e05e; }
.code-box.gray-bg .syntax-comment { color: #68d391; font-style: italic; }
.code-box.gray-bg .syntax-function { color: #63b3ed; }
.code-box.gray-bg .syntax-variable { color: #90cdf4; }
.code-box.gray-bg .syntax-operator { color: #e2e8f0; }
.code-box.gray-bg .syntax-type { color: #9f7aea; }
.code-box.gray-bg .syntax-annotation { color: #f6ad55; }
.code-box.gray-bg .syntax-preprocessor { color: #d53f8c; }
.code-box.gray-bg .syntax-template { color: #ed64a6; }
.code-box.gray-bg .syntax-selector { color: #f6ad55; }
.code-box.gray-bg .syntax-property { color: #90cdf4; }
.code-box.gray-bg .syntax-value { color: #ed64a6; }
.code-box.gray-bg .syntax-tag { color: #4fc08d; }
.code-box.gray-bg .syntax-attribute { color: #63b3ed; }
.code-box.gray-bg .syntax-command { color: #63b3ed; }
.code-box.gray-bg .syntax-decorator { color: #d53f8c; }

/* WHITE THEME STYLES */
.code-box.white-bg {
    background: #ffffff;
    border: 1px solid #e1e4e8;
    color: #24292e;
}

.code-box.white-bg:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.code-box.white-bg .code-tabs {
    background: #f6f8fa;
    border-bottom: 1px solid #e1e4e8;
}

.code-box.white-bg .code-tab {
    color: #586069;
}

.code-box.white-bg .code-tab:hover {
    color: #24292e;
    background: #ffffff;
}

.code-box.white-bg .code-tab.active {
    color: #24292e;
    background: #ffffff;
}

.code-box.white-bg .code-tab.active::after {
    background: linear-gradient(90deg, #0366d6, #005cc5);
}

.code-box.white-bg .code-content {
    background: #ffffff;
    color: #24292e;
}

.code-box.white-bg .code-header {
    border-bottom: 1px solid #e1e4e8;
    background: #f6f8fa;
}

.code-box.white-bg .code-title {
    color: #0366d6;
}

.code-box.white-bg .copy-btn {
    background: linear-gradient(135deg, #0366d6, #005cc5);
}

.code-box.white-bg .copy-btn:hover {
    background: linear-gradient(135deg, #005cc5, #004972);
}

/* WHITE THEME SYNTAX HIGHLIGHTING */
.code-box.white-bg .syntax-keyword { color: #d73a49; font-weight: 600; }
.code-box.white-bg .syntax-string { color: #e53e3e; }
.code-box.white-bg .syntax-number { color: #38a169; }
.code-box.white-bg .syntax-comment { color: #718096; font-style: italic; }
.code-box.white-bg .syntax-function { color: #3182ce; }
.code-box.white-bg .syntax-variable { color: #2c5282; }
.code-box.white-bg .syntax-operator { color: #1a202c; }
.code-box.white-bg .syntax-type { color: #805ad5; }
.code-box.white-bg .syntax-annotation { color: #d69e2e; }
.code-box.white-bg .syntax-preprocessor { color: #553c9a; }
.code-box.white-bg .syntax-template { color: #e53e3e; }
.code-box.white-bg .syntax-selector { color: #d69e2e; }
.code-box.white-bg .syntax-property { color: #2c5282; }
.code-box.white-bg .syntax-value { color: #e53e3e; }
.code-box.white-bg .syntax-tag { color: #d73a49; }
.code-box.white-bg .syntax-attribute { color: #3182ce; }
.code-box.white-bg .syntax-command { color: #3182ce; }
.code-box.white-bg .syntax-decorator { color: #553c9a; }
.code-box.white-bg .syntax-entity { color: #005cc5; }

.inline-code {
    background: #f1f3f4;
    color: #d63384;
    padding: 3px 8px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
    border: 1px solid #e9ecef;
}

/* ===== IMAGES ===== */
.center {
    text-align: center;
    margin: 30px 0;
}

img {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
}

img:hover {
    transform: scale(1.02);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}

/* ===== TABLE OF CONTENTS ===== */
.table-of-contents {
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 12px;
    padding: 30px;
    margin: 40px 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.table-of-contents h2 {
    margin-top: 0;
    color: #1a1a1a;
    border-bottom: 2px solid #007bff;
    padding-bottom: 10px;
}

.toc-content {
    line-height: 1.8;
}

.toc-content ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
}

.toc-content li {
    margin: 8px 0;
    padding: 5px 0;
}

.toc-content a {
    color: #007bff;
    text-decoration: none;
    transition: color 0.3s ease;
}

.toc-content a:hover {
    color: #0056b3;
    text-decoration: underline;
}

/* ===== PAGE BREAK ===== */
.page-break {
    page-break-before: always;
    margin: 60px 0;
    border-top: 2px dashed #dee2e6;
    padding-top: 20px;
}

.page-break::before {
    content: "— Page Break —";
    display: block;
    text-align: center;
    color: #adb5bd;
    font-style: italic;
    margin-bottom: 20px;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
    body {
        padding: 20px 15px;
    }
    
    .title {
        font-size: 2.2em;
    }
    
    .author {
        font-size: 1.1em;
    }
    
    h1 {
        font-size: 1.8em;
        margin: 30px 0 20px 0;
    }
    
    h2 {
        font-size: 1.5em;
        margin: 25px 0 15px 0;
    }
    
    nav ul {
        flex-direction: column;
        align-items: center;
        gap: 10px;
    }
    
    nav li {
        width: 100%;
        text-align: center;
        max-width: 200px;
    }
    
    .box {
        padding: 20px;
    }
    
    .code-tab {
        padding: 10px 15px;
        font-size: 12px;
    }
    
    .code-content {
        padding: 15px;
        font-size: 12px;
    }
    
    p {
        text-indent: 1.5em;
    }
}

@media (max-width: 480px) {
    body {
        padding: 15px 10px;
    }
    
    .title {
        font-size: 1.8em;
    }
    
    .box {
        padding: 15px;
        margin: 20px 0;
    }
}

/* ===== PRINT STYLES ===== */
@media print {
    body {
        background: white;
        color: black;
        max-width: 100%;
        padding: 0;
        font-size: 12pt;
    }
    
    .title {
        font-size: 24pt;
    }
    
    h1 {
        font-size: 18pt;
        page-break-before: always;
    }
    
    h2 {
        font-size: 16pt;
    }
    
    h3 {
        font-size: 14pt;
    }
    
    nav {
        display: none;
    }
    
    .page-break {
        page-break-before: always;
    }
    
    .page-break::before {
        display: none;
    }
    
    .code-box {
        border: 1px solid black;
        background: white;
        page-break-inside: avoid;
    }
    
    img {
        max-width: 100%;
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

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.fade-in {
    animation: fadeIn 0.6s ease-out;
}

.slide-in {
    animation: slideIn 0.6s ease-out;
}
`;

        this.javascript = `
// ===== DEFAULT THEME JAVASCRIPT =====
document.addEventListener('DOMContentLoaded', function() {
    // Syntax highlighting is handled by the CodeParser
    
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
    
    // Intersection Observer removed - no animations
    
    // Code box tab switching
    document.querySelectorAll('.code-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const codeBox = this.closest('.code-box');
            const targetId = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and panes
            codeBox.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
            codeBox.querySelectorAll('.code-pane').forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding pane
            this.classList.add('active');
            const targetPane = codeBox.querySelector(\`#\${targetId}\`);
            if (targetPane) {
                targetPane.classList.add('active');
                
                // Code is already highlighted by CodeParser
            }
        });
    });
    
    // Copy functionality with animation
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const codeBox = this.closest('.code-box');
            const activePane = codeBox.querySelector('.code-pane.active');
            
            if (activePane) {
                const codeText = activePane.textContent;
                
                try {
                    await navigator.clipboard.writeText(codeText);
                    
                    const icon = this.querySelector('.copy-icon');
                    const originalHTML = icon.innerHTML;
                    const originalText = this.innerHTML;
                    
                    // Show success state
                    icon.innerHTML = '✓';
                    this.classList.add('success');
                    this.innerHTML = '<span class="copy-icon">Copied!</span>';
                    
                    // Revert after 2 seconds
                    setTimeout(() => {
                        icon.innerHTML = originalHTML;
                        this.classList.remove('success');
                        this.innerHTML = originalText;
                    }, 2000);
                    
                } catch (err) {
                    console.error('Failed to copy:', err);
                    
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = codeText;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    
                    // Show success state
                    this.classList.add('success');
                    this.innerHTML = '<span class="copy-icon">Copied!</span>';
                    
                    setTimeout(() => {
                        this.classList.remove('success');
                        this.innerHTML = '<span class="copy-icon">Copy</span>';
                    }, 2000);
                }
            }
        });
    });
    
    // Generate table of contents if needed
    const tocContent = document.querySelector('.toc-content');
    if (tocContent && !tocContent.innerHTML.trim()) {
        generateTableOfContents(tocContent);
    }
    
    // Add print styles detection
    window.addEventListener('beforeprint', function() {
        document.body.classList.add('printing');
    });
    
    window.addEventListener('afterprint', function() {
        document.body.classList.remove('printing');
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + P for print
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            window.print();
        }
        
        // Escape to clear focus
        if (e.key === 'Escape') {
            document.activeElement.blur();
        }
    });
});

// Table of Contents Generator
function generateTableOfContents(container) {
    const headings = document.querySelectorAll('h1, h2, h3, h4');
    const toc = document.createElement('ul');
    
    headings.forEach((heading, index) => {
        // Add ID if missing
        if (!heading.id) {
            heading.id = 'heading-' + index;
        }
        
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#' + heading.id;
        link.textContent = heading.textContent;
        
        // Style based on heading level
        link.style.paddingLeft = ((parseInt(heading.tagName.substring(1)) - 1) * 15) + 'px';
        link.style.display = 'block';
        
        li.appendChild(link);
        toc.appendChild(li);
    });
    
    container.appendChild(toc);
}

// Utility function to check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Export for external use if needed
window.DefaultTheme = {
    generateTableOfContents,
    isInViewport
};
`;
    }

    generateHTML(parsed) {
        const { html, context, metadata } = parsed;
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata.title || 'LaTeX Document'}</title>
    <meta name="author" content="${metadata.author || ''}">
    <meta name="description" content="${metadata.description || ''}">
    <meta name="keywords" content="${(metadata.keywords || []).join(', ')}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${metadata.title || 'LaTeX Document'}">
    <meta property="og:description" content="${metadata.description || ''}">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="${metadata.title || 'LaTeX Document'}">
    <meta property="twitter:description" content="${metadata.description || ''}">
    
    <!-- Custom syntax highlighting (no external dependencies) -->
    
    <style>${this.css}</style>
</head>
<body>
    ${html}
    <script>${this.javascript}</script>
</body>
</html>`;
    }
}

module.exports = DefaultTheme;