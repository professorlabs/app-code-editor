/**
 * Modular LaTeX to HTML Engine
 * Professional, scalable architecture for document conversion
 */

const fs = require('fs');
const path = require('path');
const RendererFactory = require('./core/renderers/RendererFactory');
const DefaultTheme = require('./core/themes/DefaultTheme');

class LatexEngine {
    constructor() {
        this.rendererFactory = new RendererFactory();
        this.theme = new DefaultTheme();
        this.options = {
            outputDirectory: './',
            minify: false,
            validateDocument: true,
            preserveComments: false
        };
    }

    /**
     * Configure engine options
     */
    configure(options = {}) {
        this.options = { ...this.options, ...options };
        return this;
    }

    /**
     * Set custom theme
     */
    setTheme(theme) {
        if (!theme || typeof theme.generateHTML !== 'function') {
            throw new Error('Theme must be a valid theme object with generateHTML method');
        }
        this.theme = theme;
        return this;
    }

    /**
     * Convert LaTeX file to HTML
     */
    async convertFile(inputPath, outputPath = null) {
        if (!fs.existsSync(inputPath)) {
            throw new Error(`Input file not found: ${inputPath}`);
        }

        const latexContent = fs.readFileSync(inputPath, 'utf8');
        const html = await this.convertContent(latexContent);
        
        // Generate output filename if not provided
        if (!outputPath) {
            const parsedPath = path.parse(inputPath);
            outputPath = path.join(parsedPath.dir, `${parsedPath.name}.html`);
        }

        // Write HTML file
        fs.writeFileSync(outputPath, html);
        
        return {
            success: true,
            outputPath: path.resolve(outputPath),
            inputPath: path.resolve(inputPath),
            documentClass: this.extractDocumentClass(latexContent)
        };
    }

    /**
     * Convert LaTeX content to HTML
     */
    async convertContent(latexContent) {
        try {
            // Validate document if enabled
            if (this.options.validateDocument) {
                const validation = this.rendererFactory.validateDocument(latexContent);
                if (!validation.isValid) {
                    throw new Error(`Document validation failed:\\n${validation.errors.join('\\n')}`);
                }
            }

            // Create appropriate renderer
            const { renderer, documentClass, options } = this.rendererFactory.createRenderer(latexContent);
            
            // Initialize renderer with content
            renderer.initialize(latexContent);
            
            // Set theme
            renderer.setTheme(this.theme);
            
            // Apply custom options
            this.applyEngineOptions(renderer);
            
            // Parse document
            const parsedContent = renderer.parseDocument();
            
            // Generate HTML
            let html = renderer.generateHTML(parsedContent);
            
            // Post-process HTML
            html = this.postProcessHTML(html);
            
            return html;
            
        } catch (error) {
            throw new Error(`Conversion failed: ${error.message}`);
        }
    }

    /**
     * Extract document class from content
     */
    extractDocumentClass(latexContent) {
        return this.rendererFactory.extractDocumentClass(latexContent);
    }

    /**
     * Apply engine-specific options to renderer
     */
    applyEngineOptions(renderer) {
        if (this.options.minify) {
            renderer.setOption('minify', true);
        }
        
        if (this.options.preserveComments) {
            renderer.setOption('preserveComments', true);
        }
    }

    /**
     * Post-process generated HTML
     */
    postProcessHTML(html) {
        if (this.options.minify) {
            // Basic minification
            html = html
                .replace(/\\s+/g, ' ')
                .replace(/>\\s+</g, '><')
                .trim();
        }
        
        return html;
    }

    /**
     * Get supported document classes
     */
    getSupportedDocumentClasses() {
        return this.rendererFactory.getSupportedClasses();
    }

    /**
     * Get renderer factory information
     */
    getRendererInfo() {
        return this.rendererFactory.getAllRendererInfo();
    }

