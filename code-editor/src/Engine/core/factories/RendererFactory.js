/**
 * Enhanced Renderer Factory
 * Creates appropriate renderers based on document class
 * Supports modular renderer architecture
 */

const BaseDocumentRenderer = require('../renderers/BaseDocumentRenderer');
const BookDocumentRenderer = require('../renderers/BookDocumentRenderer');

// Import themes
const BaseTheme = require('../themes/BaseTheme');
const BookTheme = require('../themes/BookTheme');

class RendererFactory {
    constructor() {
        this.renderers = new Map();
        this.themes = new Map();
        
        // Register built-in renderers
        this.registerBuiltInRenderers();
        
        // Register built-in themes
        this.registerBuiltInThemes();
    }

    /**
     * Register built-in renderers
     */
    registerBuiltInRenderers() {
        this.registerRenderer('book', BookDocumentRenderer);
        this.registerRenderer('article', require('../renderers/ArticleDocumentRenderer'));
        this.registerRenderer('report', require('../renderers/ReportDocumentRenderer'));
        this.registerRenderer('memoir', require('../renderers/MemoirDocumentRenderer'));
        this.registerRenderer('ieeetran', require('../renderers/IEEEDocumentRenderer'));
        this.registerRenderer('portfolio', require('../renderers/PortfolioDocumentRenderer'));
    }

    /**
     * Register built-in themes
     */
    registerBuiltInThemes() {
        this.registerTheme('base', BaseTheme);
        this.registerTheme('book', BookTheme);
        this.registerTheme('default', require('../themes/DefaultTheme'));
        this.registerTheme('portfolio', require('../themes/PortfolioTheme'));
    }

    /**
     * Register a renderer class
     */
    registerRenderer(documentClass, rendererClass) {
        this.renderers.set(documentClass.toLowerCase(), rendererClass);
        return this;
    }

    /**
     * Register a theme class
     */
    registerTheme(themeName, themeClass) {
        this.themes.set(themeName.toLowerCase(), themeClass);
        return this;
    }

    /**
     * Get renderer for document class
     */
    getRenderer(documentClass) {
        const normalizedClass = documentClass.toLowerCase();
        
        if (!this.renderers.has(normalizedClass)) {
            throw new Error(`Unsupported document class: ${documentClass}`);
        }
        
        const RendererClass = this.renderers.get(normalizedClass);
        return new RendererClass();
    }

    /**
     * Get theme by name
     */
    getTheme(themeName) {
        const normalizedTheme = themeName.toLowerCase();
        
        if (!this.themes.has(normalizedTheme)) {
            throw new Error(`Unsupported theme: ${themeName}`);
        }
        
        const ThemeClass = this.themes.get(normalizedTheme);
        return new ThemeClass();
    }

    /**
     * Create renderer with theme
     */
    createRenderer(latexContent) {
        const documentClass = this.extractDocumentClass(latexContent);
        const renderer = this.getRenderer(documentClass);
        const theme = this.selectTheme(documentClass);
        
        renderer.setTheme(theme);
        return {
            renderer,
            documentClass,
            theme,
            options: this.parseDocumentClassOptions(latexContent)
        };
    }

