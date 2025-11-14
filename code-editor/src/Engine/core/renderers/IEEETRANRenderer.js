/**
 * IEEEtran Document Renderer
 * Handles IEEE transaction paper class documents with strict formatting
 */

const DocumentRenderer = require('./DocumentRenderer');

class IEEETRANRenderer extends DocumentRenderer {
    constructor() {
        super();
        this.name = 'IEEEtran';
        this.displayName = 'IEEE Transactions';
        this.initializeSupportedCommands();
    }

    /**
     * Initialize supported LaTeX commands for IEEEtran class
     */
    initializeSupportedCommands() {
        // IEEE-specific commands
        this.addSupportedCommand('title');
        this.addSupportedCommand('author');
        this.addSupportedCommand('IEEEauthorblockN');
        this.addSupportedCommand('IEEEauthorblockA');
        this.addSupportedCommand('IEEEauthorrefmark');
        this.addSupportedCommand('IEEEmembership');
        this.addSupportedCommand('IEEEcompsoc');
        this.addSupportedCommand('IEEEcomputer society');
        
        // Sectioning commands (IEEE uses specific numbering)
        this.addSupportedCommand('section');
        this.addSupportedCommand('subsection');
        this.addSupportedCommand('subsubsection');
        this.addSupportedCommand('paragraph');
        this.addSupportedCommand('subparagraph');

        // Abstract and keywords
        this.addSupportedCommand('abstract');
        this.addSupportedCommand('IEEEkeywords');
        this.addSupportedCommand('begin');
        this.addSupportedCommand('end');

        // Text formatting
        this.addSupportedCommand('textbf');
        this.addSupportedCommand('textit');
        this.addSupportedCommand('texttt');
        this.addSupportedCommand('emph');
        this.addSupportedCommand('underline');

        // Mathematical environments
        this.addSupportedCommand('equation');
        this.addSupportedCommand('align');
        this.addSupportedCommand('IEEEeqnarray');
        this.addSupportedCommand('subequations');

        // Figure and table environments
        this.addSupportedCommand('figure');
        this.addSupportedCommand('table');
        this.addSupportedCommand('figure*');
        this.addSupportedCommand('table*');
        this.addSupportedCommand('caption');
        this.addSupportedCommand('label');

        // Bibliography
        this.addSupportedCommand('cite');
        this.addSupportedCommand('bibliography');
        this.addSupportedCommand('bibliographystyle');
        this.addSupportedCommand('IEEEbibitem');

        // Lists
        this.addSupportedCommand('itemize');
        this.addSupportedCommand('enumerate');
        this.addSupportedCommand('description');

        // Special IEEE commands
        this.addSupportedCommand('IEEEpubid');
        this.addSupportedCommand('IEEEmarkedcommand');
        this.addSupportedCommand('IEEEPARstart');
        this.addSupportedCommand('IEEEQED');
    }

    /**
     * Parse IEEEtran document structure
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
            throw new Error('IEEEtran document must have begin/end document environment');
        }

        let documentBody = documentMatch[1];
        
        // Process IEEE title block
        documentBody = this.processIEEETitleBlock(documentBody);
        
        // Process abstract
        documentBody = this.processIEEEAbstract(documentBody);
        
        // Process IEEE keywords
        documentBody = this.processIEEEKeywords(documentBody);
        
        // Process sections with IEEE numbering
        documentBody = this.processIEEESections(documentBody);
        
        // Process mathematical environments
        documentBody = this.processMathEnvironments(documentBody);
        
        // Process figure and table environments
        documentBody = this.processFigureTableEnvironments(documentBody);
        
        // Process list environments
        documentBody = this.processListEnvironments(documentBody);
        
        // Process citations
        documentBody = this.processCitations(documentBody);
        
        // Process inline commands
        documentBody = this.processCommands(documentBody);
        
        // Process paragraphs with IEEE formatting
        documentBody = this.processIEEEParagraphs(documentBody);
        
        return this.wrapInIEEELayout(documentBody);
    }

    /**
     * Process IEEE title block with author affiliations
     */
    processIEEETitleBlock(content) {
        let titleHTML = '';
        
        // Extract title
        const titleMatch = content.match(/\\title\{([^}]+)\}/);
        if (titleMatch) {
            titleHTML += `<h1 class="ieee-title">${titleMatch[1]}</h1>\n`;
        }
        
