/**
 * Book Document Renderer
 * Handles LaTeX book class documents with part and chapter support
 */

const DocumentRenderer = require('./DocumentRenderer');

class BookRenderer extends DocumentRenderer {
    constructor() {
        super();
        this.name = 'book';
        this.displayName = 'Book';
        this.initializeSupportedCommands();
    }

    /**
     * Initialize supported LaTeX commands for book class
     */
    initializeSupportedCommands() {
        // Inherit report commands and add book-specific ones
        this.initializeBookCommands();
        
        // Book-specific commands
        this.addSupportedCommand('frontmatter');
        this.addSupportedCommand('mainmatter');
        this.addSupportedCommand('backmatter');
        this.addSupportedCommand('appendix');
        this.addSupportedCommand('bibliography');
        this.addSupportedCommand('index');
        this.addSupportedCommand('glossary');
        this.addSupportedCommand('printindex');
    }

    /**
     * Initialize book commands
     */
    initializeBookCommands() {
        // Sectioning commands
        this.addSupportedCommand('part');
        this.addSupportedCommand('chapter');
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
        this.addSupportedCommand('titlepage');
        this.addSupportedCommand('thanks');

        // Bibliography
        this.addSupportedCommand('cite');
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
    }

    /**
     * Parse book document structure
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
            throw new Error('Book document must have begin/end document environment');
        }

        let documentBody = documentMatch[1];
        
        // Process book matter divisions
        documentBody = this.processBookMatter(documentBody);
        
        // Process parts
        documentBody = this.processParts(documentBody);
        
        // Process chapters
        documentBody = this.processChapters(documentBody);
        
        // Process sections
        documentBody = this.processSections(documentBody);
        
        // Process title page
        documentBody = this.processTitlePage(documentBody);
        
        // Process table of contents
        documentBody = this.processTableOfContents(documentBody);
        
        // Process standard environments
        documentBody = this.processEnvironment(documentBody, 'abstract');
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
     * Process book matter divisions (frontmatter, mainmatter, backmatter)
     */
    processBookMatter(content) {
        let processedContent = content;
        
        // Process frontmatter
        processedContent = processedContent.replace(
            /\\frontmatter\s*/g,
            '<div class="book-matter frontmatter">\n'
        );
        
        // Process mainmatter
        processedContent = processedContent.replace(
            /\\mainmatter\s*/g,
            '</div>\n<div class="book-matter mainmatter">\n'
        );
        
        // Process backmatter
        processedContent = processedContent.replace(
            /\\backmatter\s*/g,
            '</div>\n<div class="book-matter backmatter">\n'
        );
        
        // Close matter sections
        processedContent += '</div>\n';
        
        return processedContent;
    }

    /**
     * Process parts in book
     */
    processParts(content) {
        const partPattern = /\\part(\[([^\]]+)\])?\{([^}]+)\}/g;
        
        return content.replace(partPattern, (match, optionalTitle, shortTitle, fullTitle) => {
            const title = fullTitle;
            const partId = `part-${title.toLowerCase().replace(/\\s+/g, '-')}`;
            
            return `<div class="book-part" id="${partId}">
                <div class="part-title-page">
                    <h1 class="part-title">Part ${this.getPartNumber(match)}</h1>
                    <h2 class="part-subtitle">${title}</h2>
                </div>
            </div>\n`;
        });
    }

    /**
     * Get part number from document
     */
    getPartNumber(partMatch) {
        const parts = this.content.match(/\\part\{([^}]+)\}/g) || [];
        const currentIndex = parts.findIndex(part => part === partMatch);
        return currentIndex + 1;
    }

    /**
     * Process chapters in book
     */
    processChapters(content) {
        const chapterPattern = /\\chapter(\[([^\]]+)\])?\{([^}]+)\}/g;
        
        return content.replace(chapterPattern, (match, optionalTitle, shortTitle, fullTitle) => {
            const title = fullTitle;
            const chapterId = `chapter-${title.toLowerCase().replace(/\\s+/g, '-')}`;
            const chapterNumber = this.getChapterNumber(match);
            
            return `<div class="book-chapter" id="${chapterId}">
                <div class="chapter-title-page">
                    <h1 class="chapter-number">Chapter ${chapterNumber}</h1>
                    <h2 class="chapter-title">${title}</h2>
                </div>
            </div>\n`;
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
            { command: 'section', level: 1, tag: 'h3' },
            { command: 'subsection', level: 2, tag: 'h4' },
            { command: 'subsubsection', level: 3, tag: 'h5' },
            { command: 'paragraph', level: 4, tag: 'h6' },
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
     * Process title page for book
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
     * Generate comprehensive table of contents
     */
    generateTableOfContents() {
        const parts = this.content.match(/\\part\{([^}]+)\}/g) || [];
        const chapters = this.content.match(/\\chapter\{([^}]+)\}/g) || [];
        const sections = this.content.match(/\\section\{([^}]+)\}/g) || [];
        const subsections = this.content.match(/\\subsection\{([^}]+)\}/g) || [];
        
        let tocHTML = '<div class="table-of-contents">\n';
        tocHTML += '<h2 class="toc-title">Table of Contents</h2>\n';
        tocHTML += '<div class="toc-content">\n';
        
        // Add parts
        parts.forEach(part => {
            const title = part.match(/\\part\{([^}]+)\}/)[1];
            const id = `part-${title.toLowerCase().replace(/\\s+/g, '-')}`;
            tocHTML += `<div class="toc-item toc-part"><a href="#${id}">Part ${this.getPartNumber(part)}: ${title}</a></div>\n`;
        });
        
        // Add chapters
        chapters.forEach(chapter => {
            const title = chapter.match(/\\chapter\{([^}]+)\}/)[1];
            const id = `chapter-${title.toLowerCase().replace(/\\s+/g, '-')}`;
            tocHTML += `<div class="toc-item toc-chapter"><a href="#${id}">Chapter ${this.getChapterNumber(chapter)}: ${title}</a></div>\n`;
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
     * Render book-specific commands
     */
    renderCommand(command, args) {
        switch (command) {
            case 'part':
                const partId = `part-${args.toLowerCase().replace(/\\s+/g, '-')}`;
                return `<div class="book-part" id="${partId}">
                    <h1 class="part-title">${args}</h1>
                </div>`;
                
            case 'chapter':
                const chapterId = `chapter-${args.toLowerCase().replace(/\\s+/g, '-')}`;
                return `<div class="book-chapter" id="${chapterId}">
                    <h1 class="chapter-title">${args}</h1>
                </div>`;
                
            default:
                // Use section processing for other commands
                const sectionCommands = {
                    'section': 'h3',
                    'subsection': 'h4',
                    'subsubsection': 'h5',
                    'paragraph': 'h6',
                    'subparagraph': 'h6'
                };

                if (sectionCommands[command]) {
                    const tag = sectionCommands[command];
                    const sectionId = `section-${command}-${args.toLowerCase().replace(/\\s+/g, '-')}`;
                    return `<${tag} id="${sectionId}" class="${command}">${args}</${tag}>`;
                }

                return super.renderCommand(command, args);
        }
    }

    /**
     * Render book-specific environments
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
                return this.processStandardEnvironment(envName, content);
        }
    }

    /**
     * Process standard environments
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
     * Process list environments
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
        
        return `<figure class="book-figure ${centerMatch ? 'centered' : ''}">
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
        
        return `<div class="book-table">
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
     * Parse graphics options
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
     * Process paragraphs
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

module.exports = BookRenderer;