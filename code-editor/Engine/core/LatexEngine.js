/**
 * Professional LaTeX to HTML Engine Core
 * Complete LaTeX feature support with modular architecture
 */

const fs = require('fs');
const path = require('path');

class LatexEngine {
    constructor() {
        this.parsers = new Map();
        this.themes = new Map();
        this.templates = new Map();
        
        // Load core components
        this.loadCoreParsers();
        this.loadCoreThemes();
        this.loadCoreTemplates();
    }

    loadCoreParsers() {
        // Load all parser modules
        const parsers = [
            'DocumentParser',
            'TextParser', 
            'MathParser',
            'CodeParser',
            'ListParser',
            'TableParser',
            'FigureParser',
            'StructureParser',
            'TikZParser',
            'NiceMatrixParser'
        ];

        parsers.forEach(parserName => {
            try {
                const ParserClass = require(`./parsers/${parserName}`);
                this.parsers.set(parserName, new ParserClass());
            } catch (error) {
                // Silently skip optional parsers
            }
        });
    }

    loadCoreThemes() {
        // Load built-in themes
        const themes = ['Default', 'Portfolio', 'Book'];
        
        themes.forEach(themeName => {
            try {
                const ThemeClass = require(`./themes/${themeName}Theme`);
                this.themes.set(themeName.toLowerCase(), new ThemeClass());
            } catch (error) {
                // Silently skip optional themes
            }
        });
    }

    loadCoreTemplates() {
        // Load built-in document templates
        const templates = ['Article', 'Report', 'Book', 'Resume', 'Letter'];
        
        templates.forEach(templateName => {
            try {
                const template = require(`../templates/${templateName}Template`);
                this.templates.set(templateName.toLowerCase(), template);
            } catch (error) {
                // Silently skip optional templates
            }
        });
    }

    parse(latexContent, options = {}) {
        const context = {
            documentType: this.detectDocumentType(latexContent),
            theme: options.theme || this.detectTheme(latexContent),
            metadata: this.extractMetadata(latexContent),
            options: options
        };

        let html = latexContent;
        
        // Remove document class and packages
        html = html.replace(/\\documentclass\{[^}]*\}/g, '');
        html = html.replace(/\\usepackage\{[^}]*\}/g, '');
        html = html.replace(/\\usepackage\[[^\]]*\]\{[^}]*\}/g, '');
        
        // Remove comments
        html = html.replace(/%.*$/gm, '');
        
        // Extract and process metadata
        const metadata = this.extractMetadata(html);
        Object.assign(context.metadata, metadata);

        // Apply parsers in order
        const parserOrder = [
            'DocumentParser',
            'StructureParser', 
            'MathParser',
            'NiceMatrixParser',
            'TikZParser',
            'CodeParser',
            'TableParser',
            'FigureParser',
            'ListParser',
            'TextParser'
        ];

        parserOrder.forEach(parserName => {
            const parser = this.parsers.get(parserName);
            if (parser) {
                html = parser.parse(html, context);
            }
        });

        return {
            html,
            context,
            metadata: context.metadata
        };
    }

    detectDocumentType(latexContent) {
        if (latexContent.includes('\\documentclass{book}')) return 'book';
        if (latexContent.includes('\\documentclass{article}')) return 'article';
        if (latexContent.includes('\\documentclass{report}')) return 'report';
        if (latexContent.includes('\\documentclass{letter}')) return 'letter';
        if (latexContent.includes('resume') || latexContent.includes('cv')) return 'resume';
        
        // Check for custom class
        const classMatch = latexContent.match(/\\documentclass\{([^}]+)\}/);
        return classMatch ? classMatch[1] : 'article';
    }

    detectTheme(latexContent) {
        if (latexContent.includes('\\documentclass{book}')) return 'book';
        if (latexContent.includes('\\documentclass{portfolio}')) return 'portfolio';
        if (latexContent.includes('\\usepackage[a4paper]')) return 'a4';
        if (latexContent.includes('\\usepackage[letterpaper]')) return 'letter';
        if (latexContent.includes('modern') || latexContent.includes('tufte')) return 'modern';
        if (latexContent.includes('academic') || latexContent.includes('IEEE')) return 'academic';
        
        return 'default';
    }

    extractMetadata(latexContent) {
        const metadata = {};
        
        // Extract title
        const titleMatch = latexContent.match(/\\title\{([^}]+)\}/);
        if (titleMatch) metadata.title = titleMatch[1];
        
        // Extract author
        const authorMatch = latexContent.match(/\\author\{([^}]+)\}/);
        if (authorMatch) metadata.author = authorMatch[1];
        
        // Extract date
        const dateMatch = latexContent.match(/\\date\{([^}]+)\}/);
        if (dateMatch) metadata.date = dateMatch[1];
        
        // Extract keywords
        const keywordsMatch = latexContent.match(/\\keywords\{([^}]+)\}/);
        if (keywordsMatch) metadata.keywords = keywordsMatch[1].split(',').map(k => k.trim());
        
        return metadata;
    }

    generateHtml(latexPath, options = {}) {
        try {
            const latexContent = fs.readFileSync(latexPath, 'utf8');
            const parsed = this.parse(latexContent, options);
            
            // Get theme
            const theme = this.themes.get(parsed.context.theme) || this.themes.get('default');
            
            if (!theme) {
                throw new Error(`Theme '${parsed.context.theme}' not found`);
            }
            
            // Generate final HTML
            const html = theme.generateHTML(parsed);
            
            return html;
        } catch (error) {
            return this.generateErrorPage(error);
        }
    }

    generateErrorPage(error) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LaTeX Engine Error</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .error { background: #fee; border: 1px solid #fcc; padding: 20px; border-radius: 8px; }
        h1 { color: #c33; }
        code { background: #f5f5f5; padding: 2px 4px; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="error">
        <h1>LaTeX Processing Error</h1>
        <p><strong>Error:</strong> ${error.message}</p>
        <p><strong>Stack:</strong> <code>${error.stack}</code></p>
    </div>
</body>
</html>`;
    }

    convert(inputFile, outputFile = null, options = {}) {
        if (!outputFile) {
            const inputPath = path.parse(inputFile);
            outputFile = path.join(inputPath.dir, inputPath.name + '.html');
        }
        
        if (!fs.existsSync(inputFile)) {
            console.error(`Error: File '${inputFile}' not found`);
            process.exit(1);
        }
        
        const html = this.generateHtml(inputFile, options);
        
        fs.writeFileSync(outputFile, html);
        
        console.log(`Successfully converted ${inputFile} to ${outputFile}`);
        console.log(`Theme: ${this.detectTheme(fs.readFileSync(inputFile, 'utf8'))}`);
        console.log(`Open ${outputFile} in your browser to see the result!`);
        
        return outputFile;
    }
}

module.exports = LatexEngine;