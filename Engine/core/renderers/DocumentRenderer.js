/**
 * Base Document Renderer Class
 * Provides foundation for all document class renderers
 */

const CodeParser = require('../parsers/CodeParser');
const MathParser = require('../parsers/MathParser');

class DocumentRenderer {
    constructor() {
        this.name = 'base';
        this.displayName = 'Base Renderer';
        this.supportedCommands = new Set();
        this.metadata = {};
        this.content = '';
        this.theme = null;
        this.codeParser = new CodeParser();
        this.mathParser = new MathParser();
    }

    /**
     * Set theme for this renderer
     */
    setTheme(theme) {
        this.theme = theme;
        return this;
    }

    /**
     * Initialize renderer with document content
     */
    initialize(content) {
        this.content = content;
        this.extractMetadata();
        return this;
    }

    /**
     * Extract basic metadata from document
     */
    extractMetadata() {
        const titleMatch = this.content.match(/\\title\{([^}]+)\}/);
        const authorMatch = this.content.match(/\\author\{([^}]+)\}/);
        const dateMatch = this.content.match(/\\date\{([^}]+)\}/);

        this.metadata = {
            title: titleMatch ? titleMatch[1] : 'Untitled Document',
            author: authorMatch ? authorMatch[1] : '',
            date: dateMatch ? dateMatch[1] : new Date().toLocaleDateString(),
            documentClass: this.name
        };
    }

    /**
     * Parse document structure
     */
    parseDocument() {
        throw new Error('parseDocument method must be implemented by subclass');
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
                metadata: this.metadata
            },
            metadata: this.metadata
        });
    }

    /**
     * Process LaTeX commands
     */
    processCommands(content) {
        const commands = this.getSupportedCommands();
        let processedContent = content;

        for (const command of commands) {
            processedContent = this.processCommand(processedContent, command);
        }

        return processedContent;
    }

    /**
     * Process individual LaTeX command
     */
    processCommand(content, command) {
        const pattern = new RegExp(`\\\\${command}\\{([^}]+)\\}`, 'g');
        return content.replace(pattern, (match, args) => {
            return this.renderCommand(command, args);
        });
    }

    /**
     * Render individual command - to be overridden by subclasses
     */
    renderCommand(command, args) {
        return `<span class="command-${command}">${args}</span>`;
    }

    /**
     * Get supported commands for this renderer
     */
    getSupportedCommands() {
        return Array.from(this.supportedCommands);
    }

    /**
     * Add supported command
     */
    addSupportedCommand(command) {
        this.supportedCommands.add(command);
        return this;
    }

    /**
     * Validate document structure
     */
    validateDocument() {
        // Basic validation - can be extended by subclasses
        if (!this.content || this.content.trim().length === 0) {
            throw new Error('Document content cannot be empty');
        }

        if (!this.content.includes('\\documentclass')) {
            throw new Error('Document must include \\documentclass command');
        }

        return true;
    }

    /**
     * Clean up content - remove comments and normalize whitespace
     */
    sanitizeContent(content) {
        return content
            .replace(/%.*$/gm, '') // Remove comments
            .replace(/\r\n/g, '\n') // Normalize line endings
            .replace(/\n{3,}/g, '\n\n'); // Reduce excessive blank lines
    }

    /**
     * Process document environment
     */
    processEnvironment(content, envName) {
        const pattern = new RegExp(`\\\\begin\{${envName}\}([\\s\\S]*?)\\\\end\{${envName}\}`, 'g');
        return content.replace(pattern, (match, envContent) => {
            return this.renderEnvironment(envName, envContent);
        });
    }

    /**
     * Process mathematical content in the document
     */
    processMathematics(content) {
        // Process mathematical expressions using MathParser
        return this.mathParser.parse(content, 'document');
    }

    /**
     * Render environment - to be overridden by subclasses
     */
    renderEnvironment(envName, content) {
        // Handle code environment with the CodeParser
        if (envName === 'code') {
            const context = {
                theme: this.theme ? this.theme.name : 'default'
            };
            return this.codeParser.parseCustomCodeBlock(content, context);
        }
        
        // Process mathematical content
        const processedContent = this.processMathematics(content);
        return `<div class="environment-${envName}">${processedContent}</div>`;
    }

    /**
     * Get renderer information
     */
    getRendererInfo() {
        return {
            name: this.name,
            displayName: this.displayName,
            supportedCommands: this.getSupportedCommands(),
            metadata: this.metadata
        };
    }
}

module.exports = DocumentRenderer;