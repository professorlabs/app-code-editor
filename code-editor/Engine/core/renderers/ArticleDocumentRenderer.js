/**
 * Article Document Renderer
 * Specialized renderer for LaTeX article documents
 * Handles sections, figures, tables, and article structure
 */

const BaseDocumentRenderer = require('./BaseDocumentRenderer');

class ArticleDocumentRenderer extends BaseDocumentRenderer {
    constructor() {
        super();
        this.name = 'article';
        this.displayName = 'Article Document Renderer';
        
        this.initializeArticleCommands();
    }

    /**
     * Initialize article-specific LaTeX commands
     */
    initializeArticleCommands() {
        const articleCommands = [
            // Document structure
            'section', 'subsection', 'subsubsection', 'paragraph', 'subparagraph',
            
            // Title elements
            'title', 'author', 'date', 'maketitle',
            
            // Abstract
            'abstract',
            
            // Typography
            'textbf', 'textit', 'texttt', 'emph', 'underline',
            'textsc', 'textsf', 'textrm', 'textmd', 'textup', 'textsl',
            
            // Size commands
            'tiny', 'scriptsize', 'footnotesize', 'small', 'normalsize',
            'large', 'Large', 'LARGE', 'huge', 'Huge',
            
            // Spacing and layout
            'newpage', 'vspace', 'hspace', 'bigskip', 'medskip', 'smallskip',
            'newline', 'linebreak', 'nolinebreak', 'par',
            'noindent', 'indent', 'raggedright', 'raggedleft', 'centering',
            
            // Lists
            'itemize', 'enumerate', 'description', 'list', 'item',
            
            // Floats
            'figure', 'table', 'tabular', 'caption', 'label',
            'includegraphics', 'graphicspath',
            
            // Mathematics
            'equation', 'equation*', 'align', 'align*',
            'frac', 'sqrt', 'int', 'sum', 'prod', 'lim',
            
            // Bibliography
            'bibliography', 'bibliographystyle', 'cite',
            'thebibliography'
        ];

        articleCommands.forEach(cmd => this.addSupportedCommand(cmd));
    }

    /**
     * Parse article document structure
     */
    parseDocument() {
        this.validateDocument();
        
        let processedContent = this.content;
        
        // Process document in logical order
        processedContent = this.processTitleBlock(processedContent);
        processedContent = this.processAbstract(processedContent);
        processedContent = this.processSections(processedContent);
        processedContent = this.processEnvironments(processedContent);
        processedContent = this.processFormatting(processedContent);
        
        // Wrap in article layout
        return this.wrapInArticleLayout(processedContent);
    }

