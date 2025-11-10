/**
 * Base Document Renderer
 * Foundation for all document class renderers
 * Handles common functionality and provides template methods
 */

const CommonComponents = require('../components/CommonComponents');

class BaseDocumentRenderer {
    constructor() {
        this.name = 'base';
        this.displayName = 'Base Document Renderer';
        this.supportedCommands = new Set();
        this.metadata = {};
        this.content = '';
        this.theme = null;
        this.options = {
            minify: false,
            preserveComments: false,
            debugMode: false
        };
        
        // Initialize common components
        this.commonComponents = new CommonComponents();
        
        this.initializeDefaultCommands();
    }

    /**
     * Initialize default supported commands
     */
    initializeDefaultCommands() {
        const basicCommands = [
            'textbf', 'textit', 'texttt', 'emph', 'underline',
            'section', 'subsection', 'subsubsection',
            'begin', 'end', 'item', 'caption',
            'label', 'ref', 'cite'
        ];

        basicCommands.forEach(cmd => this.addSupportedCommand(cmd));
    }

    /**
     * Add supported command
     */
    addSupportedCommand(command) {
        this.supportedCommands.add(command);
    }

    /**
     * Check if command is supported
     */
    isCommandSupported(command) {
        return this.supportedCommands.has(command);
    }

    /**
     * Get all supported commands
     */
    getSupportedCommands() {
        return Array.from(this.supportedCommands);
    }

    /**
     * Set theme for this renderer
     */
    setTheme(theme) {
        if (!theme || typeof theme.generateHTML !== 'function') {
            throw new Error('Invalid theme: must have generateHTML method');
        }
        this.theme = theme;
        return this;
    }

    /**
     * Set renderer option
     */
    setOption(option, value) {
        this.options[option] = value;
        return this;
    }

    /**
     * Get renderer option
     */
    getOption(option) {
        return this.options[option];
    }

    /**
     * Set multiple options
     */
    setOptions(options) {
        this.options = { ...this.options, ...options };
        return this;
    }

    /**
     * Initialize renderer with content
     */
    initialize(content) {
        this.content = content || '';
        this.extractMetadata();
        return this;
    }

    /**
     * Extract metadata from document
     */
    extractMetadata() {
        const titleMatch = this.content.match(/\\title\{([^}]+)\}/);
        const authorMatch = this.content.match(/\\author\{([^}]+)\}/);
        const dateMatch = this.content.match(/\\date\{([^}]+)\}/);

        this.metadata = {
            title: titleMatch ? titleMatch[1] : 'Untitled Document',
            author: authorMatch ? authorMatch[1] : 'Unknown Author',
            date: dateMatch ? dateMatch[1] : new Date().toLocaleDateString(),
            documentClass: this.name
        };
    }

    /**
     * Validate document structure
     */
    validateDocument() {
        const errors = [];

        if (!this.content.includes('\\begin{document}')) {
            errors.push('Missing \\begin{document}');
        }

        if (!this.content.includes('\\end{document}')) {
            errors.push('Missing \\end{document}');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Parse document - to be implemented by subclasses
     */
    parseDocument() {
        throw new Error('parseDocument must be implemented by subclass');
    }

    /**
     * Generate HTML output
     */
    generateHTML(parsedContent) {
        if (!this.theme) {
            throw new Error('Theme must be set before generating HTML');
        }

        return this.theme.generateHTML({
            html: parsedContent,
            context: {
                documentClass: this.name,
                metadata: this.metadata,
                options: this.options
            },
            metadata: this.metadata
        });
    }

    /**
     * Render command - to be extended by subclasses
     */
    renderCommand(command, args) {
        const commandMap = {
            'textbf': `<strong>${args}</strong>`,
            'textit': `<em>${args}</em>`,
            'texttt': `<code>${args}</code>`,
            'emph': `<em>${args}</em>`,
            'underline': `<u>${args}</em>`
        };

        return commandMap[command] || args;
    }

    /**
     * Render environment - to be extended by subclasses
     */
    renderEnvironment(envName, content) {
        return `<div class="${envName}">${content}</div>`;
    }

    /**
     * Get renderer information
     */
    getInfo() {
        return {
            name: this.name,
            displayName: this.displayName,
            supportedCommands: this.getSupportedCommands().length,
            commonComponents: this.getCommonComponents().length,
            metadata: this.metadata
        };
    }

    /**
     * Get default CSS for common components
     */
    getDefaultCSS() {
        return this.commonComponents.getDefaultCSS();
    }

    /**
     * Process content using common components
     */
    processContent(content, options = {}) {
        return this.commonComponents.processContent(content, options);
    }

    /**
     * Get available common components
     */
    getCommonComponents() {
        return Array.from(this.commonComponents.components.keys());
    }

    /**
     * Use specific common component
     */
    useComponent(name, content, options = {}) {
        const component = this.commonComponents.getComponent(name);
        if (component) {
            return component(content, options);
        }
        return content;
    }

    /**
     * Process standard LaTeX commands using common components
     */
    processStandardCommands(content) {
        return this.processContent(content, {
            // Enable all common components by default
            textbf: true,
            textit: true,
            texttt: true,
            emph: true,
            underline: true,
            section: true,
            subsection: true,
            subsubsection: true,
            itemize: true,
            enumerate: true,
            description: true,
            table: true,
            tabular: true,
            equation: true,
            align: true,
            figure: true,
            verbatim: true,
            ref: true,
            cite: true,
            columns: true,
            minipage: true
        });
    }

    /**
     * Process LaTeX environments using common components
     */
    processEnvironments(content) {
        return this.processContent(content, {
            // Environment processing
            table: true,
            tabular: true,
            longtable: true,
            equation: true,
            align: true,
            gather: true,
            multline: true,
            itemize: true,
            enumerate: true,
            description: true,
            figure: true,
            wrapfigure: true,
            columns: true,
            column: true,
            minipage: true,
            verbatim: true,
            lstlisting: true,
            minted: true
        });
    }
}

module.exports = BaseDocumentRenderer;