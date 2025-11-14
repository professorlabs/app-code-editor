/**
 * Book Document Renderer
 * Specialized renderer for LaTeX book documents
 * Handles chapters, parts, table of contents, and book structure
 */

const BaseDocumentRenderer = require('./BaseDocumentRenderer');
const BookStructureParser = require('../parsers/BookStructureParser');
const BookNavigationBuilder = require('../components/BookNavigationBuilder');
const BookPageFormatter = require('../components/BookPageFormatter');

class BookDocumentRenderer extends BaseDocumentRenderer {
    constructor() {
        super();
        this.name = 'book';
        this.displayName = 'Book Document Renderer';
        
        // Book-specific properties
        this.bookStructure = {
            parts: [],
            chapters: [],
            sections: [],
            frontMatter: [],
            mainMatter: [],
            backMatter: []
        };
        
        this.currentPage = 1;
        this.currentChapter = 0;
        
        // Initialize book-specific components
        this.structureParser = new BookStructureParser();
        this.navigationBuilder = new BookNavigationBuilder();
        this.pageFormatter = new BookPageFormatter();
        
        this.initializeBookCommands();
    }

    /**
     * Initialize book-specific LaTeX commands
     */
    initializeBookCommands() {
        const bookCommands = [
            // Document structure
            'frontmatter', 'mainmatter', 'backmatter', 'appendix',
            'part', 'chapter', 'section', 'subsection', 'subsubsection',
            
            // Book elements
            'tableofcontents', 'listoffigures', 'listoftables',
            'titlepage', 'dedication', 'thanks', 'foreword', 'preface',
            
            // Typography
            'textbf', 'textit', 'texttt', 'emph', 'underline',
            'textsc', 'textsf', 'textrm', 'textmd', 'textup', 'textsl',
            
            // Size commands
            'tiny', 'scriptsize', 'footnotesize', 'small', 'normalsize',
            'large', 'Large', 'LARGE', 'huge', 'Huge',
            
            // Spacing and layout
            'newpage', 'clearpage', 'cleardoublepage', 'pagebreak',
            'vspace', 'hspace', 'bigskip', 'medskip', 'smallskip',
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
            
            // Theorems
            'theorem', 'lemma', 'corollary', 'proposition',
            'definition', 'example', 'remark', 'proof',
            
            // Bibliography
            'bibliography', 'bibliographystyle', 'cite',
            
            // Index and glossary
            'index', 'glossary', 'makeindex', 'printindex'
        ];

        bookCommands.forEach(cmd => this.addSupportedCommand(cmd));
    }

    /**
     * Parse book document structure
     */
    parseDocument() {
        this.validateDocument();
        
        // Initialize parsers if not already done
        if (!this.structureParser) {
            this.structureParser = new (require('../parsers/BookStructureParser'))();
            this.structureParser.setContent(this.content);
        }
        if (!this.navigationBuilder) {
            this.navigationBuilder = new (require('../components/BookNavigationBuilder'))();
        }
        if (!this.pageFormatter) {
            this.pageFormatter = new (require('../components/BookPageFormatter'))();
        }
        
        // Parse book structure
        this.bookStructure = this.structureParser.parse(this.content);
        
        // Process document in logical order
        let processedContent = this.content;
        
        // Extract document body
        const documentMatch = processedContent.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/);
        if (documentMatch) {
            processedContent = documentMatch[1];
        }
        
        processedContent = this.processDocumentMatter(processedContent);
        processedContent = this.processTitlePage(processedContent);
        processedContent = this.processParts(processedContent);
        processedContent = this.processChapters(processedContent);
        processedContent = this.processSections(processedContent);
        processedContent = this.processTableOfContents(processedContent);
        processedContent = this.processEnvironments(processedContent);
        processedContent = this.processFormatting(processedContent);
        
        // Format as A4 pages
        processedContent = this.pageFormatter.formatPages(processedContent, this.bookStructure);
        
        // Wrap in book layout
        return this.wrapInBookLayout(processedContent);
    }

    /**
     * Process document matter divisions
     */
    processDocumentMatter(content) {
        return this.structureParser.processMatterDivisions(content);
    }

    /**
     * Process title page
     */
    processTitlePage(content) {
        return this.structureParser.processTitlePage(content);
    }

    /**
     * Process parts
     */
    processParts(content) {
        return this.structureParser.processParts(content);
    }

    /**
     * Process chapters
     */
    processChapters(content) {
        return this.structureParser.processChapters(content);
    }

    /**
     * Process sections
     */
    processSections(content) {
        return this.structureParser.processSections(content);
    }

    /**
     * Process table of contents
     */
    processTableOfContents(content) {
        return this.navigationBuilder.buildTableOfContents(content, this.bookStructure);
    }

    /**
     * Process LaTeX environments
     */
    processEnvironments(content) {
        const environmentProcessors = {
            'itemize': this.processItemList,
            'enumerate': this.processNumberedList,
            'description': this.processDescriptionList,
            'figure': this.processFigure,
            'table': this.processTable,
            'equation': this.processEquation,
            'theorem': this.processTheorem,
            'proof': this.processProof
        };

        let processedContent = content;
        
        Object.entries(environmentProcessors).forEach(([env, processor]) => {
            processedContent = this.processEnvironment(processedContent, env, processor.bind(this));
        });

        return processedContent;
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
        const listItems = items.map((item, index) => 
            `<li>${this.processFormatting(item.trim())}</li>`
        ).join('\n');
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
        
        return `<figure class="figure">
            <div class="figure-content">${this.extractGraphics(content)}</div>
            ${caption ? `<figcaption>${this.processFormatting(caption)}</figcaption>` : ''}
        </figure>`;
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
     * Process theorem environment
     */
    processTheorem(content) {
        return `<div class="theorem">
            <div class="theorem-content">${this.processFormatting(content)}</div>
        </div>`;
    }

    /**
     * Process proof environment
     */
    processProof(content) {
        return `<div class="proof">
            <div class="proof-content">${this.processFormatting(content)}</div>
            <div class="proof-end">QED</div>
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
        return '<!-- Figure content -->';
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
        
        return processed;
    }

    /**
     * Wrap content in book layout
     */
    wrapInBookLayout(content) {
        const sidebar = this.navigationBuilder.buildSidebar(this.bookStructure);
        
        return `<div class="book-layout">
            <aside class="book-sidebar">
                ${sidebar}
            </aside>
            <main class="book-content">
                ${content}
            </main>
        </div>`;
    }

    /**
     * Build book header
     */
    buildBookHeader() {
        return `<header class="book-header">
            <div class="book-title">${this.metadata.title}</div>
            <div class="book-author">${this.metadata.author}</div>
        </header>`;
    }

    /**
     * Build book footer
     */
    buildBookFooter() {
        return `<footer class="book-footer">
            <div class="footer-content">
                <p>Generated by LaTeX to HTML Engine</p>
            </div>
        </footer>`;
    }
}

module.exports = BookDocumentRenderer;