/**
 * Portfolio Document Renderer
 * Custom renderer for portfolio websites with advanced layout features
 */

const DocumentRenderer = require('./DocumentRenderer');

class PortfolioRenderer extends DocumentRenderer {
    constructor() {
        super();
        this.name = 'portfolio';
        this.displayName = 'Portfolio';
        this.layoutComponents = {
            navbar: null,
            leftside: null,
            rightside: null,
            footer: null
        };
        this.initializeSupportedCommands();
    }

    /**
     * Initialize supported LaTeX commands for portfolio class
     */
    initializeSupportedCommands() {
        // Portfolio-specific layout commands
        this.addSupportedCommand('navbar');
        this.addSupportedCommand('leftside');
        this.addSupportedCommand('rightside');
        this.addSupportedCommand('footer');
        
        // Sectioning commands
        this.addSupportedCommand('section');
        this.addSupportedCommand('subsection');
        this.addSupportedCommand('subsubsection');

        // Text formatting commands
        this.addSupportedCommand('textbf');
        this.addSupportedCommand('textit');
        this.addSupportedCommand('texttt');
        this.addSupportedCommand('emph');
        this.addSupportedCommand('underline');

        // List environments
        this.addSupportedCommand('itemize');
        this.addSupportedCommand('enumerate');
        this.addSupportedCommand('description');

        // Document structure
        this.addSupportedCommand('title');
        this.addSupportedCommand('author');
        this.addSupportedCommand('date');
        this.addSupportedCommand('maketitle');

        // Media and content
        this.addSupportedCommand('project');
        this.addSupportedCommand('blog');
        this.addSupportedCommand('contact');
        this.addSupportedCommand('skills');
        this.addSupportedCommand('experience');

        // Math environments
        this.addSupportedCommand('equation');
        this.addSupportedCommand('align');

        // Float environments
        this.addSupportedCommand('figure');
        this.addSupportedCommand('table');

        // Code blocks
        this.addSupportedCommand('code');
        this.addSupportedCommand('minted');
        this.addSupportedCommand('lstlisting');
        this.addSupportedCommand('verbatim');
    }

    /**
     * Parse portfolio document structure
     */
    parseDocument() {
        this.validateDocument();
        
        let processedContent = this.sanitizeContent(this.content);
        
        // Remove document class and usepackage commands
        processedContent = processedContent.replace(/\\documentclass(\[.*?\])?\{.*?\}/g, '');
        processedContent = processedContent.replace(/\\usepackage(\[.*?\])?\{.*?\}/g, '');
        
        // Extract document body
        const documentMatch = processedContent.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/);
        if (!documentMatch) {
            throw new Error('Portfolio document must have begin/end document environment');
        }

        let documentBody = documentMatch[1];
        
        // Process layout components first
        documentBody = this.processLayoutComponents(documentBody);
        
        // Process portfolio-specific sections
        documentBody = this.processPortfolioSections(documentBody);
        
        // Process sections
        documentBody = this.processSections(documentBody);
        
        // Process standard environments
        documentBody = this.processEnvironment(documentBody, 'itemize');
        documentBody = this.processEnvironment(documentBody, 'enumerate');
        documentBody = this.processEnvironment(documentBody, 'description');
        documentBody = this.processEnvironment(documentBody, 'figure');
        documentBody = this.processEnvironment(documentBody, 'table');
        documentBody = this.processEnvironment(documentBody, 'equation');
        
        // Process code blocks
        documentBody = this.processCodeBlocks(documentBody);
        
        // Process inline commands
        documentBody = this.processCommands(documentBody);
        
        // Process paragraphs
        documentBody = this.processParagraphs(documentBody);
        
