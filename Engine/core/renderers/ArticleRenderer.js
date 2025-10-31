/**
 * Article Document Renderer
 * Handles LaTeX article class documents
 */

const DocumentRenderer = require('./DocumentRenderer');
const CodeParser = require('../parsers/CodeParser');

class ArticleRenderer extends DocumentRenderer {
    constructor() {
        super();
        this.name = 'article';
        this.displayName = 'Article';
        this.codeParser = new CodeParser();
        this.initializeSupportedCommands();
    }

    /**
     * Initialize supported LaTeX commands for article class
     */
    initializeSupportedCommands() {
        // Sectioning commands
        this.addSupportedCommand('section');
        this.addSupportedCommand('subsection');
        this.addSupportedCommand('subsubsection');
        this.addSupportedCommand('paragraph');
        this.addSupportedCommand('subparagraph');

        // Text formatting commands
        this.addSupportedCommand('textbf');
        this.addSupportedCommand('textit');
        this.addSupportedCommand('texttt');
        this.addSupportedCommand('emph');
        this.addSupportedCommand('underline');

        // List environments
        this.addSupportedCommand('itemize');
        this.addSupportedCommand('enumerate');
        this.addSupportedCommand('description');

        // Document structure
        this.addSupportedCommand('abstract');
        this.addSupportedCommand('keywords');
        this.addSupportedCommand('maketitle');

        // Bibliography
        this.addSupportedCommand('cite');
        this.addSupportedCommand('bibliography');
        this.addSupportedCommand('bibliographystyle');

        // Table of contents
        this.addSupportedCommand('tableofcontents');
        this.addSupportedCommand('listoffigures');
        this.addSupportedCommand('listoftables');

        // Math environments
        this.addSupportedCommand('equation');
        this.addSupportedCommand('align');
        this.addSupportedCommand('gather');
        this.addSupportedCommand('multline');

        // Float environments
        this.addSupportedCommand('figure');
        this.addSupportedCommand('table');

        // Code environments
        this.addSupportedCommand('code');

        // Appendix
        this.addSupportedCommand('appendix');
    }

    /**
     * Parse article document structure
     */
    parseDocument() {
        this.validateDocument();
        
        let processedContent = this.sanitizeContent(this.content);
        
        // Remove document class and usepackage commands
        processedContent = processedContent.replace(/\\documentclass(\[.*?\])?\{.*?\}/g, '');
        processedContent = processedContent.replace(/\\usepackage(\[.*?\])?\{.*?\}/g, '');
        
        // Extract document body
        const documentMatch = processedContent.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/);
        if (!documentMatch) {
            throw new Error('Article document must have begin/end document environment');
        }

        let documentBody = documentMatch[1];
        
        // Process title block
        documentBody = this.processTitleBlock(documentBody);
        
        // Process abstract
        documentBody = this.processEnvironment(documentBody, 'abstract');
        
        // Process sections
        documentBody = this.processSections(documentBody);
        
        // Process standard environments
        documentBody = this.processEnvironment(documentBody, 'itemize');
        documentBody = this.processEnvironment(documentBody, 'enumerate');
        documentBody = this.processEnvironment(documentBody, 'description');
        documentBody = this.processEnvironment(documentBody, 'figure');
        documentBody = this.processEnvironment(documentBody, 'table');
        documentBody = this.processEnvironment(documentBody, 'equation');
        documentBody = this.processEnvironment(documentBody, 'code');
        
        // Process inline commands
        documentBody = this.processCommands(documentBody);
        
        // Process paragraphs
        documentBody = this.processParagraphs(documentBody);
        
