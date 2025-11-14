#!/usr/bin/env node

/**
 * Engine Wrapper for Vercel Serverless
 * Bundled version of the LaTeX engine that works in serverless environments
 */

const fs = require('fs');
const path = require('path');

// Inline the minimal engine functionality needed for Vercel
class SimpleLatexEngine {
    constructor() {
        this.options = {
            outputDirectory: './',
            minify: false,
            validateDocument: true,
            preserveComments: false
        };
    }

    async convertFile(inputPath, outputPath = null) {
        if (!fs.existsSync(inputPath)) {
            throw new Error(`Input file not found: ${inputPath}`);
        }

        const latexContent = fs.readFileSync(inputPath, 'utf8');
        const htmlContent = this.convertLatexToHTML(latexContent);
        
        const finalOutputPath = outputPath || inputPath.replace('.tex', '.html');
        fs.writeFileSync(finalOutputPath, htmlContent);
        
        return {
            inputPath,
            outputPath: finalOutputPath,
            documentClass: this.extractDocumentClass(latexContent),
            success: true
        };
    }

    convertLatexToHTML(latexContent) {
        // Basic LaTeX to HTML conversion
        let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LaTeX Document</title>
    <style>
        body { font-family: 'Times New Roman', serif; line-height: 1.6; margin: 40px; max-width: 800px; }
        h1 { font-size: 24px; margin-bottom: 20px; }
        h2 { font-size: 18px; margin-top: 30px; margin-bottom: 15px; }
        p { margin-bottom: 15px; }
        .document { border: 1px solid #ddd; padding: 30px; background: white; }
        .title { text-align: center; margin-bottom: 30px; }
        .author { text-align: center; margin-bottom: 30px; font-style: italic; }
        .abstract { background: #f5f5f5; padding: 20px; margin: 20px 0; border-left: 3px solid #333; }
        .section { margin-top: 25px; }
        .math { font-style: italic; background: #f0f0f0; padding: 2px 4px; }
    </style>
</head>
<body>
    <div class="document">`;

        // Extract title
        const titleMatch = latexContent.match(/\\title\{([^}]+)\}/);
        if (titleMatch) {
            html += `\n        <div class="title">\n            <h1>${this.escapeHtml(titleMatch[1])}</h1>\n        </div>`;
        }

        // Extract author
        const authorMatch = latexContent.match(/\\author\{([^}]+)\}/);
        if (authorMatch) {
            html += `\n        <div class="author">\n            <p>${this.escapeHtml(authorMatch[1])}</p>\n        </div>`;
        }

        // Extract abstract
        const abstractMatch = latexContent.match(/\\begin\{abstract\}([\s\S]*?)\\end\{abstract\}/);
        if (abstractMatch) {
            html += `\n        <div class="abstract">\n            <h2>Abstract</h2>\n            <p>${this.processText(abstractMatch[1])}</p>\n        </div>`;
        }

        // Process sections
        const sections = latexContent.match(/\\section\{([^}]+)\}([\s\S]*?)(?=\\section\{|\\subsection\{|$)/g);
        if (sections) {
            sections.forEach(section => {
                const sectionMatch = section.match(/\\section\{([^}]+)\}([\s\S]*)/);
                if (sectionMatch) {
                    html += `\n        <div class="section">\n            <h2>${this.escapeHtml(sectionMatch[1])}</h2>\n            ${this.processText(sectionMatch[2])}\n        </div>`;
                }
            });
        }

        // Process basic text
        const remainingText = latexContent
            .replace(/\\title\{[^}]+\}/, '')
            .replace(/\\author\{[^}]+\}/, '')
            .replace(/\\begin\{abstract\}[\s\S]*?\\end\{abstract\}/, '')
            .replace(/\\section\{[^}]+\}[\s\S]*?(?=\\section\{|$)/, '')
            .replace(/\\documentclass[\s\S]*?\\begin\{document\}/, '')
            .replace(/\\end\{document\}/, '');

        if (remainingText.trim()) {
            html += `\n        <div class="content">\n            ${this.processText(remainingText)}\n        </div>`;
        }

        html += `
    </div>
</body>
</html>`;

        return html;
    }

    processText(text) {
        return text
            .replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
            .replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')
            .replace(/\\texttt\{([^}]+)\}/g, '<code>$1</code>')
            .replace(/\$\$([^$]+)\$\$/g, '<div class="math">$$$1$$</div>')
            .replace(/\$([^$]+)\$/g, '<span class="math">$1</span>')
            .replace(/\\\\/g, '<br>')
            .replace(/\n\s*\n/g, '</p><p>')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>')
            .replace(/<p><\/p>/g, '')
            .replace(/<p>\s*<br>/g, '<p>')
            .replace(/<br>\s*<\/p>/g, '</p>')
            .trim();
    }

    extractDocumentClass(latexContent) {
        const match = latexContent.match(/\\documentclass\{([^}]+)\}/);
        return match ? match[1] : 'article';
    }

    escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}

// CLI wrapper for compatibility
class CLI {
    constructor() {
        this.engine = new SimpleLatexEngine();
        this.version = '1.0.0';
    }

    async run(args) {
        try {
            const { command, options, filePaths } = this.parseArguments(args);
            
            switch (command) {
                case 'convert':
                case 'c':
                default:
                    await this.handleConvert(filePaths, options);
                    break;
            }
            
        } catch (error) {
            console.error('Error:', error.message);
            process.exit(1);
        }
    }

    parseArguments(args) {
        const parsed = {
            command: 'convert',
            options: {},
            filePaths: []
        };

        let i = 2; // Skip node and script path

        if (args[i] && !args[i].startsWith('-')) {
            parsed.command = args[i];
            i++;
        }

        while (i < args.length && args[i].startsWith('-')) {
            const option = args[i];
            
            switch (option) {
                case '-o':
                case '--output':
                    parsed.options.outputPath = args[++i];
                    break;
                case '-v':
                case '--verbose':
                    parsed.options.verbose = true;
                    break;
                case '-q':
                case '--quiet':
                    parsed.options.quiet = true;
                    break;
                default:
                    i++; // Skip unknown options
            }
            
            i++;
        }

        while (i < args.length) {
            parsed.filePaths.push(args[i]);
            i++;
        }

        return parsed;
    }

    async handleConvert(filePaths, options) {
        if (filePaths.length === 0) {
            throw new Error('No input files specified');
        }

        const filePath = filePaths[0];
        const outputPath = options.outputPath;
        
        if (options.verbose) {
            console.log(`Converting ${filePath}...`);
        }
        
        const result = await this.engine.convertFile(filePath, outputPath);
        
        if (!options.quiet) {
            console.log(`✓ Successfully converted ${path.basename(result.inputPath)}`);
            console.log(`  Output: ${result.outputPath}`);
            console.log(`  Document Class: ${result.documentClass}`);
        }
    }
}

// Entry point
if (require.main === module) {
    const cli = new CLI();
    cli.run(process.argv).catch(error => {
        console.error('Fatal error:', error.message);
        process.exit(1);
    });
}

module.exports = CLI;