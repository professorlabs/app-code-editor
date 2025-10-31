/**
 * Report Document Renderer
 * Handles LaTeX report class documents with chapter support
 */

const DocumentRenderer = require('./DocumentRenderer');

class ReportRenderer extends DocumentRenderer {
    constructor() {
        super();
        this.name = 'report';
        this.displayName = 'Report';
        this.initializeSupportedCommands();
    }

    /**
     * Initialize supported LaTeX commands for report class
     */
    initializeSupportedCommands() {
        // Inherit article commands
        this.initializeArticleCommands();
        
        // Report-specific commands
        this.addSupportedCommand('chapter');
        this.addSupportedCommand('part');
        
        // Title page commands
        this.addSupportedCommand('titlepage');
        this.addSupportedCommand('thanks');
        
        // Report-specific environments
        this.addSupportedCommand('titlepage');
    }

    /**
     * Initialize article commands (inherit from article)
     */
    initializeArticleCommands() {
        // Sectioning commands (excluding chapter which is handled separately)
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

        // Appendix
        this.addSupportedCommand('appendix');
    }

    /**
     * Parse report document structure
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
            throw new Error('Report document must have begin/end document environment');
        }

        let documentBody = documentMatch[1];
        
        // Process title page
        documentBody = this.processTitlePage(documentBody);
        
        // Process table of contents
        documentBody = this.processTableOfContents(documentBody);
        
        // Process chapters
        documentBody = this.processChapters(documentBody);
        
        // Process sections (within chapters)
        documentBody = this.processSections(documentBody);
        
        // Process abstract
        documentBody = this.processEnvironment(documentBody, 'abstract');
        
        // Process standard environments
        documentBody = this.processEnvironment(documentBody, 'itemize');
        documentBody = this.processEnvironment(documentBody, 'enumerate');
        documentBody = this.processEnvironment(documentBody, 'description');
        documentBody = this.processEnvironment(documentBody, 'figure');
        documentBody = this.processEnvironment(documentBody, 'table');
        documentBody = this.processEnvironment(documentBody, 'equation');
        
        // Process inline commands
        documentBody = this.processCommands(documentBody);
        
        // Process paragraphs
        documentBody = this.processParagraphs(documentBody);
        
        return documentBody;
    }

    /**
     * Process title page for report
     */
    processTitlePage(content) {
        const titlePageMatch = content.match(/\\begin\{titlepage\}([\s\S]*?)\\end\{titlepage\}/);
        
        if (titlePageMatch) {
            const titlePageContent = titlePageMatch[1];
            const processedTitlePage = this.processTitlePageContent(titlePageContent);
            return content.replace(titlePageMatch[0], processedTitlePage);
        }
        
        // Fallback to \maketitle if no titlepage environment
        return this.processTitleBlock(content);
    }

    /**
     * Process title page content
     */
    processTitlePageContent(content) {
        let titlePageHTML = '<div class="title-page">\n';
        
        // Extract title
        const titleMatch = content.match(/\\title\{([^}]+)\}/);
        if (titleMatch) {
            titlePageHTML += `<h1 class="title-page-title">${titleMatch[1]}</h1>\n`;
        }
        