    /**
     * Extract document class from LaTeX content
     */
    extractDocumentClass(content) {
        const classMatch = content.match(/\\documentclass(?:\[[^\]]*\])?\{([^}]+)\}/);
        if (!classMatch) {
            throw new Error('No document class found in LaTeX content');
        }
        
        return classMatch[1].trim();
    }

    /**
     * Parse document class options
     */
    parseDocumentClassOptions(content) {
        const optionsMatch = content.match(/\\documentclass\[([^\]]+)\]\{[^}]+\}/);
        if (!optionsMatch) {
            return {};
        }
        
        const optionsText = optionsMatch[1];
        const options = {};
        
        // Parse individual options
        optionsText.split(',').forEach(option => {
            const trimmed = option.trim();
            
            // Handle key=value options
            if (trimmed.includes('=')) {
                const [key, value] = trimmed.split('=').map(s => s.trim());
                options[key] = value;
            } else {
                // Handle boolean flags
                options[trimmed] = true;
            }
        });
        
        return options;
    }

    /**
     * Select appropriate theme based on document class
     */
    selectTheme(documentClass) {
        const normalizedClass = documentClass.toLowerCase();
        
        switch (normalizedClass) {
            case 'book':
                return this.getTheme('book');
            case 'portfolio':
                return this.getTheme('portfolio');
            case 'article':
            case 'report':
            case 'ieeetran':
            case 'memoir':
            default:
                return this.getTheme('default');
        }
    }

    /**
     * Validate LaTeX document structure
     */
    validateDocument(content) {
        const errors = [];
        const warnings = [];
        
        // Check for document class
        if (!content.includes('\\documentclass')) {
            errors.push('Missing \\documentclass declaration');
        }
        
        // Check for begin/end document
        if (!content.includes('\\begin{document}')) {
            errors.push('Missing \\begin{document}');
        }
        
        if (!content.includes('\\end{document}')) {
            errors.push('Missing \\end{document}');
        }
        
        // Check for document class validity
        const documentClass = this.extractDocumentClass(content);
        if (!this.renderers.has(documentClass.toLowerCase())) {
            warnings.push(`Document class '${documentClass}' may not be fully supported`);
        }
        
        // Check for basic structure
        const documentMatch = content.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/);
        if (documentMatch) {
            const documentBody = documentMatch[1].trim();
            
            if (documentBody.length === 0) {
                warnings.push('Document body appears to be empty');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            documentClass
        };
    }

    /**
     * Get supported document classes
     */
    getSupportedClasses() {
        return Array.from(this.renderers.keys());
    }

    /**
     * Get supported themes
     */
    getSupportedThemes() {
        return Array.from(this.themes.keys());
    }

    /**
     * Get renderer information
     */
    getRendererInfo() {
        const info = {};
        
        this.renderers.forEach((RendererClass, documentClass) => {
            const renderer = new RendererClass();
            info[documentClass] = {
                displayName: renderer.displayName,
                supportedCommands: renderer.getSupportedCommands ? renderer.getSupportedCommands() : [],
                metadata: renderer.getInfo ? renderer.getInfo() : {}
            };
        });
        
        return info;
    }

    /**
     * Get theme information
     */
    getThemeInfo() {
        const info = {};
        
        this.themes.forEach((ThemeClass, themeName) => {
            const theme = new ThemeClass();
            info[themeName] = {
                displayName: theme.displayName,
                description: theme.description || ''
            };
        });
        
        return info;
    }

    /**
     * Get statistics
     */
    getStatistics() {
        return {
            totalRenderers: this.renderers.size,
            totalThemes: this.themes.size,
            supportedClasses: this.getSupportedClasses(),
            supportedThemes: this.getSupportedThemes(),
            rendererDetails: this.getRendererInfo(),
            themeDetails: this.getThemeInfo()
        };
    }

    /**
     * Create renderer for specific class with custom options
     */
    createCustomRenderer(documentClass, options = {}) {
        const renderer = this.getRenderer(documentClass);
        
        // Apply custom options
        if (options.theme) {
            const theme = this.getTheme(options.theme);
            renderer.setTheme(theme);
        }
        
        if (options.options) {
            renderer.setOptions(options.options);
        }
        
        return renderer;
    }

    /**
     * Auto-detect document class from filename
     */
    detectDocumentClassFromFilename(filename) {
        const basename = filename.toLowerCase();
        
        // Simple heuristic based on filename
        if (basename.includes('book') || basename.includes('thesis') || basename.includes('dissertation')) {
            return 'book';
        }
        if (basename.includes('article') || basename.includes('paper')) {
            return 'article';
        }
        if (basename.includes('portfolio') || basename.includes('cv')) {
            return 'portfolio';
        }
        if (basename.includes('report')) {
            return 'report';
        }
        if (basename.includes('ieee')) {
            return 'ieeetran';
        }
        if (basename.includes('memoir')) {
            return 'memoir';
        }
        
        return 'article'; // Default
    }

    /**
     * Preview document structure without full conversion
     */
    previewStructure(latexContent) {
        const documentClass = this.extractDocumentClass(latexContent);
        const options = this.parseDocumentClassOptions(latexContent);
        
        // Extract sections
        const sections = [];
        const sectionMatches = latexContent.match(/\\(part|chapter|section|subsection|subsubsection)\{([^}]+)\}/g) || [];
        
        sectionMatches.forEach(match => {
            const sectionMatch = match.match(/\\(\\w+)\{([^}]+)\}/);
            if (sectionMatch) {
                sections.push({
                    type: sectionMatch[1],
                    title: sectionMatch[2],
                    level: this.getSectionLevel(sectionMatch[1])
                });
            }
        });
        
        // Extract figures and tables
        const figures = (latexContent.match(/\\begin\{figure\}/g) || []).length;
        const tables = (latexContent.match(/\\begin\{table\}/g) || []).length;
        
        // Check for special elements
        const hasAbstract = latexContent.includes('\\begin{abstract}');
        const hasBibliography = latexContent.includes('\\bibliography');
        const hasTableOfContents = latexContent.includes('\\tableofcontents');
        
        return {
            documentClass,
            options,
            structure: {
                sections,
                figures,
                tables,
                hasAbstract,
                hasBibliography,
                hasTableOfContents
            }
        };
    }

    /**
     * Get section level for hierarchy
     */
    getSectionLevel(sectionType) {
        const levels = {
            'part': 0,
            'chapter': 1,
            'section': 2,
            'subsection': 3,
            'subsubsection': 4
        };
        
        return levels[sectionType] || 5;
    }

    /**
     * Load external renderer plugins
     */
    loadRendererPlugin(pluginPath) {
        try {
            const plugin = require(pluginPath);
            
            if (plugin.renderers) {
                Object.entries(plugin.renderers).forEach(([name, rendererClass]) => {
                    this.registerRenderer(name, rendererClass);
                });
            }
            
            if (plugin.themes) {
                Object.entries(plugin.themes).forEach(([name, themeClass]) => {
                    this.registerTheme(name, themeClass);
                });
            }
            
            return true;
        } catch (error) {
            console.error(`Failed to load plugin from ${pluginPath}:`, error);
            return false;
        }
    }
}

module.exports = RendererFactory;