/**
 * Simple Portfolio Theme - Clean Scientist Portfolio
 * Simple, clean portfolio website for scientists with navbar, sidebar, and responsive design
 */

class PortfolioTheme {
    constructor() {
        this.name = 'portfolio';
        this.displayName = 'Simple Portfolio Theme';
        this.description = 'Clean portfolio theme for scientists with simple layout';
        
        this.css = `
/* ===== SIMPLE PORTFOLIO THEME ===== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #333333;
    background: #ffffff;
    min-height: 100vh;
}

/* ===== NAVIGATION BAR ===== */
.portfolio-navbar {
    background: #ffffff;
    border-bottom: 1px solid #e0e0e0;
    padding: 1rem 2rem;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navbar-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
}

.navbar-links {
    display: flex;
    gap: 2rem;
    list-style: none;
}

.navbar-link {
    text-decoration: none;
    color: #333333;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.3s ease;
}

.navbar-link:hover {
    background: #f5f5f5;
    color: #007bff;
}

/* ===== MAIN LAYOUT ===== */
.portfolio-layout {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    min-height: calc(100vh - 70px);
}

/* ===== LEFT SIDEBAR ===== */
.portfolio-sidebar {
    width: 280px;
    background: #f8f9fa;
    border-right: 1px solid #e0e0e0;
    padding: 2rem;
    position: sticky;
    top: 70px;
    height: calc(100vh - 70px);
    overflow-y: auto;
}

.profile-container {
    text-align: center;
    margin-bottom: 2rem;
}

.profile-picture {
    margin: 0 auto 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.profile-name {
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
}

.profile-title {
    font-size: 1rem;
    color: #666;
    margin-bottom: 0.5rem;
}

.profile-location {
    font-size: 0.9rem;
    color: #888;
    margin-bottom: 1.5rem;
}

.social-links {
    list-style: none;
}

.social-link {
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
    text-decoration: none;
    color: #666;
    transition: color 0.3s ease;
}

.social-link:hover {
    color: #007bff;
}

.social-icon {
    width: 20px;
    height: 20px;
    margin-right: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* ===== MAIN CONTENT ===== */
.portfolio-main {
    flex: 1;
    padding: 2rem 3rem;
    max-width: 800px;
}

.main-greeting {
    font-size: 2.5rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 1rem;
}

.bio-section {
    margin-bottom: 2rem;
}

.bio-section h3 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 1rem;
    border-bottom: 2px solid #007bff;
    padding-bottom: 0.5rem;
}

.bio-text {
    color: #555;
    line-height: 1.7;
    margin-bottom: 1.5rem;
}

.achievement-list {
    list-style: none;
    margin-bottom: 2rem;
}

.achievement-item {
    padding: 1rem;
    margin-bottom: 0.75rem;
    background: #f8f9fa;
    border-left: 4px solid #007bff;
    border-radius: 4px;
}

.achievement-date {
    font-size: 0.9rem;
    color: #666;
    font-weight: 500;
}

.achievement-title {
    font-weight: 600;
    color: #333;
    margin: 0.25rem 0;
}

.achievement-description {
    color: #666;
    font-size: 0.95rem;
}

.inline-link {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;
}

.inline-link:hover {
    text-decoration: underline;
}

.hobby-item {
    display: inline-block;
    margin: 0.25rem 0.5rem;
    padding: 0.25rem 0.75rem;
    background: #e9ecef;
    border-radius: 15px;
    font-size: 0.9rem;
    color: #495057;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
    .portfolio-layout {
        flex-direction: column;
    }
    
    .portfolio-sidebar {
        width: 100%;
        height: auto;
        position: relative;
        top: 0;
        border-right: none;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .navbar-links {
        flex-wrap: wrap;
        gap: 1rem;
    }
    
    .portfolio-main {
        padding: 1.5rem;
    }
    
    .main-greeting {
        font-size: 2rem;
    }
}

@media (max-width: 480px) {
    .portfolio-sidebar {
        padding: 1.5rem;
    }
    
    .portfolio-main {
        padding: 1rem;
    }
    
    .navbar-content {
        padding: 0 1rem;
    }
    
    .navbar-links {
        gap: 0.5rem;
    }
    
    .navbar-link {
        padding: 0.4rem 0.8rem;
        font-size: 0.9rem;
    }
}

/* ===== PRINT STYLES ===== */
@media print {
    .portfolio-navbar {
        position: static;
    }
    
    .portfolio-sidebar {
        position: static;
        height: auto;
        border-right: none;
        border-bottom: 1px solid #000;
    }
    
    .portfolio-layout {
        flex-direction: column;
    }
}
`;
        
        this.js = `
// Simple Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('.navbar-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Add hover effects to achievement items
    document.querySelectorAll('.achievement-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Responsive mobile menu toggle
    const navbar = document.querySelector('.portfolio-navbar');
    if (navbar) {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        
        function handleMobileMenu() {
            if (mediaQuery.matches) {
                navbar.classList.add('mobile');
            } else {
                navbar.classList.remove('mobile');
            }
        }
        
        handleMobileMenu();
        mediaQuery.addListener(handleMobileMenu);
    }
});
`;
    }