        // Extract author
        const authorMatch = content.match(/\\author\{([^}]+)\}/);
        if (authorMatch) {
            titlePageHTML += `<div class="title-page-author">${authorMatch[1]}</div>\n`;
        }
        
        // Extract date
        const dateMatch = content.match(/\\date\{([^}]+)\}/);
        if (dateMatch) {
            titlePageHTML += `<div class="title-page-date">${dateMatch[1]}</div>\n`;
        }
        
        // Process thanks
        content = content.replace(/\\thanks\{([^}]+)\}/g, '<div class="thanks">$1</div>');
        
        titlePageHTML += '</div>\n\n';
        
        return titlePageHTML;
    }

    /**
     * Process table of contents
     */
    processTableOfContents(content) {
        const tocMatch = content.match(/\\tableofcontents\s*/);
        
        if (tocMatch) {
            const tocHTML = this.generateTableOfContents();
            return content.replace(tocMatch[0], tocHTML);
        }
        
        return content;
    }

    /**
     * Generate table of contents from document structure
     */
    generateTableOfContents() {
        const chapters = this.content.match(/\\chapter\{([^}]+)\}/g) || [];
        const sections = this.content.match(/\\section\{([^}]+)\}/g) || [];
        const subsections = this.content.match(/\\subsection\{([^}]+)\}/g) || [];
        
        let tocHTML = '<div class="table-of-contents">\n';
        tocHTML += '<h2 class="toc-title">Table of Contents</h2>\n';
        tocHTML += '<div class="toc-content">\n';
        
        // Add chapters
        chapters.forEach(chapter => {
            const title = chapter.match(/\\chapter\{([^}]+)\}/)[1];
            const id = `chapter-${title.toLowerCase().replace(/\\s+/g, '-')}`;
            tocHTML += `<div class="toc-item toc-chapter"><a href="#${id}">${title}</a></div>\n`;
        });
        
        // Add sections
        sections.forEach(section => {
            const title = section.match(/\\section\{([^}]+)\}/)[1];
            const id = `section-${title.toLowerCase().replace(/\\s+/g, '-')}`;
            tocHTML += `<div class="toc-item toc-section"><a href="#${id}">${title}</a></div>\n`;
        });
        
        // Add subsections
        subsections.forEach(subsection => {
            const title = subsection.match(/\\subsection\{([^}]+)\}/)[1];
            const id = `subsection-${title.toLowerCase().replace(/\\s+/g, '-')}`;
            tocHTML += `<div class="toc-item toc-subsection"><a href="#${id}">${title}</a></div>\n`;
        });
        
        tocHTML += '</div>\n</div>\n\n';
        
        return tocHTML;
    }

    /**
     * Process chapters in report
     */
    processChapters(content) {
        const chapterPattern = /\\chapter(\[([^\]]+)\])?\{([^}]+)\}/g;
        
        return content.replace(chapterPattern, (match, optionalTitle, shortTitle, fullTitle) => {
            const title = fullTitle;
            const chapterId = `chapter-${title.toLowerCase().replace(/\\s+/g, '-')}`;
            
            return `<h1 id="${chapterId}" class="chapter">
                <span class="chapter-number">Chapter ${this.getChapterNumber(match)}</span>
                <span class="chapter-title">${title}</span>
            </h1>\n`;
        });
    }

    /**
     * Get chapter number from document
     */
    getChapterNumber(chapterMatch) {
        const chapters = this.content.match(/\\chapter\{([^}]+)\}/g) || [];
        const currentIndex = chapters.findIndex(ch => ch === chapterMatch);
        return currentIndex + 1;
    }

    /**
     * Process sections (within chapters)
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
     * Render chapter command
     */
    renderCommand(command, args) {
        if (command === 'chapter') {
            const chapterId = `chapter-${args.toLowerCase().replace(/\\s+/g, '-')}`;
            return `<h1 id="${chapterId}" class="chapter">${args}</h1>`;
        }

        if (command === 'part') {
            const partId = `part-${args.toLowerCase().replace(/\\s+/g, '-')}`;
            return `<div class="part" id="${partId}">
                <h1 class="part-title">${args}</h1>
            </div>`;
        }

        // Fall back to section processing
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
     * Render report-specific environments
     */
    renderEnvironment(envName, content) {
        switch (envName) {
            case 'titlepage':
                return `<div class="title-page">
                    ${this.processTitlePageContent(content)}
                </div>`;
                
            case 'abstract':
                return `<div class="abstract">
                    <h2 class="abstract-title">Abstract</h2>
                    <div class="abstract-content">${content}</div>
                </div>`;
                
            default:
                // Use article renderer logic for other environments
                return this.processStandardEnvironment(envName, content);
        }
    }

    /**
     * Process standard environments (reuse article logic)
     */
    processStandardEnvironment(envName, content) {
        switch (envName) {
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
        
        return `<figure class="report-figure ${centerMatch ? 'centered' : ''}">
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
        
        return `<div class="report-table">
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

    /**
     * Process paragraphs (inherited from article logic)
     */
    processParagraphs(content) {
        const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());
        
        return paragraphs.map(paragraph => {
            const trimmed = paragraph.trim();
            
            if (trimmed.startsWith('<h') || trimmed.startsWith('<div class="')) {
                return trimmed;
            }
            
            if (!trimmed.includes('<') && !trimmed.includes('\\')) {
                return `<p>${trimmed}</p>`;
            }
            
            return trimmed;
        }).join('\n\n');
    }
}

module.exports = ReportRenderer;