    /**
     * Process title block
     */
    processTitleBlock(content) {
        const titleMatch = content.match(/\\title\{([^}]+)\}/);
        const authorMatch = content.match(/\\author\{([^}]+)\}/);
        const dateMatch = content.match(/\\date\{([^}]+)\}/);
        
        if (titleMatch && content.includes('\\maketitle')) {
            const title = titleMatch[1];
            const author = authorMatch ? authorMatch[1] : '';
            const date = dateMatch ? this.processDate(dateMatch[1]) : new Date().toLocaleDateString();
            
            const titleHTML = `
                <div class="article-title-page">
                    <h1 class="article-title">${title}</h1>
                    ${author ? `<div class="article-author">${author}</div>` : ''}
                    <div class="article-date">${date}</div>
                </div>
            `;
            
            return content.replace(/\\maketitle/, titleHTML);
        }
        
        return content;
    }

    /**
     * Process abstract
     */
    processAbstract(content) {
        const abstractMatch = content.match(/\\begin\{abstract\}([\s\S]*?)\\end\{abstract\}/);
        
        if (abstractMatch) {
            const abstractHTML = `
                <div class="article-abstract">
                    <h2 class="abstract-title">Abstract</h2>
                    <div class="abstract-content">${this.processFormatting(abstractMatch[1])}</div>
                </div>
            `;
            
            return content.replace(abstractMatch[0], abstractHTML);
        }
        
        return content;
    }

    /**
     * Process sections
     */
    processSections(content) {
        const sectionCommands = [
            { command: 'section', level: 1, tag: 'h2' },
            { command: 'subsection', level: 2, tag: 'h3' },
            { command: 'subsubsection', level: 3, tag: 'h4' },
            { command: 'paragraph', level: 4, tag: 'h5' },
            { command: 'subparagraph', level: 5, tag: 'h6' }
        ];

        let processed = content;
        let sectionCounter = { section: 0, subsection: 0, subsubsection: 0 };
        
        sectionCommands.forEach(({ command, level, tag }) => {
            const pattern = new RegExp(`\\\\${command}\\{([^}]+)\\}`, 'g');
            processed = processed.replace(pattern, (match, title) => {
                sectionCounter[command] = (sectionCounter[command] || 0) + 1;
                const sectionNumber = sectionCounter[command];
                const sectionId = `${command}-${sectionNumber}`;
                
                return `<${tag} id="${sectionId}" class="${command}">
                    ${level <= 2 ? `${sectionNumber}. ` : ''}
                    ${this.processFormatting(title)}
                    <a href="#${sectionId}" class="section-anchor">Link</a>
                </${tag}>`;
            });
        });

        return processed;
    }

    /**
     * Process LaTeX environments
     */
    processEnvironments(content) {
        const environments = {
            'itemize': this.processItemList.bind(this),
            'enumerate': this.processNumberedList.bind(this),
            'description': this.processDescriptionList.bind(this),
            'figure': this.processFigure.bind(this),
            'table': this.processTable.bind(this),
            'equation': this.processEquation.bind(this),
            'thebibliography': this.processBibliography.bind(this)
        };

        let processed = content;
        
        Object.entries(environments).forEach(([env, processor]) => {
            processed = this.processEnvironment(processed, env, processor);
        });

        return processed;
    }

    /**
     * Process specific environment
     */
    processEnvironment(content, envName, processor) {
        const pattern = new RegExp(`\\\\begin\\{${envName}\\}([\\s\\S]*?)\\\\end\\{${envName}\\}`, 'g');
        
        return content.replace(pattern, (match, envContent) => {
            return processor(envContent.trim());
        });
    }

    /**
     * Process item list
     */
    processItemList(content) {
        const items = content.split('\\item').filter(item => item.trim());
        const listItems = items.map(item => `<li>${this.processFormatting(item.trim())}</li>`).join('\n');
        return `<ul class="item-list">${listItems}</ul>`;
    }

    /**
     * Process numbered list
     */
    processNumberedList(content) {
        const items = content.split('\\item').filter(item => item.trim());
        const listItems = items.map(item => `<li>${this.processFormatting(item.trim())}</li>`).join('\n');
        return `<ol class="numbered-list">${listItems}</ol>`;
    }

    /**
     * Process description list
     */
    processDescriptionList(content) {
        const items = content.split('\\item').filter(item => item.trim());
        const listItems = items.map(item => {
            const match = item.match(/^\\[(.+?)\\](.*)$/);
            if (match) {
                return `<dt>${match[1]}</dt><dd>${this.processFormatting(match[2].trim())}</dd>`;
            }
            return `<dd>${this.processFormatting(item)}</dd>`;
        }).join('\n');
        return `<dl class="description-list">${listItems}</dl>`;
    }

    /**
     * Process figure environment
     */
    processFigure(content) {
        const captionMatch = content.match(/\\caption\{([^}]+)\}/);
        const caption = captionMatch ? captionMatch[1] : '';
        
        return `<div class="figure">
            <div class="figure-content">
                ${this.extractGraphics(content) || '<!-- Figure content -->'}
            </div>
            ${caption ? `<figcaption>${this.processFormatting(caption)}</figcaption>` : ''}
        </div>`;
    }

    /**
     * Process table environment
     */
    processTable(content) {
        const captionMatch = content.match(/\\caption\{([^}]+)\}/);
        const tabularMatch = content.match(/\\begin\{tabular\}([\s\S]*?)\\end\{tabular\}/);
        
        const caption = captionMatch ? captionMatch[1] : '';
        const tabularContent = tabularMatch ? this.processTabular(tabularMatch[1]) : '';
        
        return `<div class="table">
            ${caption ? `<div class="table-caption">${this.processFormatting(caption)}</div>` : ''}
            <table class="table-content">${tabularContent}</table>
        </div>`;
    }

    /**
     * Process tabular content
     */
    processTabular(content) {
        const rows = content.split('\\\\').filter(row => row.trim());
        
        return rows.map((row, index) => {
            const cells = row.split('&').map(cell => cell.trim());
            const isHeader = index === 0;
            const tag = isHeader ? 'th' : 'td';
            
            return `<tr>${cells.map(cell => `<${tag}>${this.processFormatting(cell)}</${tag}>`).join('')}</tr>`;
        }).join('\n');
    }

    /**
     * Process equation environment
     */
    processEquation(content) {
        return `<div class="equation">
            <div class="equation-content">${this.processFormatting(content)}</div>
        </div>`;
    }

    /**
     * Process bibliography
     */
    processBibliography(content) {
        const items = content.split('\\bibitem').filter(item => item.trim());
        const bibItems = items.map((item, index) => {
            const keyMatch = item.match(/^\\[(.+?)\\]/);
            const key = keyMatch ? keyMatch[1] : '';
            const text = keyMatch ? item.substring(keyMatch[0].length).trim() : item;
            
            return `<div class="bib-item" id="bib-${key}">
                <span class="bib-key">[${index + 1}]</span>
                <span class="bib-text">${this.processFormatting(text)}</span>
            </div>`;
        }).join('\n');
        
        return `<div class="bibliography">
            <h2 class="bibliography-title">References</h2>
            <div class="bibliography-content">${bibItems}</div>
        </div>`;
    }

    /**
     * Extract graphics commands
     */
    extractGraphics(content) {
        const includeMatch = content.match(/\\includegraphics(\[.*?\])?\{([^}]+)\}/);
        if (includeMatch) {
            const filename = includeMatch[2];
            return `<img src="${filename}" alt="${filename}" class="figure-image" />`;
        }
        return null;
    }

    /**
     * Process text formatting
     */
    processFormatting(content) {
        let processed = content;
        
        // Bold text
        processed = processed.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>');
        
        // Italic text
        processed = processed.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>');
        
        // Monospace text
        processed = processed.replace(/\\texttt\{([^}]+)\}/g, '<code>$1</code>');
        
        // Emphasis
        processed = processed.replace(/\\emph\{([^}]+)\}/g, '<em>$1</em>');
        
        // Underline
        processed = processed.replace(/\\underline\{([^}]+)\}/g, '<u>$1</u>');
        
        // Small caps
        processed = processed.replace(/\\textsc\{([^}]+)\}/g, '<span class="small-caps">$1</span>');
        
        // Sans serif
        processed = processed.replace(/\\textsf\{([^}]+)\}/g, '<span class="sans-serif">$1</span>');
        
        // Roman font
        processed = processed.replace(/\\textrm\{([^}]+)\}/g, '<span class="roman">$1</span>');
        
        // Handle citations
        processed = processed.replace(/\\cite\{([^}]+)\}/g, '<span class="citation">[$1]</span>');
        
        // Handle references
        processed = processed.replace(/\\ref\{([^}]+)\}/g, '<a href="#$1" class="cross-ref">$1</a>');
        
        // Handle line breaks
        processed = processed.replace(/\\\\/g, '<br />');
        
        return processed;
    }

    /**
     * Process date commands
     */
    processDate(dateText) {
        if (dateText.includes('\\today')) {
            return new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        return dateText;
    }

    /**
     * Wrap content in article layout
     */
    wrapInArticleLayout(content) {
        return `<div class="article-container">
            <main class="article-main">
                ${content}
            </main>
        </div>`;
    }
}

module.exports = ArticleDocumentRenderer;