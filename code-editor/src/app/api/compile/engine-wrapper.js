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
        .math, .math-inline { font-style: italic; background: #f8f9fa; padding: 2px 4px; font-family: 'Times New Roman', serif; }
        .math-display { 
            display: block; 
            text-align: center; 
            margin: 15px 0; 
            padding: 15px; 
            background: #f8f9fa; 
            border: 1px solid #e9ecef;
            border-radius: 4px;
            font-family: 'Times New Roman', serif;
            font-size: 16px;
            overflow-x: auto;
        }
        .matrix { 
            border: none; 
            border-spacing: 0;
        }
        .matrix td { 
            padding: 2px 8px; 
            text-align: center;
            border: none;
        }
        .matrix-parenthesis {
            font-size: 1.2em;
            vertical-align: middle;
            margin: 0 2px;
        }
        .latex-table {
            border-collapse: collapse;
            margin: 15px 0;
            font-family: 'Times New Roman', serif;
        }
        .latex-table td {
            padding: 8px 12px;
            border: 1px solid #ddd;
            text-align: left;
        }
        .itemize, .enumerate { margin: 15px 0; padding-left: 30px; }
        .itemize li, .enumerate li { margin-bottom: 8px; }
        pre {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 4px;
            padding: 15px;
            margin: 15px 0;
            overflow-x: auto;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.45;
        }
        code {
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 14px;
            background: transparent;
            padding: 0;
            border: none;
        }
        .language-cpp, .language-c {
            background: #1e1e1e;
            color: #d4d4d4;
            border-color: #3e3e3e;
        }
        .language-python {
            background: #f6f6f6;
            color: #333;
            border-color: #ddd;
        }
        .language-java {
            background: #f8f8f8;
            color: #333;
            border-color: #ccc;
        }
        .language-javascript, .language-typescript {
            background: #fdf6e3;
            color: #333;
            border-color: #f0e68c;
        }
        .language-html {
            background: #fff5f5;
            color: #333;
            border-color: #ffcccc;
        }
        .language-css {
            background: #f0f8ff;
            color: #333;
            border-color: #cce6ff;
        }
        .language-json {
            background: #f8f8f8;
            color: #333;
            border-color: #e0e0e0;
        }
        .language-bash {
            background: #2e3440;
            color: #d8dee9;
            border-color: #434c5e;
        }
        .language-sql {
            background: #f5f5f5;
            color: #333;
            border-color: #ddd;
        }
        .language-text {
            background: #f8f9fa;
            color: #333;
            border-color: #e9ecef;
        }
        /* AMS Math environments */
        .align-equation {
            display: block;
            text-align: center;
            margin: 15px 0;
            padding: 10px;
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 4px;
            font-family: 'Times New Roman', serif;
        }
        .equation-number {
            display: inline-block;
            margin-left: 20px;
            font-size: 14px;
            color: #666;
        }
        .align-row {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin: 8px 0;
        }
        .align-left {
            text-align: right;
            margin-right: 20px;
        }
        .align-right {
            text-align: left;
            margin-left: 20px;
        }
        .align-symbol {
            margin: 0 10px;
        }
        /* Theorem environments */
        .theorem {
            margin: 20px 0;
            padding: 20px;
            background: #f0f8ff;
            border-left: 5px solid #007bff;
            border-radius: 4px;
        }
        .lemma {
            margin: 20px 0;
            padding: 20px;
            background: #f0fff0;
            border-left: 5px solid #28a745;
            border-radius: 4px;
        }
        .corollary {
            margin: 20px 0;
            padding: 20px;
            background: #fff8f0;
            border-left: 5px solid #fd7e14;
            border-radius: 4px;
        }
        .proposition {
            margin: 20px 0;
            padding: 20px;
            background: #fff0f5;
            border-left: 5px solid #e83e8c;
            border-radius: 4px;
        }
        .definition {
            margin: 20px 0;
            padding: 20px;
            background: #f8f9fa;
            border-left: 5px solid #6c757d;
            border-radius: 4px;
        }
        .example {
            margin: 20px 0;
            padding: 20px;
            background: #e8f5e8;
            border-left: 5px solid #28a745;
            border-radius: 4px;
        }
        .remark {
            margin: 20px 0;
            padding: 20px;
            background: #f0f0f0;
            border-left: 5px solid #6c757d;
            border-radius: 4px;
        }
        .proof {
            margin: 15px 0;
            padding: 15px;
            background: #fafafa;
            border-left: 3px solid #ced4da;
            font-style: italic;
        }
        .proof-end {
            float: right;
            font-weight: bold;
            font-style: normal;
        }
        .theorem-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
        }
        .theorem-number {
            color: #666;
            font-weight: normal;
        }
        /* TColorBox environments */
        .tcolorbox {
            margin: 20px 0;
            padding: 20px;
            border-radius: 8px;
            border: 2px solid;
            background: #ffffff;
        }
        .tcolorbox-blue {
            border-color: #007bff;
            background: #f8f9ff;
        }
        .tcolorbox-green {
            border-color: #28a745;
            background: #f8fff8;
        }
        .tcolorbox-red {
            border-color: #dc3545;
            background: #fff8f8;
        }
        .tcolorbox-yellow {
            border-color: #ffc107;
            background: #fffef0;
        }
        .tcolorbox-purple {
            border-color: #6f42c1;
            background: #f8f6ff;
        }
        .tcolorbox-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
            font-size: 16px;
        }
        /* Enhanced math symbols */
        .math-symbol {
            font-style: normal;
            font-family: 'Times New Roman', serif;
        }
        .math-op {
            font-style: normal;
            font-weight: normal;
        }
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
            cursor: pointer;
            transition: transform 0.2s;
        }
        .figure img:hover {
            transform: scale(1.02);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .clickable-file {
            display: inline-block;
            padding: 8px 12px;
            margin: 4px;
            background: #f0f8ff;
            border: 1px solid #007bff;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            color: #007bff;
            transition: background 0.2s;
        }
        .clickable-file:hover {
            background: #e6f3ff;
            text-decoration: none;
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

        // First process ALL matrices and math in the entire document content
        documentContent = this.processMatrices(documentContent);
        documentContent = this.processAdvancedMathEnvironments(documentContent);
        documentContent = documentContent.replace(/\\\\?\[\s*([\s\S]*?)\s*\\\\?\]/g, 
            (match, math) => {
                const processedMath = this.processMath(math.trim());
                return `<div class="math-display">${processedMath}</div>`;
            });
        documentContent = documentContent.replace(/\\\\?\(\s*([^)]+)\s*\\\\?\)/g, 
            (match, math) => {
                const processedMath = this.processMath(math.trim());
                return `<span class="math-inline">${processedMath}</span>`;
            });

        // Remove title, author, date, abstract that we already processed
        documentContent = documentContent
            .replace(/\\title\{[^}]+\}/, '')
            .replace(/\\author\{[^}]+\}/, '')
            .replace(/\\date\{[^}]*\}/, '')
            .replace(/\\maketitle/, '')
            .replace(/\\begin\{abstract\}[\s\S]*?\\end\{abstract\}/, '');

        // Process content using a simpler approach to preserve all content
        let processedContent = documentContent;
        
        // Process sections with their content
        const sectionMatches = [...processedContent.matchAll(/\\section\*?\{([^}]+)\}([\s\S]*?)(?=\\section\*?\{|$)/g)];
        
        if (sectionMatches.length > 0) {
            sectionMatches.forEach(sectionMatch => {
                const sectionTitle = this.processInlineText(sectionMatch[1]);
                const sectionContent = sectionMatch[2];
                
                // Process subsections within this section
                const subsectionMatches = [...sectionContent.matchAll(/\\subsection\*?\{([^}]+)\}([\s\S]*?)(?=\\subsection\*?\{|$)/g)];
                
                if (subsectionMatches.length > 0) {
                    html += `\n        <div class="section">
            <h2>${sectionTitle}</h2>`;
                    
                    let lastIndex = 0;
                    subsectionMatches.forEach(subsectionMatch => {
                        // Add content before this subsection
                        const beforeSubsection = sectionContent.slice(lastIndex, subsectionMatch.index);
                        if (beforeSubsection.trim()) {
                            html += `\n            ${this.processText(beforeSubsection)}`;
                        }
                        
                        const subsectionTitle = this.processInlineText(subsectionMatch[1]);
                        const subsectionContent = subsectionMatch[2];
                        
                        html += `\n            <div class="subsection">
                <h3>${subsectionTitle}</h3>
                ${this.processText(subsectionContent)}
            </div>`;
                        
                        lastIndex = subsectionMatch.index + subsectionMatch[0].length;
                    });
                    
                    // Add content after last subsection
                    const afterSubsections = sectionContent.slice(lastIndex);
                    if (afterSubsections.trim()) {
                        html += `\n            ${this.processText(afterSubsections)}`;
                    }
                    
                    html += `\n        </div>`;
                } else {
                    // No subsections, just add the section
                    html += `\n        <div class="section">
            <h2>${sectionTitle}</h2>
            ${this.processText(sectionContent)}
        </div>`;
                }
            });
        } else {
            // No sections, just process all content
            html += `\n        <div class="content">\n            ${this.processText(processedContent)}\n        </div>`;
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

        // Handle matrix environments FIRST - before other processing
        processed = this.processMatrices(processed);

        // Handle display math \[ ... \]
        processed = processed.replace(/\\\\?\[\s*([\s\S]*?)\s*\\\\?\]/g, 
            (match, math) => {
                const processedMath = this.processMath(math.trim());
                return `<div class="math-display">${processedMath}</div>`;
            });

        // Handle inline math \( ... \)
        processed = processed.replace(/\\\\?\(\s*([^)]+)\s*\\\\?\)/g, 
            (match, math) => {
                const processedMath = this.processMath(math.trim());
                return `<span class="math-inline">${processedMath}</span>`;
            });

        // Handle figures and images
        processed = processed.replace(/\\begin\{figure\}([\s\S]*?)\\end\{figure\}/g, 
            (match, content) => {
                const captionMatch = content.match(/\\caption\{([^}]+)\}/);
                const imageMatch = content.match(/\\includegraphics\[?[^\]]*\]?\{([^}]+)\}/);
                
                let result = '<div class="figure">';
                if (imageMatch) {
                    const filename = imageMatch[1];
                    const ext = filename.match(/\.(png|jpg|jpeg|gif|svg)$/i) ? '' : '.png';
                    const fullFilename = filename + ext;
                    result += `<img src="${fullFilename}" alt="${captionMatch ? captionMatch[1] : 'Figure'}" onclick="window.open('${fullFilename}', '_blank')" />`;
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
                if (filename.match(/\.(pdf)$/i)) {
                    // PDF files - show as clickable link
                    return `<a href="${filename}" target="_blank" class="clickable-file">📄 ${filename}</a>`;
                } else {
                    // Image files
                    const ext = filename.match(/\.(png|jpg|jpeg|gif|svg)$/i) ? '' : '.png';
                    const fullFilename = filename + ext;
                    return `<img src="${fullFilename}" alt="Image" style="max-width: 100%; height: auto; cursor: pointer;" onclick="window.open('${fullFilename}', '_blank')" />`;
                }
            });

        // Handle PDF references in text
        processed = processed.replace(/([^\s]+\.pdf)(?!\w)/gi, 
            (match, filename) => {
                return `<a href="${filename}" target="_blank" class="clickable-file">📄 ${filename}</a>`;
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
                return `<pre><code class="language-text">${this.escapeHtml(content.trim())}</code></pre>`;
            });

        // Handle theorem environments (amsthm package)
        const theoremEnvironments = [
            'theorem', 'lemma', 'corollary', 'proposition', 'definition', 
            'example', 'remark', 'conjecture', 'axiom', 'property', 'observation'
        ];
        
        theoremEnvironments.forEach(env => {
            const envPattern = new RegExp(`\\\\begin\\{${env}\\}(?:\\[([^\\]]+)\\])?([\\s\\S]*?)\\\\end\\{${env}\\}`, 'g');
            processed = processed.replace(envPattern, (match, title, content) => {
                const envTitle = title ? title.charAt(0).toUpperCase() + title.slice(1) : env.charAt(0).toUpperCase() + env.slice(1);
                return `<div class="${env}">
                    <div class="theorem-title">${envTitle}.</div>
                    <div>${this.processText(content.trim())}</div>
                </div>`;
            });
        });

        // Handle proof environment
        processed = processed.replace(/\\begin\{proof\}([\s\S]*?)\\end\{proof\}/g, 
            (match, content) => {
                return `<div class="proof">
                    ${this.processText(content.trim())}
                    <span class="proof-end">∎</span>
                </div>`;
            });

        // Handle tcolorbox environments
        processed = processed.replace(/\\begin\{tcolorbox\}(?:\[([^\]]+)\])?([\s\S]*?)\\end\{tcolorbox\}/g, 
            (match, options, content) => {
                let boxClass = 'tcolorbox';
                let title = '';
                
                // Parse options for color and title
                if (options) {
                    if (options.includes('blue') || options.includes('colback=blue!')) boxClass += ' tcolorbox-blue';
                    if (options.includes('green') || options.includes('colback=green!')) boxClass += ' tcolorbox-green';
                    if (options.includes('red') || options.includes('colback=red!')) boxClass += ' tcolorbox-red';
                    if (options.includes('yellow') || options.includes('colback=yellow!')) boxClass += ' tcolorbox-yellow';
                    if (options.includes('purple') || options.includes('colback=purple!')) boxClass += ' tcolorbox-purple';
                    
                    const titleMatch = options.match(/title=([^,\]]+)/);
                    if (titleMatch) title = titleMatch[1].replace(/["{}]/g, '');
                }
                
                let titleHtml = title ? `<div class="tcolorbox-title">${title}</div>` : '';
                return `<div class="${boxClass}">
                    ${titleHtml}
                    ${this.processText(content.trim())}
                </div>`;
            });

        // Handle custom code environments with language specification
        const supportedLanguages = ['cpp', 'python', 'java', 'javascript', 'typescript', 'html', 'css', 'php', 'ruby', 'go', 'rust', 'swift', 'c', 'sql', 'bash', 'json', 'xml', 'yaml', 'markdown'];
        
        supportedLanguages.forEach(lang => {
            const envPattern = new RegExp(`\\\\begin\\{${lang}\\}([\\s\\S]*?)\\\\end\\{${lang}\\}`, 'g');
            processed = processed.replace(envPattern, (match, content) => {
                return `<pre><code class="language-${lang}">${this.escapeHtml(content.trim())}</code></pre>`;
            });
        });

        // Handle minted environment (common for syntax highlighting)
        processed = processed.replace(/\\begin\{minted\}\{([a-zA-Z]+)\}([\s\S]*?)\\end\{minted\}/g, 
            (match, lang, content) => {
                const validLang = supportedLanguages.includes(lang) ? lang : 'text';
                return `<pre><code class="language-${validLang}">${this.escapeHtml(content.trim())}</code></pre>`;
            });

        // Handle vertical spacing
        processed = processed.replace(/\\vspace\{([^}]+)\}/g, (match, space) => {
            const value = parseFloat(space);
            const pixels = Math.round(value * 6); // Convert cm/em to pixels (approximate)
            return `<div style="height: ${pixels}px;"></div>`;
        });

        // Handle font size commands with proper closing tags
        const fontSizeCommands = [
            { cmd: 'tiny', size: '8px' },
            { cmd: 'scriptsize', size: '10px' },
            { cmd: 'footnotesize', size: '11px' },
            { cmd: 'small', size: '12px' },
            { cmd: 'normalsize', size: '14px' },
            { cmd: 'large', size: '16px' },
            { cmd: 'Large', size: '18px' },
            { cmd: 'LARGE', size: '20px' },
            { cmd: 'huge', size: '22px' },
            { cmd: 'Huge', size: '24px' }
        ];

        // Process font size commands in reverse order to handle nesting properly
        for (let i = fontSizeCommands.length - 1; i >= 0; i--) {
            const { cmd, size } = fontSizeCommands[i];
            const regex = new RegExp(`\\\\${cmd}([^\\\\]*?)(?=\\\\(normalsize|${fontSizeCommands.map(f => f.cmd).join('|')}|$|\\n|\\r|$))`, 'gs');
            processed = processed.replace(regex, (match, content) => {
                return `<span style="font-size: ${size}; display: inline-block;">${content.trim()}</span>`;
            });
        }

        // Handle display math \[ ... \]
        processed = processed.replace(/\\\\?\[\s*([\s\S]*?)\s*\\\\?\]/g, 
            (match, math) => {
                const processedMath = this.processMath(math.trim());
                return `<div class="math-display">${processedMath}</div>`;
            });

        // Handle inline math \( ... \)
        processed = processed.replace(/\\\\?\(\s*([^)]+)\s*\\\\?\)/g, 
            (match, math) => {
                const processedMath = this.processMath(math.trim());
                return `<span class="math-inline">${processedMath}</span>`;
            });

        // Handle tabular environment
        processed = processed.replace(/\\begin\{tabular\}\{([^}]*)\}([\s\S]*?)\\end\{tabular\}/g, 
            (match, columns, content) => {
                // Clean up content first
                let cleanContent = content.replace(/\\toprule|\\midrule|\\bottomrule/g, '');
                const rows = cleanContent.split('\\\\').filter(row => row.trim() && !row.trim().startsWith('\\'));
                const tableRows = rows.map(row => {
                    const cells = row.split('&').map(cell => cell.trim());
                    const tableCells = cells.map(cell => `<td style="padding: 8px; border: 1px solid #ddd;">${this.processInlineText(cell)}</td>`).join('');
                    return `<tr>${tableCells}</tr>`;
                }).join('');
                return `<table class="latex-table" style="border-collapse: collapse; margin: 15px 0; width: auto;">${tableRows}</table>`;
            });

        
        // Handle Greek letters (comprehensive set)
        processed = processed
            // Lowercase Greek letters
            .replace(/\\alpha/g, 'α')
            .replace(/\\beta/g, 'β')
            .replace(/\\gamma/g, 'γ')
            .replace(/\\delta/g, 'δ')
            .replace(/\\epsilon/g, 'ε')
            .replace(/\\varepsilon/g, 'ε')
            .replace(/\\zeta/g, 'ζ')
            .replace(/\\eta/g, 'η')
            .replace(/\\theta/g, 'θ')
            .replace(/\\vartheta/g, 'ϑ')
            .replace(/\\iota/g, 'ι')
            .replace(/\\kappa/g, 'κ')
            .replace(/\\lambda/g, 'λ')
            .replace(/\\mu/g, 'μ')
            .replace(/\\nu/g, 'ν')
            .replace(/\\xi/g, 'ξ')
            .replace(/\\pi/g, 'π')
            .replace(/\\varpi/g, 'ϖ')
            .replace(/\\rho/g, 'ρ')
            .replace(/\\varrho/g, 'ϱ')
            .replace(/\\sigma/g, 'σ')
            .replace(/\\varsigma/g, 'ς')
            .replace(/\\tau/g, 'τ')
            .replace(/\\upsilon/g, 'υ')
            .replace(/\\phi/g, 'φ')
            .replace(/\\varphi/g, 'φ')
            .replace(/\\chi/g, 'χ')
            .replace(/\\psi/g, 'ψ')
            .replace(/\\omega/g, 'ω')
            // Uppercase Greek letters
            .replace(/\\Gamma/g, 'Γ')
            .replace(/\\Delta/g, 'Δ')
            .replace(/\\Theta/g, 'Θ')
            .replace(/\\Lambda/g, 'Λ')
            .replace(/\\Xi/g, 'Ξ')
            .replace(/\\Pi/g, 'Π')
            .replace(/\\Sigma/g, 'Σ')
            .replace(/\\Upsilon/g, 'Υ')
            .replace(/\\Phi/g, 'Φ')
            .replace(/\\Psi/g, 'Ψ')
            .replace(/\\Omega/g, 'Ω');

        // Handle math symbols from amssymb
        processed = processed
            // Relations
            .replace(/\\leq/g, '≤')
            .replace(/\\geq/g, '≥')
            .replace(/\\neq/g, '≠')
            .replace(/\\approx/g, '≈')
            .replace(/\\equiv/g, '≡')
            .replace(/\\sim/g, '∼')
            .replace(/\\simeq/g, '≃')
            .replace(/\\cong/g, '≅')
            .replace(/\\prec/g, '≺')
            .replace(/\\succ/g, '≻')
            .replace(/\\preceq/g, '≼')
            .replace(/\\succeq/g, '≽')
            .replace(/\\ll/g, '≪')
            .replace(/\\gg/g, '≫')
            .replace(/\\subset/g, '⊂')
            .replace(/\\supset/g, '⊃')
            .replace(/\\subseteq/g, '⊆')
            .replace(/\\supseteq/g, '⊇')
            .replace(/\\in/g, '∈')
            .replace(/\\notin/g, '∉')
            .replace(/\\ni/g, '∋')
            .replace(/\\propto/g, '∝')
            .replace(/\\parallel/g, '∥')
            .replace(/\\perp/g, '⊥')
            // Arrows
            .replace(/\\rightarrow/g, '→')
            .replace(/\\leftarrow/g, '←')
            .replace(/\\leftrightarrow/g, '↔')
            .replace(/\\Rightarrow/g, '⇒')
            .replace(/\\Leftarrow/g, '⇐')
            .replace(/\\Leftrightarrow/g, '⇔')
            .replace(/\\mapsto/g, '↦')
            .replace(/\\to/g, '→')
            .replace(/\\gets/g, '←')
            // Binary operators
            .replace(/\\pm/g, '±')
            .replace(/\\mp/g, '∓')
            .replace(/\\times/g, '×')
            .replace(/\\div/g, '÷')
            .replace(/\\cdot/g, '·')
            .replace(/\\circ/g, '∘')
            .replace(/\\oplus/g, '⊕')
            .replace(/\\ominus/g, '⊖')
            .replace(/\\otimes/g, '⊗')
            .replace(/\\oslash/g, '⊘')
            .replace(/\\cup/g, '∪')
            .replace(/\\cap/g, '∩')
            .replace(/\\setminus/g, '∖')
            .replace(/\\wedge/g, '∧')
            .replace(/\\vee/g, '∨')
            .replace(/\\land/g, '∧')
            .replace(/\\lor/g, '∨')
            .replace(/\\implies/g, '⇒')
            .replace(/\\iff/g, '⇔')
            // Miscellaneous symbols
            .replace(/\\infty/g, '∞')
            .replace(/\\partial/g, '∂')
            .replace(/\\nabla/g, '∇')
            .replace(/\\exists/g, '∃')
            .replace(/\\forall/g, '∀')
            .replace(/\\neg/g, '¬')
            .replace(/\\emptyset/g, '∅')
            .replace(/\\varnothing/g, '∅')
            .replace(/\\hbar/g, 'ℏ')
            .replace(/\\ell/g, 'ℓ')
            .replace(/\\wp/g, '℘')
            .replace(/\\Re/g, 'ℜ')
            .replace(/\\Im/g, 'ℑ')
            .replace(/\\aleph/g, 'ℵ')
            .replace(/\\beth/g, 'ℶ')
            .replace(/\\gimel/g, 'ℷ')
            .replace(/\\daleth/g, 'ℸ')
            .replace(/\\sum/g, '∑')
            .replace(/\\prod/g, '∏')
            .replace(/\\coprod/g, '∐')
            .replace(/\\int/g, '∫')
            .replace(/\\iint/g, '∬')
            .replace(/\\iiint/g, '∭')
            .replace(/\\oint/g, '∮')
            .replace(/\\sqrt/g, '√')
            .replace(/\\angle/g, '∠')
            .replace(/\\degree/g, '°')
            .replace(/\\prime/g, '′')
            .replace(/\\backslash/g, '\\')
            .replace(/\\cdot/g, '·')
            .replace(/\\cdots/g, '⋯')
            .replace(/\\vdots/g, '⋮')
            .replace(/\\ddots/g, '⋱')
            .replace(/\\dots/g, '…')
            .replace(/\\ldots/g, '…')
            .replace(/\\mid/g, '|')
            .replace(/\\colon/g, ':');

        // Handle accents and special spacing
        processed = processed
            .replace(/\\left/g, '')
            .replace(/\\right/g, '')
            .replace(/\\^/g, '^')
            .replace(/\\_/g, '_')
            .replace(/\\&/g, '&amp;');

        // Handle math fonts and commands
        processed = processed
            .replace(/\\mathrm\{([^}]+)\}/g, '$1')
            .replace(/\\mathbf\{([^}]+)\}/g, '<strong>$1</strong>')
            .replace(/\\mathit\{([^}]+)\}/g, '<em>$1</em>')
            .replace(/\\mathsf\{([^}]+)\}/g, '<span style="font-family: sans-serif;">$1</span>')
            .replace(/\\mathtt\{([^}]+)\}/g, '<code>$1</code>');

        // Remove remaining LaTeX commands
        processed = processed
            .replace(/\\maketitle\s*/g, '')
            .replace(/\\tableofcontents\s*/g, '')
            .replace(/\\newpage\s*/g, '<hr>')
            .replace(/\\clearpage\s*/g, '<hr>')
            .replace(/\\thispagestyle\{[^}]*\}/g, '')
            .replace(/\\toprule/g, '')
            .replace(/\\midrule/g, '')
            .replace(/\\bottomrule/g, '')
            .replace(/\\end\{document\}/g, '');

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

  processAdvancedMathEnvironments(text) {
        let processed = text;
        
        // Handle align environment (amsmath)
        processed = processed.replace(/\\begin\{align\}([\s\S]*?)\\end\{align\}/g, 
            (match, content) => {
                const lines = content.split('\\\\').filter(line => line.trim());
                const equationLines = lines.map((line, index) => {
                    const trimmedLine = line.trim();
                    const processedLine = this.processMath(trimmedLine);
                    return `<div class="align-row">
                        <div class="align-left">${processedLine}</div>
                        <span class="equation-number">(${index + 1})</span>
                    </div>`;
                }).join('');
                return `<div class="align-equation">${equationLines}</div>`;
            });

        // Handle align* environment (amsmath - without numbers)
        processed = processed.replace(/\\begin\{align\*\}([\s\S]*?)\\end\{align\*\}/g, 
            (match, content) => {
                const lines = content.split('\\\\').filter(line => line.trim());
                const equationLines = lines.map(line => {
                    const trimmedLine = line.trim();
                    const processedLine = this.processMath(trimmedLine);
                    return `<div class="align-row">
                        <div class="align-left">${processedLine}</div>
                    </div>`;
                }).join('');
                return `<div class="align-equation">${equationLines}</div>`;
            });

        // Handle gather environment (amsmath)
        processed = processed.replace(/\\begin\{gather\}([\s\S]*?)\\end\{gather\}/g, 
            (match, content) => {
                const lines = content.split('\\\\').filter(line => line.trim());
                const equationLines = lines.map((line, index) => {
                    const trimmedLine = line.trim();
                    const processedLine = this.processMath(trimmedLine);
                    return `<div class="math-display">${processedLine}<span class="equation-number">(${index + 1})</span></div>`;
                }).join('');
                return `<div>${equationLines}</div>`;
            });

        // Handle gather* environment (amsmath - without numbers)
        processed = processed.replace(/\\begin\{gather\*\}([\s\S]*?)\\end\{gather\*\}/g, 
            (match, content) => {
                const lines = content.split('\\\\').filter(line => line.trim());
                const equationLines = lines.map(line => {
                    const trimmedLine = line.trim();
                    const processedLine = this.processMath(trimmedLine);
                    return `<div class="math-display">${processedLine}</div>`;
                }).join('');
                return `<div>${equationLines}</div>`;
            });

        // Handle multline environment (amsmath)
        processed = processed.replace(/\\begin\{multline\}([\s\S]*?)\\end\{multline\}/g, 
            (match, content) => {
                const lines = content.split('\\\\').filter(line => line.trim());
                const equationLines = lines.map((line, index) => {
                    const trimmedLine = line.trim();
                    const processedLine = this.processMath(trimmedLine);
                    let alignment = 'center';
                    if (index === 0) alignment = 'left';
                    if (index === lines.length - 1) alignment = 'right';
                    return `<div class="math-display" style="text-align: ${alignment};">${processedLine}</div>`;
                }).join('');
                return `<div>${equationLines}</div>`;
            });

        // Handle equation environment (amsmath)
        processed = processed.replace(/\\begin\{equation\}([\s\S]*?)\\end\{equation\}/g, 
            (match, content) => {
                const processedMath = this.processMath(content.trim());
                return `<div class="math-display">${processedMath}<span class="equation-number">(1)</span></div>`;
            });

        // Handle equation* environment (amsmath - without numbers)
        processed = processed.replace(/\\begin\{equation\*\}([\s\S]*?)\\end\{equation\*\}/g, 
            (match, content) => {
                const processedMath = this.processMath(content.trim());
                return `<div class="math-display">${processedMath}</div>`;
            });

        // Handle split environment (amsmath - used inside other math environments)
        processed = processed.replace(/\\begin\{split\}([\s\S]*?)\\end\{split\}/g, 
            (match, content) => {
                const lines = content.split('\\\\').filter(line => line.trim());
                const splitLines = lines.map(line => {
                    const trimmedLine = line.trim();
                    const processedLine = this.processMath(trimmedLine);
                    return `<div style="text-align: center; margin: 2px 0;">${processedLine}</div>`;
                }).join('');
                return splitLines;
            });

        // Handle cases environment (amsmath)
        processed = processed.replace(/\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g, 
            (match, content) => {
                const lines = content.split('\\\\').filter(line => line.trim());
                const caseLines = lines.map(line => {
                    const parts = line.split('&');
                    if (parts.length === 2) {
                        const condition = this.processMath(parts[0].trim());
                        const result = this.processMath(parts[1].trim());
                        return `<div style="display: flex; align-items: baseline;">
                            <span>${condition}</span>
                            <span style="margin: 0 10px;">&</span>
                            <span>${result}</span>
                        </div>`;
                    } else {
                        return `<div>${this.processMath(line.trim())}</div>`;
                    }
                }).join('');
                return `<span style="font-size: 1.2em;">{</span><div style="display: inline-block; margin-left: 10px; vertical-align: middle;">${caseLines}</div>`;
            });

        return processed;
    }

    processMatrices(text) {
        let processed = text;
        
        // Handle pmatrix first
        processed = processed.replace(/\\begin\{pmatrix\}([\s\S]*?)\\end\{pmatrix\}/g, 
            (match, content) => {
                const rows = content.split('\\\\').filter(row => row.trim());
                const matrixRows = rows.map(row => {
                    const elements = row.split('&').map(el => this.processInlineText(el.trim()));
                    return `<tr>${elements.map(el => `<td style="padding: 2px 6px; text-align: center; border: none;">${el}</td>`).join('')}</tr>`;
                }).join('');
                return `<span style="font-size: 1.1em; vertical-align: middle;">(</span><table class="matrix" style="display: inline-table; vertical-align: middle; border-collapse: collapse; border: none;">${matrixRows}</table><span style="font-size: 1.1em; vertical-align: middle;">)</span>`;
            });

        // Handle other matrix types
        ['bmatrix', 'vmatrix', 'Vmatrix'].forEach(matrixType => {
            const pattern = new RegExp(`\\\\begin\\{${matrixType}\\}([\\s\\S]*?)\\\\end\\{${matrixType}\\}`, 'g');
            processed = processed.replace(pattern, (match, content) => {
                const rows = content.split('\\\\').filter(row => row.trim());
                const matrixRows = rows.map(row => {
                    const elements = row.split('&').map(el => this.processInlineText(el.trim()));
                    return `<tr>${elements.map(el => `<td style="padding: 2px 6px; text-align: center; border: none;">${el}</td>`).join('')}</tr>`;
                }).join('');
                
                let brackets = '()';
                if (matrixType === 'bmatrix') brackets = '[]';
                if (matrixType === 'vmatrix') brackets = '||';
                if (matrixType === 'Vmatrix') brackets = '‖‖';
                
                return `<span style="font-size: 1.1em; vertical-align: middle;">${brackets[0]}</span><table class="matrix" style="display: inline-table; vertical-align: middle; border-collapse: collapse; border: none;">${matrixRows}</table><span style="font-size: 1.1em; vertical-align: middle;">${brackets[1]}</span>`;
            });
        });
        
        return processed;
  }

  processMath(text) {
        if (!text) return text;
        
        let processed = text;
        
        // Handle \text{} command - convert to normal text
        processed = processed.replace(/\\text\{([^}]+)\}/g, '$1');
        
        // Handle bar notation
        processed = processed.replace(/\\bar\{([^}]+)\}/g, '<span style="text-decoration: overline;">$1</span>');
        
        // Handle blackboard bold notation
        processed = processed
            .replace(/\\mathbb\{([NZQRC])\}/g, '<span style="font-family: Times New Roman; font-weight: bold; font-style: italic;">$1</span>')
            .replace(/\\mathbb\{R\}/g, 'ℝ')
            .replace(/\\mathbb\{Z\}/g, 'ℤ')
            .replace(/\\mathbb\{N\}/g, 'ℕ')
            .replace(/\\mathbb\{Q\}/g, 'ℚ')
            .replace(/\\mathbb\{C\}/g, 'ℂ');
        
        // Handle bold math vectors (mathtools)
        processed = processed.replace(/\\bm\{([^}]+)\}/g, '<strong>$1</strong>');
        
        // Handle AMSFonts additional mathbb symbols
        processed = processed
            .replace(/\\mathbb\{([ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz])\}/g, '<span style="font-family: Times New Roman; font-weight: bold; font-style: italic;">$1</span>')
            .replace(/\\mathbb\{A\}/g, '𝔸')
            .replace(/\\mathbb\{B\}/g, '𝔹')
            .replace(/\\mathbb\{C\}/g, 'ℂ')
            .replace(/\\mathbb\{D\}/g, '𝔻')
            .replace(/\\mathbb\{E\}/g, '𝔼')
            .replace(/\\mathbb\{F\}/g, '𝔽')
            .replace(/\\mathbb\{G\}/g, '𝔾')
            .replace(/\\mathbb\{H\}/g, 'ℍ')
            .replace(/\\mathbb\{I\}/g, '𝕀')
            .replace(/\\mathbb\{J\}/g, '𝕁')
            .replace(/\\mathbb\{K\}/g, '𝕂')
            .replace(/\\mathbb\{L\}/g, '𝕃')
            .replace(/\\mathbb\{M\}/g, '𝕄')
            .replace(/\\mathbb\{N\}/g, 'ℕ')
            .replace(/\\mathbb\{O\}/g, '𝕆')
            .replace(/\\mathbb\{P\}/g, 'ℙ')
            .replace(/\\mathbb\{Q\}/g, 'ℚ')
            .replace(/\\mathbb\{R\}/g, 'ℝ')
            .replace(/\\mathbb\{S\}/g, '𝕊')
            .replace(/\\mathbb\{T\}/g, '𝕋')
            .replace(/\\mathbb\{U\}/g, '𝕌')
            .replace(/\\mathbb\{V\}/g, '𝕍')
            .replace(/\\mathbb\{W\}/g, '𝕎')
            .replace(/\\mathbb\{X\}/g, '𝕏')
            .replace(/\\mathbb\{Y\}/g, '𝕐')
            .replace(/\\mathbb\{Z\}/g, 'ℤ');

        // Handle mathfrak (AMSFonts)
        processed = processed.replace(/\\mathfrak\{([^}]+)\}/g, '<span style="font-family: Fraktur, serif;">$1</span>');

        // Handle mathcal (AMSFonts)
        processed = processed.replace(/\\mathcal\{([^}]+)\}/g, '<span style="font-family: Cursive, script; font-style: italic;">$1</span>');

        // Handle mathscr (AMSFonts)
        processed = processed.replace(/\\mathscr\{([^}]+)\}/g, '<span style="font-family: Cursive, script; font-style: italic;">$1</span>');

        // Handle mathbbm (AMSFonts)
        processed = processed.replace(/\\mathbbm\{([^}]+)\}/g, '<span style="font-family: Times New Roman; font-weight: bold;">$1</span>');
        
        // Handle trigonometric and logarithmic functions
        processed = processed
            .replace(/\\sin/g, 'sin')
            .replace(/\\cos/g, 'cos')
            .replace(/\\tan/g, 'tan')
            .replace(/\\cot/g, 'cot')
            .replace(/\\sec/g, 'sec')
            .replace(/\\csc/g, 'csc')
            .replace(/\\arcsin/g, 'arcsin')
            .replace(/\\arccos/g, 'arccos')
            .replace(/\\arctan/g, 'arctan')
            .replace(/\\ln/g, 'ln')
            .replace(/\\log/g, 'log')
            .replace(/\\exp/g, 'exp');
        
        // Handle spacing commands
        processed = processed
            .replace(/\\quad/g, '  ')
            .replace(/\\qquad/g, '    ')
            .replace(/\\,/g, ' ')
            .replace(/\\:/g, ' ')
            .replace(/\\;/g, ' ')
            .replace(/\\!/g, '')
            .replace(/\\ /g, ' ');
        
        // Handle fractions (both \frac and \dfrac)
        processed = processed.replace(/\\(dfrac|frac)\{([^}]+)\}\{([^}]+)\}/g, 
            '<span style="display: inline-block; vertical-align: middle; text-align: center; margin: 0 2px;">$1<span style="display: block; border-top: 1px solid; padding-top: 1px; font-size: 0.8em;">$2</span></span>');
        
        // Handle square roots
        processed = processed.replace(/\\sqrt(\{[^}]+\})?/g, (match, content) => {
            const rootContent = content ? content.slice(1, -1) : '';
            return `√${rootContent}`;
        });
        
        // Handle superscripts and subscripts
        processed = processed.replace(/\^(\{[^}]+\}|\w)/g, (match, exp) => {
            const expContent = exp.startsWith('{') ? exp.slice(1, -1) : exp;
            return `<sup style="font-size: 0.8em;">${expContent}</sup>`;
        });
        
        processed = processed.replace(/_(\{[^}]+\}|\w)/g, (match, sub) => {
            const subContent = sub.startsWith('{') ? sub.slice(1, -1) : sub;
            return `<sub style="font-size: 0.8em;">${subContent}</sub>`;
        });
        
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