    /**
     * Generate HTML for portfolio documents
     */
    generateHTML(parsedData) {
        const { html, context, metadata } = parsedData;
        
        // Extract content from parsed HTML
        const processedContent = this.parsePortfolioContent(html);
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${metadata.title || 'Portfolio'}</title>
    <style>${this.css}</style>
</head>
<body>
    ${processedContent}
    <script>${this.js}</script>
</body>
</html>`;
    }

    /**
     * Parse portfolio content into layout components
     */
    parsePortfolioContent(content) {
        // Extract navigation links
        const navLinks = this.extractNavigationLinks(content);
        
        // Extract navigation logo
        const navLogo = this.extractNavigationLogo(content);
        
        // Extract sidebar content
        const sidebarContent = this.extractSidebarContent(content);
        
        // Extract main content
        const mainContent = this.extractMainContent(content);
        
        return `
            <!-- Navigation Bar -->
            <nav class="portfolio-navbar">
                <div class="navbar-content">
                    ${navLogo ? `<div class="navbar-logo"><img src="${navLogo}" alt="Logo" style="height: 40px; margin-right: 2rem;"></div>` : ''}
                    <ul class="navbar-links">
                        ${navLinks.map(link => `<li><a href="${link.href}" class="navbar-link">${link.text}</a></li>`).join('')}
                    </ul>
                </div>
            </nav>
            
            <!-- Main Layout -->
            <div class="portfolio-layout">
                <!-- Left Sidebar -->
                <aside class="portfolio-sidebar">
                    ${sidebarContent}
                </aside>
                
                <!-- Main Content -->
                <main class="portfolio-main">
                    ${mainContent}
                </main>
            </div>
        `;
    }

    /**
     * Extract navigation links from content
     */
    extractNavigationLinks(content) {
        const links = [
            { text: 'Publications', href: '#publications' },
            { text: 'Blog', href: '#blog' },
            { text: 'ML Glossary', href: '#glossary' },
            { text: 'CV', href: '#cv' }
        ];
        
        // Try to extract custom navigation from content
        const navMatch = content.match(/\\navbar\{([^}]*)\}/);
        if (navMatch) {
            const customLinks = navMatch[1].split(',').map(link => link.trim());
            return customLinks.map(link => ({
                text: link,
                href: `#${link.toLowerCase().replace(/\s+/g, '-')}`
            }));
        }
        
        return links;
    }

    /**
     * Extract navigation logo from content
     */
    extractNavigationLogo(content) {
        // Look for navlogo command
        const navLogoMatch = content.match(/\\navlogo\{([^}]+)\}/);
        return navLogoMatch ? navLogoMatch[1] : null;
    }

    /**
     * Extract sidebar content
     */
    extractSidebarContent(content) {
        // Look for sidebar section in content - use function to handle nested braces properly
        const sidebarContent = this.extractBracedContent(content, 'sidebar');
        
        if (sidebarContent) {
            return this.parseSidebarContent(sidebarContent);
        }
        
        // Default sidebar content
        return `
            <div class="profile-container">
                <div class="profile-picture">
                    <span>👤</span>
                </div>
                <h2 class="profile-name">${metadata.author || 'Your Name'}</h2>
                <p class="profile-title">Research Scientist</p>
                <p class="profile-location">📍 City, Country</p>
            </div>
            
            <ul class="social-links">
                <li>
                    <a href="mailto:email@example.com" class="social-link">
                        <span class="social-icon">📧</span>
                        <span>Email</span>
                    </a>
                </li>
                <li>
                    <a href="https://twitter.com" class="social-link">
                        <span class="social-icon">🐦</span>
                        <span>Twitter</span>
                    </a>
                </li>
                <li>
                    <a href="https://linkedin.com" class="social-link">
                        <span class="social-icon">💼</span>
                        <span>LinkedIn</span>
                    </a>
                </li>
                <li>
                    <a href="https://github.com" class="social-link">
                        <span class="social-icon">💻</span>
                        <span>GitHub</span>
                    </a>
                </li>
                <li>
                    <a href="https://scholar.google.com" class="social-link">
                        <span class="social-icon">🎓</span>
                        <span>Google Scholar</span>
                    </a>
                </li>
            </ul>
        `;
    }

    /**
     * Extract content from braces, handling nested braces properly
     */
    extractBracedContent(content, command) {
        const pattern = `\\${command}{`;
        const startIndex = content.indexOf(pattern);
        
        if (startIndex === -1) return null;
        
        const contentStart = startIndex + pattern.length;
        let braceCount = 1;
        let currentIndex = contentStart;
        
        while (currentIndex < content.length && braceCount > 0) {
            const char = content[currentIndex];
            if (char === '{') {
                braceCount++;
            } else if (char === '}') {
                braceCount--;
            }
            currentIndex++;
        }
        
        if (braceCount === 0) {
            return content.substring(contentStart, currentIndex - 1);
        }
        
        return null;
    }

    /**
     * Parse custom sidebar content
     */
    parseSidebarContent(sidebarText) {
        // Extract profile image with options - more robust regex
        let profileImage = null;
        let imageShape = 'circle'; // default shape
        
        // Try with options first: \profileimage[shape=circle]{image.png}
        const withOptionsMatch = sidebarText.match(/\\profileimage\[(.*?)\]\{([^}]+)\}/);
        if (withOptionsMatch) {
            profileImage = withOptionsMatch[2];
            const options = withOptionsMatch[1];
            const shapeMatch = options.match(/shape=([^,\]]+)/);
            if (shapeMatch) {
                imageShape = shapeMatch[1].trim();
            }
        } else {
            // Try without options: \profileimage{image.png}
            const withoutOptionsMatch = sidebarText.match(/\\profileimage\{([^}]+)\}/);
            if (withoutOptionsMatch) {
                profileImage = withoutOptionsMatch[1];
            }
        }
        
        // Remove the profileimage command from text before parsing
        let cleanText = sidebarText.replace(/\\profileimage(\[[^\]]*\])?\{[^}]*\}/g, '').trim();
        
        const parts = cleanText.split('|').map(part => part.trim());
        
        let name = parts[0] || 'Your Name';
        let title = parts[1] || 'Research Scientist';
        let location = parts[2] || 'City, Country';
        
        // Generate shape styles
        let shapeStyle = '';
        if (imageShape === 'circle') {
            shapeStyle = 'border-radius: 50%; width: 120px; height: 120px;';
        } else if (imageShape === 'rectangle') {
            shapeStyle = 'border-radius: 8px; width: 120px; height: 120px;';
        } else { // default
            shapeStyle = 'border-radius: 4px; width: 120px; height: 120px;';
        }
        
        // Remove gray background when image is present
        const backgroundStyle = profileImage ? '' : 'background: #f0f0f0;';
        
        return `
            <div class="profile-container">
                <div class="profile-picture" style="${shapeStyle} ${backgroundStyle} overflow: hidden;">
                    ${profileImage ? 
                        `<img src="${profileImage}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; display: block;">` : 
                        ''
                    }
                </div>
                <h2 class="profile-name">${name}</h2>
                <p class="profile-title">${title}</p>
                <p class="profile-location">📍 ${location}</p>
            </div>
            
            <ul class="social-links">
                <li>
                    <a href="mailto:email@example.com" class="social-link">
                        <span class="social-icon">📧</span>
                        <span>Email</span>
                    </a>
                </li>
                <li>
                    <a href="https://twitter.com" class="social-link">
                        <span class="social-icon">🐦</span>
                        <span>Twitter</span>
                    </a>
                </li>
                <li>
                    <a href="https://linkedin.com" class="social-link">
                        <span class="social-icon">💼</span>
                        <span>LinkedIn</span>
                    </a>
                </li>
                <li>
                    <a href="https://github.com" class="social-link">
                        <span class="social-icon">💻</span>
                        <span>GitHub</span>
                    </a>
                </li>
                <li>
                    <a href="https://scholar.google.com" class="social-link">
                        <span class="social-icon">🎓</span>
                        <span>Google Scholar</span>
                    </a>
                </li>
            </ul>
        `;
    }

    /**
     * Extract main content
     */
    extractMainContent(content) {
        // Remove sidebar and navbar commands
        let cleanContent = content.replace(/\\navbar\{[^}]*\}/g, '');
        cleanContent = cleanContent.replace(/\\sidebar\{[^}]*\}/g, '');
        
        // Process LaTeX content
        let mainContent = cleanContent
            .replace(/\\title\{([^}]+)\}/g, '')
            .replace(/\\author\{([^}]+)\}/g, '')
            .replace(/\\date\{([^}]+)\}/g, '')
            .replace(/\\maketitle/g, '')
            .replace(/\\begin\{document\}([\s\S]*?)\\end\{document\}/g, '$1')
            .trim();
        
        // Convert LaTeX sections to HTML
        mainContent = this.convertLaTeXSections(mainContent);
        
        return `
            <h1 class="main-greeting">Hello!</h1>
            
            <section class="bio-section" id="about">
                <h3>About</h3>
                <p class="bio-text">
                    Welcome to my portfolio! I'm a research scientist passionate about 
                    <span class="inline-link">machine learning</span>, 
                    <span class="inline-link">artificial intelligence</span>, and 
                    <span class="inline-link">data science</span>.
                </p>
            </section>
            
            <section class="bio-section" id="news">
                <h3>Recent News</h3>
                <ul class="achievement-list">
                    <li class="achievement-item">
                        <div class="achievement-date">October 2024</div>
                        <div class="achievement-title">New Paper Published</div>
                        <div class="achievement-description">Our research on deep learning was accepted at ICML 2024.</div>
                    </li>
                    <li class="achievement-item">
                        <div class="achievement-date">September 2024</div>
                        <div class="achievement-title">Conference Presentation</div>
                        <div class="achievement-description">Presented our work at NeurIPS 2024 in Vancouver.</div>
                    </li>
                </ul>
            </section>
            
            <section class="bio-section" id="publications">
                <h3>Selected Publications</h3>
                <ul class="achievement-list">
                    <li class="achievement-item">
                        <div class="achievement-title">Deep Learning for Scientific Discovery</div>
                        <div class="achievement-description">Nature Machine Intelligence, 2024</div>
                    </li>
                    <li class="achievement-item">
                        <div class="achievement-title">Efficient Training of Large Language Models</div>
                        <div class="achievement-description">ICML 2024</div>
                    </li>
                </ul>
            </section>
            
            <section class="bio-section" id="hobbies">
                <h3>Hobbies & Interests</h3>
                <div>
                    <span class="hobby-item">🏃 Running</span>
                    <span class="hobby-item">📚 Reading</span>
                    <span class="hobby-item">🎵 Music</span>
                    <span class="hobby-item">♟️ Chess</span>
                    <span class="hobby-item">🎨 Art</span>
                </div>
            </section>
            
            ${mainContent ? `<section id="additional-content">${mainContent}</section>` : ''}
        `;
    }

    /**
     * Convert LaTeX sections to HTML
     */
    convertLaTeXSections(content) {
        let html = content;
        
        // Convert section commands
        html = html.replace(/\\section\{([^}]+)\}/g, '<h2>$1</h2>');
        html = html.replace(/\\subsection\{([^}]+)\}/g, '<h3>$1</h3>');
        html = html.replace(/\\subsubsection\{([^}]+)\}/g, '<h4>$1</h4>');
        
        // Remove extra \n patterns that are showing in the output
        html = html.replace(/\\n/g, '');
        html = html.replace(/\\\\n/g, '');
        html = html.replace(/\\\\/g, '');
        
        // Convert text formatting
        html = html.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>');
        html = html.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>');
        html = html.replace(/\\emph\{([^}]+)\}/g, '<em>$1</em>');
        
        // Convert image commands
        html = html.replace(/\\includegraphics\[(.*?)\]\{([^}]+)\}/g, (match, options, path) => {
            const optionStyle = this.parseImageOptions(options);
            return `<img src="${path}" alt="Image" style="${optionStyle}">`;
        });
        
        html = html.replace(/\\includegraphics\{([^}]+)\}/g, (match, path) => {
            return `<img src="${path}" alt="Image" style="max-width: 100%; height: auto;">`;
        });
        
        // Convert figure environments
        html = html.replace(/\\begin\{figure\}([\s\S]*?)\\end\{figure\}/g, (match, content) => {
            const imgMatch = content.match(/\\includegraphics\[(.*?)\]\{([^}]+)\}/) || 
                             content.match(/\\includegraphics\{([^}]+)\}/);
            const captionMatch = content.match(/\\caption\{([^}]+)\}/);
            
            if (imgMatch) {
                const img = imgMatch[0].replace(/\\includegraphics/, '<img').replace(/\}/, '>')
                    .replace(/([^\[]+)\[([^\]]+)\]\{([^}]+)\}/, '<img src="$3" alt="Image" style="$2">')
                    .replace(/\\includegraphics\{([^}]+)\}/, '<img src="$1" alt="Image" style="max-width: 100%; height: auto;">');
                
                const caption = captionMatch ? `<figcaption>${captionMatch[1]}</figcaption>` : '';
                return `<figure style="margin: 2rem 0; text-align: center;">${img}${caption}</figure>`;
            }
            return match;
        });
        
        // Convert itemize lists
        html = html.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (match, items) => {
            const itemLines = items.split('\\item').filter(item => item.trim());
            const listItems = itemLines.map(item => `<li>${item.trim()}</li>`).join('');
            return `<ul>${listItems}</ul>`;
        });
        
        // Convert paragraphs (split by double newlines)
        const paragraphs = html.split('\n\n').filter(p => p.trim());
        html = paragraphs.map(p => {
            if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<ol') || p.startsWith('<img') || p.startsWith('<figure')) {
                return p;
            }
            return `<p>${p}</p>`;
        }).join('\n');
        
        return html;
    }

    /**
     * Parse image options to CSS style
     */
    parseImageOptions(options) {
        let style = 'max-width: 100%; height: auto;';
        
        // Parse width option
        const widthMatch = options.match(/width=([^,]+)/);
        if (widthMatch) {
            const width = widthMatch[1].trim();
            if (width.includes('\\textwidth')) {
                style = 'width: 100%; height: auto;';
            } else if (width.includes('cm')) {
                const cmValue = parseFloat(width);
                style = `width: ${cmValue * 37.8}px; height: auto;`;
            } else if (width.match(/\d+px/)) {
                style = `width: ${width}; height: auto;`;
            } else if (width.match(/\d+%$/)) {
                style = `width: ${width}; height: auto;`;
            } else if (width.match(/\d+mm/)) {
                const mmValue = parseFloat(width);
                style = `width: ${mmValue * 3.78}px; height: auto;`;
            } else {
                // Assume pixels if just a number
                const pixelValue = parseFloat(width);
                if (!isNaN(pixelValue)) {
                    style = `width: ${pixelValue}px; height: auto;`;
                }
            }
        }
        
        // Parse height option
        const heightMatch = options.match(/height=([^,]+)/);
        if (heightMatch) {
            const height = heightMatch[1].trim();
            if (height.includes('cm')) {
                const cmValue = parseFloat(height);
                style += ` max-height: ${cmValue * 37.8}px;`;
            } else if (height.match(/\d+px/)) {
                style += ` max-height: ${height};`;
            } else if (height.match(/\d+%$/)) {
                style += ` max-height: ${height};`;
            } else if (height.match(/\d+mm/)) {
                const mmValue = parseFloat(height);
                style += ` max-height: ${mmValue * 3.78}px;`;
            } else {
                // Assume pixels if just a number
                const pixelValue = parseFloat(height);
                if (!isNaN(pixelValue)) {
                    style += ` max-height: ${pixelValue}px;`;
                }
            }
        }
        
        return style;
    }
}

module.exports = PortfolioTheme;