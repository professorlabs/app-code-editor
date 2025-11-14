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
        // Check for spacing commands and packages
        let lineHeight = '1.6';
        let fontSize = '12pt';
        let paperPadding = '60px';
        
        // Handle LaTeX spacing packages
        if (latexContent.includes('\\usepackage{setspace}') || latexContent.includes('\\onehalfspacing')) {
            lineHeight = '1.5';
        }
        if (latexContent.includes('\\doublespacing')) {
            lineHeight = '2.0';
        }
        if (latexContent.includes('\\singlespacing')) {
            lineHeight = '1.0';
        }
        
        // Handle document class options
        if (latexContent.includes('10pt')) {
            fontSize = '10pt';
        } else if (latexContent.includes('11pt')) {
            fontSize = '11pt';
        } else if (latexContent.includes('12pt')) {
            fontSize = '12pt';
        }
        
        // Handle geometry package for margins
        if (latexContent.includes('\\geometry{margin=1in}') || latexContent.includes('margin=1in')) {
            paperPadding = '40px';
        }

        // Basic LaTeX to HTML conversion
        let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LaTeX Document</title>
    <style>
        body { 
            font-family: 'Times New Roman', serif; 
            line-height: ${lineHeight}; 
            margin: 0; 
            padding: 0;
            background: white;
            display: flex;
            justify-content: center;
        }
        .paper {
            max-width: 800px;
            width: 100%;
            background: white;
            padding: ${paperPadding};
            margin: 0;
            font-size: ${fontSize};
        }
        h1 { font-size: 24px; margin-bottom: 20px; text-align: center; }
        h2 { font-size: 18px; margin-top: 30px; margin-bottom: 15px; }
        h3 { font-size: 16px; margin-top: 25px; margin-bottom: 12px; }
        p { margin-bottom: 15px; text-align: justify; }
        .title { text-align: center; margin-bottom: 30px; }
        .author { text-align: center; margin-bottom: 30px; font-style: italic; }
        .date { text-align: center; margin-bottom: 40px; }
        .abstract { 
            background: #f8f9fa; 
            padding: 20px; 
            margin: 20px 0; 
            border-left: 4px solid #007bff;
        }
        .section { margin-top: 25px; }
        .subsection { margin-top: 20px; }
        .math { font-style: italic; background: #f0f0f0; padding: 2px 4px; }
        .itemize, .enumerate { margin: 15px 0; padding-left: 30px; }
        .itemize li, .enumerate li { margin-bottom: 8px; }
        .quote { 
            margin: 20px 0; 
            padding: 15px 20px; 
            border-left: 4px solid #ccc; 
            background: #f9f9f9; 
            font-style: italic;
        }
        .figure { 
            margin: 20px 0; 
            text-align: center; 
        }
        .figure img { 
            max-width: 100%; 
            height: auto; 
            border: 1px solid #ddd;
        }
        .caption { 
            font-style: italic; 
            margin-top: 8px; 
            font-size: 14px;
        }
        @media (max-width: 768px) {
            .paper { padding: 30px; margin: 0; }
        }
    </style>
</head>
<body>
    <div class="paper">`;

        // Extract title (with formatting support)
        const titleMatch = latexContent.match(/\\title\{((?:[^{}]|{[^{}]*})*)\}/);
        if (titleMatch) {
            const processedTitle = this.processInlineText(titleMatch[1]);
            html += `\n        <div class="title">\n            <h1>${processedTitle}</h1>\n        </div>`;
        }

        // Extract author
        const authorMatch = latexContent.match(/\\author\{([^}]+)\}/);
        if (authorMatch) {
            const processedAuthor = this.processInlineText(authorMatch[1]);
            html += `\n        <div class="author">\n            <p>${processedAuthor}</p>\n        </div>`;
        }

        // Extract abstract
        const abstractMatch = latexContent.match(/\\begin\{abstract\}([\s\S]*?)\\end\{abstract\}/);
        if (abstractMatch) {
            html += `\n        <div class="abstract">\n            <h2>Abstract</h2>\n            <p>${this.processText(abstractMatch[1])}</p>\n        </div>`;
        }

        // Extract content between \begin{document} and \end{document}
        const documentMatch = latexContent.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/);
        let documentContent = documentMatch ? documentMatch[1] : latexContent;

        // Remove title, author, date, abstract that we already processed
        documentContent = documentContent
            .replace(/\\title\{[^}]+\}/, '')
            .replace(/\\author\{[^}]+\}/, '')
            .replace(/\\date\{[^}]*\}/, '')
            .replace(/\\maketitle/, '')
            .replace(/\\begin\{abstract\}[\s\S]*?\\end\{abstract\}/, '');

        // Process main sections first (both numbered and unnumbered)
        const sectionRegex = /\\section\*?\{([^}]+)\}([\s\S]*?)(?=\\section\*?\{|\\subsection\*?\{|\\end\{document\}|$)/g;
        const sections = documentContent.match(sectionRegex);
        if (sections) {
            sections.forEach(section => {
                const sectionMatch = section.match(/\\section\*?\{([^}]+)\}([\s\S]*)/);
                if (sectionMatch) {
                    const sectionTitle = this.processInlineText(sectionMatch[1]);
                    let sectionContent = `<div class="section">
            <h2>${sectionTitle}</h2>`;
                    
                    // Process subsections within this section (both numbered and unnumbered)
                    const subsectionRegex = /\\subsection\*?\{([^}]+)\}([\s\S]*?)(?=\\subsection\*?\{|\\section\*?\{|\\end\{document\}|$)/g;
                    const subsections = sectionMatch[2].match(subsectionRegex);
                    
                    if (subsections) {
                        subsections.forEach(subsection => {
                            const subsectionMatch = subsection.match(/\\subsection\*?\{([^}]+)\}([\s\S]*)/);
                            if (subsectionMatch) {
                                const subsectionTitle = this.processInlineText(subsectionMatch[1]);
                                sectionContent += `
            <div class="subsection">
                <h3>${subsectionTitle}</h3>
                ${this.processText(subsectionMatch[2])}
            </div>`;
                            }
                        });
                        
                        // Remove subsections content from section content
                        const remainingSectionContent = sectionMatch[2].replace(/\\subsection\*?\{[^}]+\}[\s\S]*?(?=\\subsection\*?\{|\\section\*?\{|$)/g, '');
                        if (remainingSectionContent.trim()) {
                            sectionContent += `\n            ${this.processText(remainingSectionContent)}`;
                        }
                    } else {
                        // No subsections, just process the section content
                        sectionContent += `\n            ${this.processText(sectionMatch[2])}`;
                    }
                    
                    sectionContent += `\n        </div>`;
                    html += sectionContent;
                }
            });
        }

        // Process remaining content that's not in sections (both numbered and unnumbered)
        const remainingText = documentContent.replace(/\\section\*?\{[^}]+\}[\s\S]*?(?=\\section\*?\{|$)/g, '');

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
        if (!text || text.trim() === '') return '';

        // First handle block environments that should not be wrapped in paragraphs
        let processed = text;

        // Handle figures and images
        processed = processed.replace(/\\begin\{figure\}([\s\S]*?)\\end\{figure\}/g, 
            (match, content) => {
                const captionMatch = content.match(/\\caption\{([^}]+)\}/);
                const imageMatch = content.match(/\\includegraphics\[?[^\]]*\]?\{([^}]+)\}/);
                
                let result = '<div class="figure">';
                if (imageMatch) {
                    const filename = imageMatch[1];
                    const ext = filename.match(/\.(png|jpg|jpeg|gif|svg)$/i) ? '' : '.png';
                    result += `<img src="${filename}${ext}" alt="${captionMatch ? captionMatch[1] : 'Figure'}" />`;
                }
                if (captionMatch) {
                    result += `<div class="caption">${captionMatch[1]}</div>`;
                }
                result += '</div>';
                return result;
            });

        // Handle simple includegraphics
        processed = processed.replace(/\\includegraphics\[?[^\]]*\]?\{([^}]+)\}/g, 
            (match, filename) => {
                const ext = filename.match(/\.(png|jpg|jpeg|gif|svg)$/i) ? '' : '.png';
                return `<img src="${filename}${ext}" alt="Image" style="max-width: 100%; height: auto;" />`;
            });

        // Handle itemize lists
        processed = processed.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, 
            (match, content) => {
                const items = content.split(/\\item\s+/).filter(item => item.trim());
                const listItems = items.map(item => `<li>${this.processInlineText(item.trim())}</li>`).join('');
                return `<ul class="itemize">${listItems}</ul>`;
            });

        // Handle enumerate lists
        processed = processed.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, 
            (match, content) => {
                const items = content.split(/\\item\s+/).filter(item => item.trim());
                const listItems = items.map(item => `<li>${this.processInlineText(item.trim())}</li>`).join('');
                return `<ol class="enumerate">${listItems}</ol>`;
            });

        // Handle quotes
        processed = processed.replace(/\\begin\{quote\}([\s\S]*?)\\end\{quote\}/g, 
            (match, content) => {
                return `<div class="quote">${this.processInlineText(content.trim())}</div>`;
            });

        // Handle quotations
        processed = processed.replace(/\\begin\{quotation\}([\s\S]*?)\\end\{quotation\}/g, 
            (match, content) => {
                return `<div class="quote">${this.processInlineText(content.trim())}</div>`;
            });

        // Handle verbatim
        processed = processed.replace(/\\begin\{verbatim\}([\s\S]*?)\\end\{verbatim\}/g, 
            (match, content) => {
                return `<pre><code>${this.escapeHtml(content.trim())}</code></pre>`;
            });

        // Remove remaining LaTeX commands
        processed = processed
            .replace(/\\maketitle\s*/g, '')
            .replace(/\\tableofcontents\s*/g, '')
            .replace(/\\newpage\s*/g, '<hr>')
            .replace(/\\clearpage\s*/g, '<hr>');

        // Process inline text formatting
        processed = this.processInlineText(processed);

        // Handle paragraphs
        processed = processed
            .replace(/\\\\/g, '<br>')
            .replace(/\\par\b/g, '</p><p>')
            .replace(/\n\s*\n/g, '</p><p>');

        // Wrap in paragraphs if not already wrapped and doesn't contain block elements
        if (processed && !processed.includes('<p>') && 
            !processed.includes('<ul>') && !processed.includes('<ol>') && 
            !processed.includes('<div class="quote">') && 
            !processed.includes('<pre>') && !processed.includes('<div class="figure">')) {
            processed = `<p>${processed}</p>`;
        }

        // Clean up extra paragraph tags
        processed = processed
            .replace(/<p>\s*<div/g, '<div')
            .replace(/<\/div>\s*<\/p>/g, '</div>')
            .replace(/<p>\s*<ul/g, '<ul')
            .replace(/<\/ul>\s*<\/p>/g, '</ul>')
            .replace(/<p>\s*<ol/g, '<ol')
            .replace(/<\/ol>\s*<\/p>/g, '</ol>')
            .replace(/<p>\s*<pre/g, '<pre')
            .replace(/<\/pre>\s*<\/p>/g, '</pre>')
            .replace(/<p><\/p>/g, '')
            .replace(/<p>\s*<br>/g, '<p>')
            .replace(/<br>\s*<\/p>/g, '</p>')
            .replace(/^\s*<p>\s*<\/p>\s*$/g, '')
            .trim();

        return processed;
    }

  processInlineText(text) {
        return text
            .replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
            .replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')
            .replace(/\\texttt\{([^}]+)\}/g, '<code>$1</code>')
            .replace(/\\underline\{([^}]+)\}/g, '<u>$1</u>')
            .replace(/\\emph\{([^}]+)\}/g, '<em>$1</em>')
            .replace(/\$\$([^$]+)\$\$/g, '<div class="math">$$1$$</div>')
            .replace(/\$([^$]+)\$/g, '<span class="math">$1</span>');
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