    /**
     * Get engine statistics
     */
    getStatistics() {
        return {
            rendererStats: this.rendererFactory.getStatistics(),
            themeInfo: {
                name: this.theme.name || 'unknown',
                displayName: this.theme.displayName || 'Unknown Theme'
            },
            options: this.options
        };
    }

    /**
     * Validate LaTeX document without converting
     */
    validateDocument(latexContent) {
        return this.rendererFactory.validateDocument(latexContent);
    }

    /**
     * Preview document structure without full conversion
     */
    previewStructure(latexContent) {
        try {
            const documentClass = this.extractDocumentClass(latexContent);
            const options = this.rendererFactory.parseDocumentClassOptions(latexContent);
            
            // Extract sections
            const sections = [];
            const sectionMatches = latexContent.match(/\\\\(section|subsection|subsubsection|chapter|part)\\{([^}]+)\\}/g) || [];
            
            sectionMatches.forEach(match => {
                const sectionMatch = match.match(/\\\\(\\w+)\\{([^}]+)\\}/);
                if (sectionMatch) {
                    sections.push({
                        type: sectionMatch[1],
                        title: sectionMatch[2],
                        level: this.getSectionLevel(sectionMatch[1])
                    });
                }
            });
            
            // Extract figures and tables
            const figures = (latexContent.match(/\\\\begin\{figure\}/g) || []).length;
            const tables = (latexContent.match(/\\\\begin\{table\}/g) || []).length;
            
            return {
                documentClass,
                options,
                structure: {
                    sections,
                    figures,
                    tables,
                    hasAbstract: latexContent.includes('\\\\begin\{abstract\}'),
                    hasBibliography: latexContent.includes('\\\\bibliography'),
                    hasTableOfContents: latexContent.includes('\\\\tableofcontents')
                }
            };
            
        } catch (error) {
            throw new Error(`Preview failed: ${error.message}`);
        }
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
     * Batch convert multiple files
     */
    async convertBatch(filePaths, outputDirectory = null) {
        const results = [];
        
        for (const filePath of filePaths) {
            try {
                const outputPath = outputDirectory ? 
                    path.join(outputDirectory, path.basename(filePath, '.tex') + '.html') :
                    null;
                
                const result = await this.convertFile(filePath, outputPath);
                results.push({ ...result, status: 'success' });
                
            } catch (error) {
                results.push({
                    inputPath: path.resolve(filePath),
                    status: 'error',
                    error: error.message
                });
            }
        }
        
        return results;
    }

    /**
     * Create a new renderer instance
     */
    createRenderer(documentClass) {
        return this.rendererFactory.getRenderer(documentClass);
    }

    /**
     * Register custom renderer
     */
    registerRenderer(documentClass, rendererClass) {
        this.rendererFactory.registerRenderer(documentClass, rendererClass);
        return this;
    }

    /**
     * Set output directory
     */
    setOutputDirectory(directory) {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
        this.options.outputDirectory = directory;
        return this;
    }

    /**
     * Enable/disable document validation
     */
    setValidation(enabled) {
        this.options.validateDocument = Boolean(enabled);
        return this;
    }

    /**
     * Enable/disable minification
     */
    setMinification(enabled) {
        this.options.minify = Boolean(enabled);
        return this;
    }

    /**
     * Export engine configuration
     */
    exportConfiguration() {
        return {
            options: this.options,
            supportedClasses: this.getSupportedDocumentClasses(),
            theme: this.theme.name,
            rendererInfo: this.getRendererInfo()
        };
    }

    /**
     * Import engine configuration
     */
    importConfiguration(config) {
        if (config.options) {
            this.configure(config.options);
        }
        
        if (config.supportedClasses) {
            // Validate supported classes
            const currentClasses = this.getSupportedDocumentClasses();
            const missingClasses = config.supportedClasses.filter(cls => !currentClasses.includes(cls));
            
            if (missingClasses.length > 0) {
                console.warn(`Warning: Missing document classes: ${missingClasses.join(', ')}`);
            }
        }
        
        return this;
    }
}

module.exports = LatexEngine;