        // Process author blocks
        const authorBlocks = this.extractAuthorBlocks(content);
        if (authorBlocks.length > 0) {
            titleHTML += '<div class="ieee-authors">\n';
            authorBlocks.forEach(block => {
                titleHTML += `<div class="ieee-author-block">${block}</div>\n`;
            });
            titleHTML += '</div>\n';
        }
        
        // Remove original title and author commands
        content = content.replace(/\\title\{[^}]+\}\s*/g, '');
        content = content.replace(/\\author\{[^}]+\}\s*/g, '');
        content = content.replace(/\\IEEEauthorblockN\{[^}]+\}/g, '');
        content = content.replace(/\\IEEEauthorblockA\{[^}]+\}/g, '');
        content = content.replace(/\\IEEEauthorrefmark\{[^}]+\}/g, '');
        content = content.replace(/\\IEEEmembership\{[^}]+\}/g, '');
        
        return titleHTML + content;
    }

    /**
     * Extract and format IEEE author blocks
     */
    extractAuthorBlocks(content) {
        const authorBlocks = [];
        const authorNames = content.match(/\\IEEEauthorblockN\{([^}]+)\}/g) || [];
        const authorAffiliations = content.match(/\\IEEEauthorblockA\{([^}]+)\}/g) || [];
        
        authorNames.forEach((nameMatch, index) => {
            const name = nameMatch.match(/\\IEEEauthorblockN\{([^}]+)\}/)[1];
            const affiliation = authorAffiliations[index] ? 
                authorAffiliations[index].match(/\\IEEEauthorblockA\{([^}]+)\}/)[1] : '';
            
            authorBlocks.push(`<div class="ieee-author-name">${name}</div>
                <div class="ieee-author-affiliation">${affiliation}</div>`);
        });
        
        return authorBlocks;
    }

    /**
     * Process IEEE abstract
     */
    processIEEEAbstract(content) {
        const abstractMatch = content.match(/\\begin\{abstract\}([\s\S]*?)\\end\{abstract\}/);
        
        if (abstractMatch) {
            const abstractHTML = `<div class="ieee-abstract">
                <h2 class="ieee-abstract-title">Abstract</h2>
                <div class="ieee-abstract-content">
                    ${this.processParagraphText(abstractMatch[1])}
                </div>
            </div>\n`;
            
            return content.replace(abstractMatch[0], abstractHTML);
        }
        
        return content;
    }

    /**
     * Process IEEE keywords
     */
    processIEEEKeywords(content) {
        const keywordsMatch = content.match(/\\begin\{IEEEkeywords\}([\s\S]*?)\\end\{IEEEkeywords\}/);
        
        if (keywordsMatch) {
            const keywordsHTML = `<div class="ieee-keywords">
                <h3 class="ieee-keywords-title">Index Terms</h3>
                <div class="ieee-keywords-content">
                    ${keywordsMatch[1].trim()}
                </div>
            </div>\n`;
            
            return content.replace(keywordsMatch[0], keywordsHTML);
        }
        
        return content;
    }

    /**
     * Process IEEE sections with proper numbering
     */
    processIEEESections(content) {
        const sectionCommands = [
            { command: 'section', level: 1, tag: 'h2', class: 'ieee-section' },
            { command: 'subsection', level: 2, tag: 'h3', class: 'ieee-subsection' },
            { command: 'subsubsection', level: 3, tag: 'h4', class: 'ieee-subsubsection' },
            { command: 'paragraph', level: 4, tag: 'h5', class: 'ieee-paragraph' },
            { command: 'subparagraph', level: 5, tag: 'h6', class: 'ieee-subparagraph' }
        ];

        let processedContent = content;
        const sectionCounters = {};

        sectionCommands.forEach(({ command, level, tag, className }) => {
            sectionCounters[command] = 0;
            const pattern = new RegExp(`\\\\${command}\\{([^}]+)\\}`, 'g');
            
            processedContent = processedContent.replace(pattern, (match, title) => {
                sectionCounters[command]++;
                const sectionNumber = this.generateSectionNumber(command, sectionCounters, level);
                const sectionId = `ieee-section-${level}-${sectionCounters[command]}`;
                
                return `<${tag} id="${sectionId}" class="${className}">
                    <span class="ieee-section-number">${sectionNumber}</span>
                    <span class="ieee-section-title">${title}</span>
                </${tag}>\n`;
            });
        });

        return processedContent;
    }

    /**
     * Generate IEEE section numbers
     */
    generateSectionNumber(command, counters, level) {
        switch (command) {
            case 'section':
                return `${counters[command]}.`;
            case 'subsection':
                return `${counters.section}.${counters[command]}.`;
            case 'subsubsection':
                return `${counters.section}.${counters.subsection}.${counters[command]}.`;
            case 'paragraph':
                return `${counters.section}.${counters.subsection}.${counters.subsubsection}.${counters[command]}.`;
            case 'subparagraph':
                return `${counters.section}.${counters.subsection}.${counters.subsubsection}.${counters.paragraph}.${counters[command]}.`;
            default:
                return `${counters[command]}.`;
        }
    }

    /**
     * Process mathematical environments
     */
    processMathEnvironments(content) {
        // Process equation environments
        content = content.replace(/\\begin\{equation\}([\s\S]*?)\\end\{equation\}/g, (match, math) => {
            return `<div class="ieee-equation">
                <div class="equation-number">(${this.getEquationNumber(match)})</div>
                <div class="equation-content">${math}</div>
            </div>`;
        });

        // Process align environments
        content = content.replace(/\\begin\{align\}([\s\S]*?)\\end\{align\}/g, (match, math) => {
            return `<div class="ieee-align">
                ${this.processAlignContent(math)}
            </div>`;
        });

        // Process IEEEeqnarray environments
        content = content.replace(/\\begin\{IEEEeqnarray\}([\s\S]*?)\\end\{IEEEeqnarray\}/g, (match, math) => {
            return `<div class="ieee-eqnarray">
                ${this.processEqnArrayContent(math)}
            </div>`;
        });

        return content;
    }

    /**
     * Process align content with line numbers
     */
    processAlignContent(content) {
        const lines = content.split('\\\\').filter(line => line.trim());
        
        return lines.map((line, index) => {
            const lineNumber = this.getEquationNumber(`align-line-${index}`);
            return `<div class="align-line">
                <div class="align-number">(${lineNumber})</div>
                <div class="align-content">${line.trim()}</div>
            </div>`;
        }).join('\n');
    }

    /**
     * Process IEEEeqnarray content
     */
    processEqnArrayContent(content) {
        const lines = content.split('\\\\').filter(line => line.trim());
        
        return lines.map((line, index) => {
            const columns = line.split('&').map(col => col.trim());
            const lineNumber = this.getEquationNumber(`eqnarray-line-${index}`);
            
            return `<div class="eqnarray-row">
                <div class="eqnarray-number">(${lineNumber})</div>
                ${columns.map(col => `<div class="eqnarray-column">${col}</div>`).join('')}
            </div>`;
        }).join('\n');
    }

    /**
     * Get equation number
     */
    getEquationNumber(context) {
        // Simple counter - could be enhanced to track actual equation numbers
        const equations = this.content.match(/\\begin\{equation\}/g) || [];
        return equations.length + 1;
    }

    /**
     * Process figure and table environments
     */
    processFigureTableEnvironments(content) {
        // Process regular figures
        content = content.replace(/\\begin\{figure\}([\s\S]*?)\\end\{figure\}/g, (match, figContent) => {
            return this.processIEEEFigure(figContent, false);
        });

        // Process wide figures (figure*)
        content = content.replace(/\\begin\{figure\*\}([\s\S]*?)\\end\{figure\*\}/g, (match, figContent) => {
            return this.processIEEEFigure(figContent, true);
        });

        // Process regular tables
        content = content.replace(/\\begin\{table\}([\s\S]*?)\\end\{table\}/g, (match, tableContent) => {
            return this.processIEEETable(tableContent, false);
        });

        // Process wide tables (table*)
        content = content.replace(/\\begin\{table\*\}([\s\S]*?)\\end\{table\*\}/g, (match, tableContent) => {
            return this.processIEEETable(tableContent, true);
        });

        return content;
    }

    /**
     * Process IEEE figure
     */
    processIEEEFigure(content, isWide) {
        const captionMatch = content.match(/\\caption\{([^}]+)\}/);
        const labelMatch = content.match(/\\label\{([^}]+)\}/);
        const centerMatch = content.includes('\\centering');
        const includeGraphicsMatch = content.match(/\\includegraphics(\[.*?\])?\{([^}]+)\}/);
        
        const caption = captionMatch ? captionMatch[1] : '';
        const label = labelMatch ? labelMatch[1] : '';
        const imageSrc = includeGraphicsMatch ? includeGraphicsMatch[2] : '';
        const imageOptions = includeGraphicsMatch ? includeGraphicsMatch[1] : '';
        
        return `<figure class="ieee-figure ${isWide ? 'ieee-figure-wide' : ''} ${centerMatch ? 'ieee-figure-centered' : ''}">
            <div class="ieee-figure-content">
                ${imageSrc ? `<img src="${imageSrc}" alt="${caption}" class="ieee-figure-image" ${this.parseGraphicsOptions(imageOptions)} />` : '<!-- Figure content -->'}
            </div>
            ${caption ? `<figcaption class="ieee-figure-caption">
                <span class="figure-label">Fig. ${this.getFigureNumber()}.</span> ${caption}
            </figcaption>` : ''}
        </figure>`;
    }

    /**
     * Process IEEE table
     */
    processIEEETable(content, isWide) {
        const captionMatch = content.match(/\\caption\{([^}]+)\}/);
        const labelMatch = content.match(/\\label\{([^}]+)\}/);
        const tabularMatch = content.match(/\\begin\{tabular\}\{([^}]+)\}([\s\S]*?)\\end\{tabular\}/);
        
        const caption = captionMatch ? captionMatch[1] : '';
        const label = labelMatch ? labelMatch[1] : '';
        const tabularContent = tabularMatch ? tabularMatch[2] : content;
        
        return `<div class="ieee-table ${isWide ? 'ieee-table-wide' : ''}">
            ${caption ? `<div class="ieee-table-caption">
                <span class="table-label">Table ${this.getTableNumber()}.</span> ${caption}
            </div>` : ''}
            <table class="ieee-table-content">
                ${this.processTabularContent(tabularContent)}
            </table>
        </div>`;
    }

    /**
     * Process tabular content
     */
    processTabularContent(content) {
        const rows = content.split('\\\\').filter(row => row.trim());
        
        return rows.map((row, index) => {
            const cells = row.split('&').map(cell => cell.trim());
            const isHeader = index === 0;
            const tag = isHeader ? 'th' : 'td';
            
            return `<tr class="table-row ${isHeader ? 'table-header' : 'table-data'}">
                ${cells.map(cell => `<${tag} class="table-cell">${cell}</${tag}>`).join('')}
            </tr>`;
        }).join('\n');
    }

    /**
     * Get figure number
     */
    getFigureNumber() {
        const figures = this.content.match(/\\begin\{figure\}/g) || [];
        const wideFigures = this.content.match(/\\begin\{figure\*\}/g) || [];
        return figures.length + wideFigures.length + 1;
    }

    /**
     * Get table number
     */
    getTableNumber() {
        const tables = this.content.match(/\\begin\{table\}/g) || [];
        const wideTables = this.content.match(/\\begin\{table\*\}/g) || [];
        return tables.length + wideTables.length + 1;
    }

    /**
     * Process list environments
     */
    processListEnvironments(content) {
        // Process itemize
        content = content.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (match, listContent) => {
            return this.processListContent(listContent, 'ul', 'itemize');
        });

        // Process enumerate
        content = content.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, (match, listContent) => {
            return this.processListContent(listContent, 'ol', 'enumerate');
        });

        // Process description
        content = content.replace(/\\begin\{description\}([\s\S]*?)\\end\{description\}/g, (match, listContent) => {
            return this.processDescriptionList(listContent);
        });

        return content;
    }

    /**
     * Process list content
     */
    processListContent(content, listType, className) {
        const items = content.split('\\item').filter(item => item.trim());
        
        const listItems = items.map(item => {
            const trimmedItem = item.trim();
            if (trimmedItem) {
                return `<li class="ieee-list-item">${this.processParagraphText(trimmedItem)}</li>`;
            }
            return '';
        }).filter(item => item);

        return `<${listType} class="ieee-list ieee-list-${className}">
            ${listItems.join('\n')}
        </${listType}>`;
    }

    /**
     * Process description list
     */
    processDescriptionList(content) {
        const items = content.split('\\item').filter(item => item.trim());
        
        const listItems = items.map(item => {
            const trimmedItem = item.trim();
            const match = trimmedItem.match(/^\\\[(.+?)\\\](.*)$/);
            if (match) {
                const term = match[1];
                const description = match[2].trim();
                return `<dt class="ieee-description-term">${term}</dt>
                    <dd class="ieee-description-desc">${this.processParagraphText(description)}</dd>`;
            }
            return `<dd class="ieee-description-desc">${this.processParagraphText(trimmedItem)}</dd>`;
        }).filter(item => item);

        return `<dl class="ieee-description-list">
            ${listItems.join('\n')}
        </dl>`;
    }

    /**
     * Process citations
     */
    processCitations(content) {
        // Process \cite commands
        content = content.replace(/\\cite\{([^}]+)\}/g, (match, keys) => {
            const citations = keys.split(',').map(key => key.trim());
            return `<sup class="ieee-citation">[${citations.join(', ')}]</sup>`;
        });

        return content;
    }

    /**
     * Process paragraph text with IEEE formatting
     */
    processParagraphText(text) {
        // Handle line breaks within paragraphs
        return text.replace(/\\\\/g, '<br class="ieee-line-break">');
    }

    /**
     * Process IEEE paragraphs
     */
    processIEEEParagraphs(content) {
        const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim());
        
        return paragraphs.map(paragraph => {
            const trimmed = paragraph.trim();
            
            // Skip if this looks like a section header or environment
            if (trimmed.startsWith('<h') || trimmed.startsWith('<div class="')) {
                return trimmed;
            }
            
            // Process text formatting commands
            let processedParagraph = trimmed;
            processedParagraph = processedParagraph.replace(/\\textbf\{([^}]+)\}/g, '<strong class="ieee-textbf">$1</strong>');
            processedParagraph = processedParagraph.replace(/\\textit\{([^}]+)\}/g, '<em class="ieee-textit">$1</em>');
            processedParagraph = processedParagraph.replace(/\\texttt\{([^}]+)\}/g, '<code class="ieee-texttt">$1</code>');
            processedParagraph = processedParagraph.replace(/\\emph\{([^}]+)\}/g, '<em class="ieee-emph">$1</em>');
            processedParagraph = processedParagraph.replace(/\\underline\{([^}]+)\}/g, '<span class="ieee-underline">$1</span>');
            
            // Handle IEEE paragraph start (no indentation)
            if (processedParagraph.includes('\\IEEEPARstart')) {
                processedParagraph = processedParagraph.replace(/\\IEEEPARstart\s*/, '');
                return `<p class="ieee-paragraph ieee-paragraph-noindent">${processedParagraph}</p>`;
            }
            
            return `<p class="ieee-paragraph">${processedParagraph}</p>`;
        }).join('\n\n');
    }

    /**
     * Wrap content in IEEE layout
     */
    wrapInIEEELayout(content) {
        return `<div class="ieee-document">
            <div class="ieee-paper-content">
                ${content}
            </div>
        </div>`;
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
}

module.exports = IEEETRANRenderer;