        return this.wrapInLayoutStructure(documentBody);
    }

    /**
     * Process layout components (navbar, leftside, rightside, footer)
     */
    processLayoutComponents(content) {
        let processedContent = content;
        
        // Process navbar
        processedContent = this.processLayoutCommand(processedContent, 'navbar');
        
        // Process leftside
        processedContent = this.processLayoutCommand(processedContent, 'leftside');
        
        // Process rightside
        processedContent = this.processLayoutCommand(processedContent, 'rightside');
        
        // Process footer
        processedContent = this.processLayoutCommand(processedContent, 'footer');
        
        return processedContent;
    }

    /**
     * Process individual layout command
     */
    processLayoutCommand(content, command) {
        const pattern = new RegExp(`\\\\${command}\\{([^}]+)\\}(\\[([^\\]]+)\\])?`, 'g');
        
        return content.replace(pattern, (match, contentPart, optionsPart, options) => {
            const layoutOptions = this.parseLayoutOptions(options);
            this.layoutComponents[command] = {
                content: contentPart,
                options: layoutOptions
            };
            return `<!-- LAYOUT_COMPONENT_${command.toUpperCase()} -->`;
        });
    }

    /**
     * Parse layout options from bracket arguments
     */
    parseLayoutOptions(optionsString) {
        if (!optionsString) return {};
        
        const options = {};
        
        // Parse key:value pairs
        const pairs = optionsString.split(',').map(s => s.trim());
        
        pairs.forEach(pair => {
            const [key, value] = pair.split(':').map(s => s.trim());
            if (key && value) {
                // Handle boolean values
                if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
                    options[key] = value.toLowerCase() === 'true';
                } else {
                    options[key] = value;
                }
            }
        });
        
        return options;
    }

    /**
     * Process portfolio-specific sections
     */
    processPortfolioSections(content) {
        const portfolioCommands = ['project', 'blog', 'contact', 'skills', 'experience'];
        
        let processedContent = content;
        
        portfolioCommands.forEach(command => {
            const pattern = new RegExp(`\\\\${command}\\{([^}]+)\\}`, 'g');
            processedContent = processedContent.replace(pattern, (match, args) => {
                return this.renderPortfolioSection(command, args);
            });
        });
        
        return processedContent;
    }

    /**
     * Render portfolio-specific sections
     */
    renderPortfolioSection(sectionType, content) {
        switch (sectionType) {
            case 'project':
                return `<div class="portfolio-project">
                    <div class="project-content">${content}</div>
                </div>`;
                
            case 'blog':
                return `<article class="blog-post">
                    <div class="blog-content">${content}</div>
                </article>`;
                
            case 'contact':
                return `<section class="contact-section">
                    <div class="contact-content">${content}</div>
                </section>`;
                
            case 'skills':
                return `<section class="skills-section">
                    <div class="skills-content">${content}</div>
                </section>`;
                
            case 'experience':
                return `<section class="experience-section">
                    <div class="experience-content">${content}</div>
                </section>`;
                
            default:
                return `<div class="portfolio-${sectionType}">
                    <div class="${sectionType}-content">${content}</div>
                </div>`;
        }
    }

    /**
     * Process sections
     */
    processSections(content) {
        const sectionCommands = [
            { command: 'section', level: 1, tag: 'h2' },
            { command: 'subsection', level: 2, tag: 'h3' },
            { command: 'subsubsection', level: 3, tag: 'h4' }
        ];

        let processedContent = content;

        sectionCommands.forEach(({ command, level, tag }) => {
            const pattern = new RegExp(`\\\\${command}\\{([^}]+)\\}`, 'g');
            processedContent = processedContent.replace(pattern, (match, title) => {
                const sectionId = `section-${level}-${title.toLowerCase().replace(/\\s+/g, '-')}`;
                return `<${tag} id="${sectionId}" class="${command}">${title}</${tag}>\\n`;
            });
        });

        return processedContent;
    }

    /**
     * Process code blocks with portfolio styling
     */
    processCodeBlocks(content) {
        // Process minted code blocks
        content = content.replace(/\\begin\{minted\}\{([^}]+)\}([\s\S]*?)\\end\{minted\}/g, (match, lang, code) => {
            return this.generateCodeBlock(lang.trim(), code.trim());
        });
        
        // Process lstlisting code blocks
        content = content.replace(/\\begin\{lstlisting\}\[language=([^\]]+)\]([\s\S]*?)\\end\{lstlisting\}/g, (match, lang, code) => {
            return this.generateCodeBlock(lang.trim(), code.trim());
        });
        
        // Process custom code blocks
        content = content.replace(/\\begin\{code\}([\s\S]*?)\\end\{code\}/g, (match, codeContent) => {
            return this.processCustomCodeBlock(codeContent);
        });
        
        return content;
    }

    /**
     * Generate code block with portfolio styling
     */
    generateCodeBlock(language, code) {
        return `<div class="portfolio-code-block">
            <div class="code-header">
                <span class="language-indicator">${language}</span>
                <button class="copy-button" onclick="copyCode(this)">Copy</button>
            </div>
            <pre><code class="language-${language}">${this.escapeHtml(code)}</code></pre>
        </div>`;
    }

    /**
     * Process custom code blocks
     */
    processCustomCodeBlock(content) {
        const lines = content.trim().split('\\n');
        const language = this.detectLanguage(lines);
        const cleanCode = lines.filter(line => !line.trim().startsWith('{')).join('\\n');
        
        return this.generateCodeBlock(language, cleanCode);
    }

    /**
     * Detect programming language from code content
     */
    detectLanguage(lines) {
        const code = lines.join(' ').toLowerCase();
        
        if (code.includes('def ') || code.includes('import ')) return 'python';
        if (code.includes('function ') || code.includes('const ')) return 'javascript';
        if (code.includes('public class ') || code.includes('import java.')) return 'java';
        if (code.includes('#include') || code.includes('int main')) return 'cpp';
        if (code.includes('<!DOCTYPE') || code.includes('<html>')) return 'html';
        if (code.includes('\\{') && code.includes('\\}:')) return 'css';
        if (code.includes('SELECT') || code.includes('FROM')) return 'sql';
        
        return 'text';
    }

    /**
     * Escape HTML entities
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Wrap content in layout structure
     */
    wrapInLayoutStructure(content) {
        let layoutHTML = '<div class="portfolio-container">\n';
        
        // Add navbar
        if (this.layoutComponents.navbar) {
            layoutHTML += this.renderNavbar();
        }
        
        layoutHTML += '<div class="portfolio-main">\n';
        
        // Add left sidebar
        if (this.layoutComponents.leftside) {
            layoutHTML += this.renderLeftSidebar();
        }
        
        // Add main content
        layoutHTML += '<div class="portfolio-content">\n';
        layoutHTML += content;
        layoutHTML += '</div>\\n'; // End portfolio-content
        
        // Add right sidebar
        if (this.layoutComponents.rightside) {
            layoutHTML += this.renderRightSidebar();
        }
        
        layoutHTML += '</div>\\n'; // End portfolio-main
        
        // Add footer
        if (this.layoutComponents.footer) {
            layoutHTML += this.renderFooter();
        }
        
        layoutHTML += '</div>\\n'; // End portfolio-container
        
        return layoutHTML;
    }

    /**
     * Render navbar component
     */
    renderNavbar() {
        const navbar = this.layoutComponents.navbar;
        const navbarItems = this.parseNavbarItems(navbar.content);
        
        let navbarHTML = `<nav class="portfolio-navbar" style="${this.generateComponentStyles(navbar.options)}">\\n`;
        navbarHTML += '<div class="navbar-brand">' + this.metadata.title + '</div>\\n';
        navbarHTML += '<ul class="navbar-menu">\\n';
        
        navbarItems.forEach(item => {
            navbarHTML += `<li class="navbar-item">
                <a href="${item.link}" class="navbar-link">${item.text}</a>
            </li>\\n`;
        });
        
        navbarHTML += '</ul>\\n</nav>\\n';
        
        return navbarHTML;
    }

    /**
     * Parse navbar items from content
     */
    parseNavbarItems(content) {
        const items = content.split('|').map(item => item.trim());
        return items.map(item => {
            const match = item.match(/^([^{}]+)\{([^}]+)\}$/);
            if (match) {
                return { text: match[1], link: match[2] };
            }
            return { text: item, link: '#' + item.toLowerCase().replace(/\\s+/g, '-') };
        });
    }

    /**
     * Render left sidebar component
     */
    renderLeftSidebar() {
        const leftside = this.layoutComponents.leftside;
        
        return `<aside class="portfolio-left-sidebar" style="${this.generateComponentStyles(leftside.options)}">
            <div class="sidebar-content">
                ${this.processLayoutContent(leftside.content)}
            </div>
        </aside>\\n`;
    }

    /**
     * Render right sidebar component
     */
    renderRightSidebar() {
        const rightside = this.layoutComponents.rightside;
        
        return `<aside class="portfolio-right-sidebar" style="${this.generateComponentStyles(rightside.options)}">
            <div class="sidebar-content">
                ${this.processLayoutContent(rightside.content)}
            </div>
        </aside>\\n`;
    }

    /**
     * Render footer component
     */
    renderFooter() {
        const footer = this.layoutComponents.footer;
        
        return `<footer class="portfolio-footer" style="${this.generateComponentStyles(footer.options)}">
            <div class="footer-content">
                ${this.processLayoutContent(footer.content)}
            </div>
        </footer>\\n`;
    }

    /**
     * Process layout content (handle special layout commands)
     */
    processLayoutContent(content) {
        // Process table of contents
        if (content.includes('Table of contents') || content.includes('table of contents')) {
            return this.generateTableOfContents();
        }
        
        // Process recent posts
        if (content.includes('Recent Posts') || content.includes('recent posts')) {
            return this.generateRecentPosts();
        }
        
        // Process contact information
        if (content.includes('Contact') || content.includes('contact')) {
            return this.generateContactInfo();
        }
        
        // Process image inclusion
        content = this.processLayoutImages(content);
        
        // Process lists in sidebars
        content = this.processSidebarLists(content);
        
        return content;
    }

    /**
     * Generate table of contents
     */
    generateTableOfContents() {
        const sections = this.content.match(/\\section\{([^}]+)\}/g) || [];
        
        let tocHTML = '<div class="table-of-contents">\\n';
        tocHTML += '<h3>Table of Contents</h3>\\n';
        tocHTML += '<ul class="toc-list">\\n';
        
        sections.forEach(section => {
            const title = section.match(/\\section\{([^}]+)\}/)[1];
            const id = `section-1-${title.toLowerCase().replace(/\\s+/g, '-')}`;
            tocHTML += `<li class="toc-item">
                <a href="#${id}" class="toc-link">${title}</a>
            </li>\\n`;
        });
        
        tocHTML += '</ul>\\n</div>\\n';
        
        return tocHTML;
    }

    /**
     * Generate recent posts list
     */
    generateRecentPosts() {
        const blogPosts = this.content.match(/\\blog\{([^}]+)\}/g) || [];
        
        let postsHTML = '<div class="recent-posts">\\n';
        postsHTML += '<h3>Recent Posts</h3>\\n';
        postsHTML += '<ul class="posts-list">\\n';
        
        blogPosts.slice(0, 5).forEach((post, index) => {
            const title = post.match(/\\blog\{([^}]+)\}/)[1];
            const postId = `blog-${index}`;
            postsHTML += `<li class="post-item">
                <a href="#${postId}" class="post-link">${title}</a>
            </li>\\n`;
        });
        
        postsHTML += '</ul>\\n</div>\\n';
        
        return postsHTML;
    }

    /**
     * Generate contact information
     */
    generateContactInfo() {
        return `<div class="contact-info">
            <h3>Contact Information</h3>
            <div class="contact-details">
                <p><strong>Email:</strong> ${this.metadata.author || 'contact@example.com'}</p>
                <p><strong>Location:</strong> Available for remote work</p>
                <div class="social-links">
                    <a href="#" class="social-link">LinkedIn</a>
                    <a href="#" class="social-link">GitHub</a>
                    <a href="#" class="social-link">Twitter</a>
                </div>
            </div>
        </div>`;
    }

    /**
     * Process layout images with shape and style options
     */
    processLayoutImages(content) {
        // Process \image{src}[shape:round|square, size:small|medium|large, resize:true|false]
        const imagePattern = /\\image\{([^}]+)\}(?:\[([^\]]+)\])?/g;
        
        return content.replace(imagePattern, (match, src, options) => {
            const imageOptions = this.parseImageOptions(options);
            return this.generateLayoutImage(src, imageOptions);
        });
    }

    /**
     * Parse image options for layout components
     */
    parseImageOptions(optionsString) {
        if (!optionsString) return { shape: 'square', size: 'medium', resize: false };
        
        const options = { shape: 'square', size: 'medium', resize: false };
        const pairs = optionsString.split(',').map(s => s.trim());
        
        pairs.forEach(pair => {
            const [key, value] = pair.split(':').map(s => s.trim());
            if (key && value) {
                if (key === 'resize') {
                    options[key] = value.toLowerCase() === 'true';
                } else {
                    options[key] = value;
                }
            }
        });
        
        return options;
    }

    /**
     * Generate layout image with styling
     */
    generateLayoutImage(src, options) {
        const sizeClasses = {
            small: 'img-small',
            medium: 'img-medium', 
            large: 'img-large'
        };
        
        const shapeClasses = {
            round: 'img-round',
            square: 'img-square',
            circle: 'img-circle'
        };
        
        const sizeClass = sizeClasses[options.size] || 'img-medium';
        const shapeClass = shapeClasses[options.shape] || 'img-square';
        const resizeClass = options.resize ? 'img-resizable' : '';
        
        return `<img src="${src}" alt="Portfolio image" class="layout-image ${sizeClass} ${shapeClass} ${resizeClass}" />`;
    }

    /**
     * Process sidebar lists with custom styling
     */
    processSidebarLists(content) {
        // Process \sidebarlist{item1, item2, item3}[style:bullets|numbers]
        const listPattern = /\\sidebarlist\{([^}]+)\}(?:\[([^\]]+)\])?/g;
        
        return content.replace(listPattern, (match, itemsString, options) => {
            const items = itemsString.split(',').map(item => item.trim());
            const listOptions = this.parseListOptions(options);
            return this.generateSidebarList(items, listOptions);
        });
    }

    /**
     * Parse list options for sidebars
     */
    parseListOptions(optionsString) {
        if (!optionsString) return { style: 'bullets' };
        
        const options = { style: 'bullets' };
        const pairs = optionsString.split(',').map(s => s.trim());
        
        pairs.forEach(pair => {
            const [key, value] = pair.split(':').map(s => s.trim());
            if (key && value) {
                options[key] = value;
            }
        });
        
        return options;
    }

    /**
     * Generate sidebar list with styling
     */
    generateSidebarList(items, options) {
        const listClass = options.style === 'numbers' ? 'sidebar-list-ordered' : 'sidebar-list-unordered';
        const tag = options.style === 'numbers' ? 'ol' : 'ul';
        
        const listItems = items.map(item => {
            // Check if item is a link
            const linkMatch = item.match(/^(.+)\{(.+)\}$/);
            if (linkMatch) {
                return `<li><a href="#${linkMatch[2]}" class="sidebar-link">${linkMatch[1]}</a></li>`;
            }
            return `<li>${item}</li>`;
        }).join('\n');
        
        return `<div class="sidebar-list-container">
            <${tag} class="sidebar-list ${listClass}">
                ${listItems}
            </${tag}>
        </div>`;
    }

    /**
     * Generate component styles from options
     */
    generateComponentStyles(options) {
        const styles = [];
        
        if (options['bg-color']) {
            styles.push(`background-color: ${options['bg-color']}`);
        }
        
        if (options['background-color']) {
            styles.push(`background-color: ${options['background-color']}`);
        }
        
        if (options['text-color']) {
            styles.push(`color: ${options['text-color']}`);
        }
        
        if (options.width) {
            styles.push(`width: ${options.width}`);
        }
        
        if (options.height) {
            styles.push(`height: ${options.height}`);
        }
        
        if (options.shadow === true || options.shadow === 'true') {
            styles.push('box-shadow: 0 4px 20px rgba(0,0,0,0.15)');
        } else if (options.shadow !== false) {
            styles.push('box-shadow: 0 2px 10px rgba(0,0,0,0.1)');
        }
        
        return styles.join('; ');
    }

    /**
     * Render portfolio-specific commands
     */
    renderCommand(command, args) {
        const sectionCommands = {
            'section': 'h2',
            'subsection': 'h3',
            'subsubsection': 'h4'
        };

        if (sectionCommands[command]) {
            const tag = sectionCommands[command];
            const sectionId = `section-${command}-${args.toLowerCase().replace(/\\s+/g, '-')}`;
            return `<${tag} id="${sectionId}" class="${command}">${args}</${tag}>`;
        }

        return super.renderCommand(command, args);
    }

    /**
     * Process list environments
     */
    processListEnvironment(content, listType) {
        const items = content.split('\\item').filter(item => item.trim());
        
        const listItems = items.map(item => {
            const trimmedItem = item.trim();
            if (trimmedItem) {
                return `<li>${trimmedItem}</li>`;
            }
            return '';
        }).filter(item => item);

        return `<${listType} class="portfolio-list portfolio-list-${listType}">
            ${listItems.join('\\n')}
        </${listType}>`;
    }

    /**
     * Process paragraphs
     */
    processParagraphs(content) {
        const paragraphs = content.split(/\\n\\s*\\n/).filter(p => p.trim());
        
        return paragraphs.map(paragraph => {
            const trimmed = paragraph.trim();
            
            if (trimmed.startsWith('<h') || trimmed.startsWith('<div class="')) {
                return trimmed;
            }
            
            if (!trimmed.includes('<') && !trimmed.includes('\\\\')) {
                return `<p class="portfolio-paragraph">${trimmed}</p>`;
            }
            
            return trimmed;
        }).join('\\n\\n');
    }
}

module.exports = PortfolioRenderer;