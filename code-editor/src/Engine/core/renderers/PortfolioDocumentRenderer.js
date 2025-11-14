/**
 * Portfolio Document Renderer
 * Placeholder renderer for LaTeX portfolio documents
 */

const BaseDocumentRenderer = require('./BaseDocumentRenderer');

class PortfolioDocumentRenderer extends BaseDocumentRenderer {
    constructor() {
        super();
        this.name = 'portfolio';
        this.displayName = 'Portfolio Document Renderer';
        
        // Initialize portfolio-specific commands
        this.initializePortfolioCommands();
    }

    /**
     * Initialize portfolio-specific LaTeX commands
     */
    initializePortfolioCommands() {
        const portfolioCommands = [
            // Portfolio-specific commands
            'navlogo', 'nabbar', 'sidebar', 'profileimage',
            
            // Standard LaTeX commands
            'title', 'author', 'date', 'maketitle',
            'section', 'subsection', 'subsubsection',
            'textbf', 'textit', 'texttt', 'emph', 'underline',
            'begin', 'end', 'item', 'caption', 'label',
            'ref', 'cite', 'includegraphics'
        ];

        portfolioCommands.forEach(cmd => this.addSupportedCommand(cmd));
    }

    parseDocument() {
        this.validateDocument();
        
        // Extract document body
        const documentMatch = this.content.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/);
        if (!documentMatch) {
            throw new Error('Invalid portfolio document: missing begin/end document');
        }

        let processedContent = documentMatch[1];
        
        // Process portfolio-specific commands
        processedContent = this.processPortfolioCommands(processedContent);
        
        // Process standard LaTeX using common components
        processedContent = this.processStandardCommands(processedContent);
        processedContent = this.processEnvironments(processedContent);
        
        return `<div class="portfolio">
            ${this.processTitleSection(processedContent)}
        </div>`;
    }

    /**
     * Process portfolio-specific commands
     */
    processPortfolioCommands(content) {
        let processed = content;
        
        // Process \maketitle
        processed = processed.replace(/\\maketitle/g, () => {
            return `<header class="portfolio-header">
                <h1 class="portfolio-title">${this.metadata.title}</h1>
                <p class="portfolio-subtitle">${this.metadata.author}</p>
                <p class="portfolio-date">${this.metadata.date}</p>
            </header>`;
        });
        
        // Process \navlogo
        processed = processed.replace(/\\navlogo\{([^}]+)\}/g, '<div class="nav-logo"><img src="$1" alt="Logo" /></div>');
        
        // Process \nabbar
        processed = processed.replace(/\\nabbar\{([^}]+)\}/g, (match, content) => {
            const items = content.split(',').map(item => item.trim());
            const navItems = items.map(item => `<span class="nav-item">${item}</span>`).join('');
            return `<nav class="portfolio-nav">${navItems}</nav>`;
        });
        
        // Process \sidebar
        processed = processed.replace(/\\sidebar\{([^}]+)\}/g, '<aside class="portfolio-sidebar">$1</aside>');
        
        // Process \profileimage
        processed = processed.replace(/\\profileimage(?:\[([^\]]+)\])?\{([^}]+)\}/g, (match, options, src) => {
            const shape = options ? options.replace(/shape=/, '') : 'default';
            return `<img src="${src}" alt="Profile" class="profile-image shape-${shape}" />`;
        });
        
        return processed;
    }

    /**
     * Process title section
     */
    processTitleSection(content) {
        // Check if maketitle was already processed
        if (content.includes('portfolio-header')) {
            return content;
        }
        
        // If no maketitle, create default header
        const header = `<header class="portfolio-header">
            <h1 class="portfolio-title">${this.metadata.title}</h1>
            <p class="portfolio-subtitle">${this.metadata.author}</p>
            <p class="portfolio-date">${this.metadata.date}</p>
        </header>`;
        
        return header + content;
    }

    /**
     * Process standard LaTeX commands (using common components)
     */
    processStandardCommands(content) {
        // Use common components for standard LaTeX processing
        return super.processStandardCommands(content);
    }

    /**
     * Process LaTeX environments (using common components)
     */
    processEnvironments(content) {
        // Use common components for environment processing
        return super.processEnvironments(content);
    }
}

module.exports = PortfolioDocumentRenderer;