/**
 * Renderer Factory
 * Manages and provides access to all document renderers
 */

class RendererFactory {
    constructor() {
        this.renderers = new Map();
        this.initializeRenderers();
    }

    /**
     * Initialize all available renderers
     */
    initializeRenderers() {
        // Import all renderer classes
        const ArticleRenderer = require('./ArticleRenderer');
        const ReportRenderer = require('./ReportRenderer');
        const BookRenderer = require('./BookRenderer');
        const IEEETRANRenderer = require('./IEEETRANRenderer');
        const PortfolioRenderer = require('./PortfolioRenderer');

        // Register renderers
        this.registerRenderer('article', ArticleRenderer);
        this.registerRenderer('report', ReportRenderer);
        this.registerRenderer('book', BookRenderer);
        this.registerRenderer('IEEEtran', IEEETRANRenderer);
        this.registerRenderer('memoir', BookRenderer); // Use Book renderer as fallback for memoir
        this.registerRenderer('portfolio', PortfolioRenderer);
    }

    /**
     * Register a renderer class
     */
    registerRenderer(documentClass, rendererClass) {
        this.renderers.set(documentClass.toLowerCase(), rendererClass);
        return this;
    }

    /**
     * Get renderer for document class
     */
    getRenderer(documentClass) {
        const normalizedClass = documentClass.toLowerCase();
        
        if (!this.renderers.has(normalizedClass)) {
            throw new Error(`Unsupported document class: ${documentClass}. Supported classes: ${this.getSupportedClasses().join(', ')}`);
        }

        const RendererClass = this.renderers.get(normalizedClass);
        return new RendererClass();
    }

    /**
     * Get all supported document classes
     */
    getSupportedClasses() {
        return Array.from(this.renderers.keys());
    }

    /**
     * Check if document class is supported
     */
    isSupported(documentClass) {
        return this.renderers.has(documentClass.toLowerCase());
    }

    /**
     * Get renderer information for all renderers
     */
    getAllRendererInfo() {
        const info = {};
        
        for (const [documentClass, RendererClass] of this.renderers) {
            const renderer = new RendererClass();
            info[documentClass] = {
                name: renderer.name,
                displayName: renderer.displayName,
                supportedCommands: renderer.getSupportedCommands()
            };
        }
        
        return info;
    }

    /**
     * Extract document class from LaTeX content
     */
    extractDocumentClass(latexContent) {
        const documentClassMatch = latexContent.match(/\\documentclass(\[.*?\])?\{([^}]+)\}/);
        
        if (!documentClassMatch) {
            throw new Error('No \\documentclass command found in LaTeX content');
        }

        return documentClassMatch[2].trim();
    }

    /**
     * Parse document class options
     */
    parseDocumentClassOptions(latexContent) {
        const documentClassMatch = latexContent.match(/\\documentclass\[(.*?)\]\{[^}]+\}/);
        
        if (!documentClassMatch) {
            return {};
        }

        const optionsString = documentClassMatch[1];
        const options = {};
        
        // Parse options like "12pt,a4paper,twocolumn"
        const optionList = optionsString.split(',').map(opt => opt.trim());
        
        optionList.forEach(option => {
            // Handle key=value options
            const keyValueMatch = option.match(/^([^=]+)=(.+)$/);
            if (keyValueMatch) {
                options[keyValueMatch[1]] = keyValueMatch[2];
            } else {
                // Handle boolean options
                options[option] = true;
            }
        });
        
        return options;
    }

    /**
     * Create renderer with automatic document class detection
     */
    createRenderer(latexContent) {
        const documentClass = this.extractDocumentClass(latexContent);
        const options = this.parseDocumentClassOptions(latexContent);
        
        const renderer = this.getRenderer(documentClass);
        
        // Apply options to renderer
        this.applyRendererOptions(renderer, options);
        
        return {
            renderer,
            documentClass,
            options
        };
    }

    /**
     * Apply document class options to renderer
     */
    applyRendererOptions(renderer, options) {
        // Apply common options
        if (options.fontsize) {
            renderer.setOption('fontsize', options.fontsize);
        }
        
        if (options.papersize) {
            renderer.setOption('papersize', options.papersize);
        }
        
        if (options.twocolumn) {
            renderer.setOption('twocolumn', true);
        }
        
        if (options.twoside) {
            renderer.setOption('twoside', true);
        }
        
        if (options.draft) {
            renderer.setOption('draft', true);
        }
        
        // Apply class-specific options
        this.applyClassSpecificOptions(renderer, options);
    }

    /**
     * Apply class-specific options
     */
    applyClassSpecificOptions(renderer, options) {
        switch (renderer.name) {
            case 'IEEEtran':
                this.applyIEEEtranOptions(renderer, options);
                break;
            case 'book':
            case 'report':
                this.applyBookReportOptions(renderer, options);
                break;
            case 'portfolio':
                this.applyPortfolioOptions(renderer, options);
                break;
        }
    }

    /**
     * Apply IEEEtran-specific options
     */
    applyIEEEtranOptions(renderer, options) {
        if (options.journal) {
            renderer.setOption('journal', options.journal);
        }
        
        if (options.compsoc) {
            renderer.setOption('compsoc', true);
        }
        
        if (options.techreport) {
            renderer.setOption('techreport', true);
        }
        
        if (options.conference) {
            renderer.setOption('conference', true);
        }
    }

    /**
     * Apply Book/Report-specific options
     */
    applyBookReportOptions(renderer, options) {
        if (options.openright) {
            renderer.setOption('openright', true);
        }
        
        if (options.openany) {
            renderer.setOption('openany', true);
        }
        
        if (options.oneside) {
            renderer.setOption('oneside', true);
        }
        
        if (options.twoside) {
            renderer.setOption('twoside', true);
        }
    }

    /**
     * Apply Portfolio-specific options
     */
    applyPortfolioOptions(renderer, options) {
        if (options.theme) {
            renderer.setOption('theme', options.theme);
        }
        
        if (options.layout) {
            renderer.setOption('layout', options.layout);
        }
        
        if (options.responsive) {
            renderer.setOption('responsive', true);
        }
    }

    /**
     * Validate document structure before rendering
     */
    validateDocument(latexContent) {
        const errors = [];
        
        // Check for document class
        if (!latexContent.includes('\\documentclass')) {
            errors.push('Missing \\documentclass command');
        }
        
        // Check for begin/end document
        if (!latexContent.includes('\\begin{document}')) {
            errors.push('Missing \\begin{document} command');
        }
        
        if (!latexContent.includes('\\end{document}')) {
            errors.push('Missing \\end{document} command');
        }
        
        // Check for matched environments
        const beginMatches = latexContent.match(/\\begin\{([^}]+)\}/g) || [];
        const endMatches = latexContent.match(/\\end\{([^}]+)\}/g) || [];
        
        const beginEnvs = beginMatches.map(match => match.match(/\\begin\{([^}]+)\}/)[1]);
        const endEnvs = endMatches.map(match => match.match(/\\end\{([^}]+)\}/)[1]);
        
        beginEnvs.forEach(env => {
            const beginCount = beginEnvs.filter(e => e === env).length;
            const endCount = endEnvs.filter(e => e === env).length;
            
            if (beginCount !== endCount) {
                errors.push(`Mismatched \\begin{${env}} and \\end{${env}} commands`);
            }
        });
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Get statistics about available renderers
     */
    getStatistics() {
        const stats = {
            totalRenderers: this.renderers.size,
            supportedClasses: this.getSupportedClasses(),
            rendererDetails: this.getAllRendererInfo()
        };
        
        return stats;
    }
}

module.exports = RendererFactory;