        return documentBody;
    }

    /**
     * Process title block in article
     */
    processTitleBlock(content) {
        let titleBlock = '';
        
        if (this.metadata.title) {
            titleBlock += `<h1 class="title">${this.metadata.title}</h1>\n`;
        }
        
        if (this.metadata.author) {
            titleBlock += `<div class="author">${this.metadata.author}</div>\n`;
        }
        
        if (this.metadata.date) {
            titleBlock += `<div class="date">${this.metadata.date}</div>\n`;
        }
        
        // Remove \maketitle command and replace with processed title block
        content = content.replace(/\\maketitle\s*/g, titleBlock);
        
        return content;
    }

    /**
     * Process sectioning commands
     */
    processSections(content) {
        const sectionCommands = [
            { command: 'section', level: 1, tag: 'h2' },
            { command: 'subsection', level: 2, tag: 'h3' },
            { command: 'subsubsection', level: 3, tag: 'h4' },
            { command: 'paragraph', level: 4, tag: 'h5' },
            { command: 'subparagraph', level: 5, tag: 'h6' }
        ];

        let processedContent = content;

        sectionCommands.forEach(({ command, level, tag }) => {
            const pattern = new RegExp(`\\\\${command}\\{([^}]+)\\}`, 'g');
            processedContent = processedContent.replace(pattern, (match, title) => {
                const sectionId = `section-${level}-${title.toLowerCase().replace(/\\s+/g, '-')}`;
                return `<${tag} id="${sectionId}" class="${command}">${title}</${tag}>\n`;
            });
        });

        return processedContent;
    }

    /**
     * Process paragraphs and text content
     */
    processParagraphs(content) {
        // Remove empty lines and create paragraph structure
        const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());
        
        return paragraphs.map(paragraph => {
            const trimmed = paragraph.trim();
            
            // Skip if this looks like a section header or environment
            if (trimmed.startsWith('<h') || trimmed.startsWith('<div class="environment-')) {
                return trimmed;
            }
            
            // If it doesn't already have HTML tags, wrap in paragraph tag
            if (!trimmed.includes('<') && !trimmed.includes('\\')) {
                return `<p>${trimmed}</p>`;
            }
            
            return trimmed;
        }).join('\n\n');
    }

    /**
     * Render sectioning commands
     */
    renderCommand(command, args) {
        const sectionCommands = {
            'section': 'h2',
            'subsection': 'h3',
            'subsubsection': 'h4',
            'paragraph': 'h5',
            'subparagraph': 'h6'
        };

        if (sectionCommands[command]) {
            const tag = sectionCommands[command];
            const sectionId = `section-${command}-${args.toLowerCase().replace(/\\s+/g, '-')}`;
            return `<${tag} id="${sectionId}" class="${command}">${args}</${tag}>`;
        }

        return super.renderCommand(command, args);
    }

    /**
     * Render article-specific environments
     */
    renderEnvironment(envName, content) {
        switch (envName) {
            case 'abstract':
                return `<div class="abstract">
                    <h2 class="abstract-title">Abstract</h2>
                    <div class="abstract-content">${content}</div>
                </div>`;
                
            case 'itemize':
                return this.processListEnvironment(content, 'ul');
                
            case 'enumerate':
                return this.processListEnvironment(content, 'ol');
                
            case 'description':
                return this.processDescriptionEnvironment(content);
                
            case 'figure':
                return this.processFigureEnvironment(content);
                
            case 'table':
                return this.processTableEnvironment(content);
                
            case 'equation':
                return `<div class="equation">
                    <div class="equation-content">${content}</div>
                </div>`;
                
            case 'code':
                return this.processCodeEnvironment(content);
                
            default:
                return super.renderEnvironment(envName, content);
        }
    }

    /**
     * Process list environments (itemize, enumerate)
     */
    processListEnvironment(content, listType) {
        const items = content.split('\\item').filter(item => item.trim());
        
        const listItems = items.map(item => {
            const trimmedItem = item.trim();
            if (trimmedItem) {
                return `<li>${trimmedItem}</li>`;
            }
            return '';
        }).filter(item => item);

        return `<${listType} class="list-${listType}">\n${listItems.join('\n')}\n</${listType}>`;
    }

    /**
     * Process description environment
     */
    processDescriptionEnvironment(content) {
        const items = content.split('\\item').filter(item => item.trim());
        
        const listItems = items.map(item => {
            const trimmedItem = item.trim();
            const match = trimmedItem.match(/^\\\[(.+?)\\\](.*)$/);
            if (match) {
                const term = match[1];
                const description = match[2].trim();
                return `<dt>${term}</dt>\n<dd>${description}</dd>`;
            }
            return `<dd>${trimmedItem}</dd>`;
        }).filter(item => item);

        return `<dl class="description-list">\n${listItems.join('\n')}\n</dl>`;
    }

    /**
     * Process figure environment
     */
    processFigureEnvironment(content) {
        const captionMatch = content.match(/\\caption\{([^}]+)\}/);
        const labelMatch = content.match(/\\label\{([^}]+)\}/);
        const centerMatch = content.includes('\\centering');
        
        const caption = captionMatch ? captionMatch[1] : '';
        const label = labelMatch ? labelMatch[1] : '';
        
        return `<figure class="article-figure ${centerMatch ? 'centered' : ''}">
            <div class="figure-content">
                ${this.extractIncludeGraphics(content)}
            </div>
            ${caption ? `<figcaption class="figure-caption">${caption}</figcaption>` : ''}
        </figure>`;
    }

    /**
     * Process table environment
     */
    processTableEnvironment(content) {
        const captionMatch = content.match(/\\caption\{([^}]+)\}/);
        const tabularMatch = content.match(/\\begin\{tabular\}([\s\S]*?)\\end\{tabular\}/);
        
        const caption = captionMatch ? captionMatch[1] : '';
        const tabularContent = tabularMatch ? tabularMatch[1] : content;
        
        return `<div class="article-table">
            ${caption ? `<div class="table-caption">${caption}</div>` : ''}
            <table class="table-content">
                ${this.processTabularContent(tabularContent)}
            </table>
        </div>`;
    }

    /**
     * Process tabular content
     */
    processTabularContent(content) {
        const rows = content.split('\\\\').filter(row => row.trim());
        
        return rows.map(row => {
            const cells = row.split('&').map(cell => cell.trim());
            const isHeader = rows.indexOf(row) === 0;
            const tag = isHeader ? 'th' : 'td';
            
            return `<tr>${cells.map(cell => `<${tag}>${cell}</${tag}>`).join('')}</tr>`;
        }).join('\n');
    }

    /**
     * Process code environment
     */
    processCodeEnvironment(content) {
        const context = {
            theme: 'default'
        };
        return this.codeParser.parseCustomCodeBlock(content, context);
    }

    /**
     * Extract \\includegraphics commands
     */
    extractIncludeGraphics(content) {
        const includeMatch = content.match(/\\includegraphics(\[.*?\])?\{([^}]+)\}/);
        if (includeMatch) {
            const options = includeMatch[1] || '';
            const filename = includeMatch[2];
            return `<img src="${filename}" alt="${filename}" class="included-image" ${this.parseGraphicsOptions(options)}>`;
        }
        return '<!-- Figure content -->';
    }

    /**
     * Parse graphics options for \\includegraphics
     */
    parseGraphicsOptions(options) {
        if (!options) return '';
        
        const widthMatch = options.match(/width=([^,\]]+)/);
        const heightMatch = options.match(/height=([^,\]]+)/);
        
        let style = '';
        if (widthMatch) style += `width: ${widthMatch[1]}; `;
        if (heightMatch) style += `height: ${heightMatch[1]}; `;
        
        return style ? `style="${style}"` : '';
    }
}

module.exports = ArticleRenderer;