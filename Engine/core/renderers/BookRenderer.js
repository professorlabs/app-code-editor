/**
 * Professional eBook Book Document Renderer
 * Handles LaTeX book class documents with advanced eBook features
 * Security, page layout, title pages, and comprehensive LaTeX support
 */

const DocumentRenderer = require('./DocumentRenderer');

class BookRenderer extends DocumentRenderer {
    constructor() {
        super();
        this.name = 'book';
        this.displayName = 'Professional eBook';
        
        // Book state management
        this.currentChapter = 0;
        this.currentPage = 1;
        this.securitySettings = {
            screenshotDisabled: false,
            copyTextDisabled: false,
            printDisabled: false
        };
        
        // Book structure
        this.bookStructure = {
            frontMatter: [],
            mainMatter: [],
            backMatter: [],
            chapters: [],
            parts: [],
            tocEntries: []
        };
        
        this.initializeSupportedCommands();
        this.extractSecuritySettings();
    }

    /**
     * Initialize comprehensive LaTeX book commands
     */
    initializeSupportedCommands() {
        // Document structure and division
        this.addSupportedCommand('frontmatter');
        this.addSupportedCommand('mainmatter');
        this.addSupportedCommand('backmatter');
        this.addSupportedCommand('appendix');
        this.addSupportedCommand('part');
        this.addSupportedCommand('chapter');
        this.addSupportedCommand('section');
        this.addSupportedCommand('subsection');
        this.addSupportedCommand('subsubsection');
        this.addSupportedCommand('paragraph');
        this.addSupportedCommand('subparagraph');
        this.addSupportedCommand('minisec');
        this.addSupportedCommand('subsubparagraph');

        // Title and authoring
        this.addSupportedCommand('title');
        this.addSupportedCommand('author');
        this.addSupportedCommand('date');
        this.addSupportedCommand('maketitle');
        this.addSupportedCommand('titlepage');
        this.addSupportedCommand('thanks');
        this.addSupportedCommand('dedication');
        this.addSupportedCommand('foreword');
        this.addSupportedCommand('preface');

        // Text formatting and typography
        this.addSupportedCommand('textbf');
        this.addSupportedCommand('textit');
        this.addSupportedCommand('texttt');
        this.addSupportedCommand('emph');
        this.addSupportedCommand('underline');
        this.addSupportedCommand('textsc');
        this.addSupportedCommand('textsf');
        this.addSupportedCommand('textrm');
        this.addSupportedCommand('textmd');
        this.addSupportedCommand('textup');
        this.addSupportedCommand('textsl');
        this.addSupportedCommand('textnormal');

        // Advanced typography
        this.addSupportedCommand('sffamily');
        this.addSupportedCommand('rmfamily');
        this.addSupportedCommand('ttfamily');
        this.addSupportedCommand('mdseries');
        this.addSupportedCommand('bfseries');
        this.addSupportedCommand('upshape');
        this.addSupportedCommand('itshape');
        this.addSupportedCommand('slshape');
        this.addSupportedCommand('scshape');
        this.addSupportedCommand('normalsize');
        this.addSupportedCommand('small');
        this.addSupportedCommand('footnotesize');
        this.addSupportedCommand('scriptsize');
        this.addSupportedCommand('tiny');
        this.addSupportedCommand('large');
        this.addSupportedCommand('Large');
        this.addSupportedCommand('LARGE');
        this.addSupportedCommand('huge');
        this.addSupportedCommand('Huge');

        // Spacing and layout
        this.addSupportedCommand('newpage');
        this.addSupportedCommand('clearpage');
        this.addSupportedCommand('cleardoublepage');
        this.addSupportedCommand('pagebreak');
        this.addSupportedCommand('nopagebreak');
        this.addSupportedCommand('vspace');
        this.addSupportedCommand('hspace');
        this.addSupportedCommand('bigskip');
        this.addSupportedCommand('medskip');
        this.addSupportedCommand('smallskip');
        this.addSupportedCommand('newline');
        this.addSupportedCommand('linebreak');
        this.addSupportedCommand('nolinebreak');
        this.addSupportedCommand('par');
        this.addSupportedCommand('noindent');
        this.addSupportedCommand('indent');
        this.addSupportedCommand('raggedright');
        this.addSupportedCommand('raggedleft');
        this.addSupportedCommand('centering');

        // Lists and descriptions
        this.addSupportedCommand('itemize');
        this.addSupportedCommand('enumerate');
        this.addSupportedCommand('description');
        this.addSupportedCommand('list');
        this.addSupportedCommand('item');
        this.addSupportedCommand('label');

        // Tables and figures
        this.addSupportedCommand('table');
        this.addSupportedCommand('figure');
        this.addSupportedCommand('tabular');
        this.addSupportedCommand('array');
        this.addSupportedCommand('caption');
        this.addSupportedCommand('label');
        this.addSupportedCommand('ref');
        this.addSupportedCommand('pageref');
        this.addSupportedCommand('includegraphics');
        this.addSupportedCommand('graphicspath');
        this.addSupportedCommand('fbox');
        this.addSupportedCommand('framebox');
        this.addSupportedCommand('rotatebox');
        this.addSupportedCommand('scalebox');
        this.addSupportedCommand('resizebox');
        this.addSupportedCommand('color');
        this.addSupportedCommand('textcolor');
        this.addSupportedCommand('colorbox');
        this.addSupportedCommand('fcolorbox');

        // Mathematics
        this.addSupportedCommand('equation');
        this.addSupportedCommand('equation*');
        this.addSupportedCommand('align');
        this.addSupportedCommand('align*');
        this.addSupportedCommand('gather');
        this.addSupportedCommand('gather*');
        this.addSupportedCommand('multline');
        this.addSupportedCommand('multline*');
        this.addSupportedCommand('flalign');
        this.addSupportedCommand('flalign*');
        this.addSupportedCommand('split');
        this.addSupportedCommand('cases');
        this.addSupportedCommand('matrix');
        this.addSupportedCommand('pmatrix');
        this.addSupportedCommand('bmatrix');
        this.addSupportedCommand('vmatrix');
        this.addSupportedCommand('Vmatrix');
        this.addSupportedCommand('frac');
        this.addSupportedCommand('sqrt');
        this.addSupportedCommand('int');
        this.addSupportedCommand('sum');
        this.addSupportedCommand('prod');
        this.addSupportedCommand('lim');
        this.addSupportedCommand('inf');
        this.addSupportedCommand('sup');
        this.addSupportedCommand('sub');
        this.addSupportedCommand('displaystyle');
        this.addSupportedCommand('textstyle');
        this.addSupportedCommand('scriptstyle');
        this.addSupportedCommand('scriptscriptstyle');

        // Bibliography and citations
        this.addSupportedCommand('bibliography');
        this.addSupportedCommand('bibliographystyle');
        this.addSupportedCommand('cite');
        this.addSupportedCommand('nocite');
        this.addSupportedCommand('citep');
        this.addSupportedCommand('citet');
        this.addSupportedCommand('citealp');
        this.addSupportedCommand('citeauthor');
        this.addSupportedCommand('citeyear');
        this.addSupportedCommand('citeyearpar');
        this.addSupportedCommand('citetitle');

        // Index and glossary
        this.addSupportedCommand('index');
        this.addSupportedCommand('glossary');
        this.addSupportedCommand('makeindex');
        this.addSupportedCommand('printindex');
        this.addSupportedCommand('printglossary');
        this.addSupportedCommand('see');
        this.addSupportedCommand('seealso');
        this.addSupportedCommand('gls');
        this.addSupportedCommand('glslink');
        this.addSupportedCommand('glsdesc');
        this.addSupportedCommand('glssymbol');

        // Contents
        this.addSupportedCommand('tableofcontents');
        this.addSupportedCommand('listoffigures');
        this.addSupportedCommand('listoftables');
        this.addSupportedCommand('listofalgorithms');
        this.addSupportedCommand('listofequations');
        this.addSupportedCommand('addcontentsline');
        this.addSupportedCommand('addtocontents');
        this.addSupportedCommand('contentsline');
        this.addSupportedCommand('l@addtocontents');
        this.addSupportedCommand('numberline');

        // Code listings (with lstlisting)
        this.addSupportedCommand('lstlisting');
        this.addSupportedCommand('lstset');
        this.addSupportedCommand('lstinputlisting');
        this.addSupportedCommand('minted');
        this.addSupportedCommand('inputminted');
        this.addSupportedCommand('code');

        // Verbatim and text
        this.addSupportedCommand('verbatim');
        this.addSupportedCommand('verb');
        this.addSupportedCommand('quote');
        this.addSupportedCommand('quotation');
        this.addSupportedCommand('verse');

        // Theorem environments (declarations)
        this.addSupportedCommand('newtheorem');
        this.addSupportedCommand('newtheorem*');
        this.addSupportedCommand('theorem');
        this.addSupportedCommand('lemma');
        this.addSupportedCommand('corollary');
        this.addSupportedCommand('proposition');
        this.addSupportedCommand('definition');
        this.addSupportedCommand('example');
        this.addSupportedCommand('remark');
        this.addSupportedCommand('proof');
        this.addSupportedCommand('qedhere');

        // Cross-referencing
        this.addSupportedCommand('label');
        this.addSupportedCommand('ref');
        this.addSupportedCommand('pageref');
        this.addSupportedCommand('eqref');
        this.addSupportedCommand('autoref');
        this.addSupportedCommand('nameref');

        // Packages that might be used
        this.addSupportedCommand('usepackage');
        this.addSupportedCommand('RequirePackage');
        this.addSupportedCommand('include');
        this.addSupportedCommand('input');
        this.addSupportedCommand('documentclass');
    }

      /**
     * Extract security settings from document
     */
    extractSecuritySettings() {
        const securityMatch = this.content.match(/@screenshot:(\w+)/);
        if (securityMatch) {
            this.securitySettings.screenshotDisabled = securityMatch[1] === 'disable';
        }
        
        const copyMatch = this.content.match(/@copytext:(\w+)/);
        if (copyMatch) {
            this.securitySettings.copyTextDisabled = copyMatch[1] === 'disable';
        }
        
        const printMatch = this.content.match(/@print:(\w+)/);
        if (printMatch) {
            this.securitySettings.printDisabled = printMatch[1] === 'disable';
        }
    }

    /**
     * Parse book document structure with comprehensive processing
     */
    parseDocument() {
        this.validateDocument();
        
        let processedContent = this.sanitizeContent(this.content);
        
        // Remove document class and usepackage commands (preserve for analysis)
        this.analyzeBookStructure(processedContent);
        
        // Extract document body
        const documentMatch = processedContent.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/);
        if (!documentMatch) {
            throw new Error('Book document must have begin/end document environment');
        }

        let documentBody = documentMatch[1];
        
        // Process book matter divisions (frontmatter, mainmatter, backmatter)
        documentBody = this.processBookMatter(documentBody);
        
        // Process advanced title page
        documentBody = this.processAdvancedTitlePage(documentBody);
        
        // Process parts with numbering
        documentBody = this.processParts(documentBody);
        
        // Process chapters with advanced features
        documentBody = this.processAdvancedChapters(documentBody);
        
        // Process sections and subsections
        documentBody = this.processSections(documentBody);
        
        // Process theorems and environments
        documentBody = this.processTheoremEnvironments(documentBody);
        
        // Process tables and figures with captions
        documentBody = this.processFloatEnvironments(documentBody);
        
        // Process equations and mathematics
        documentBody = this.processMathematics(documentBody);
        
        // Process code listings
        documentBody = this.processCodeListings(documentBody);
        
        // Process bibliography
        documentBody = this.processBibliography(documentBody);
        
        // Process index and glossary
        documentBody = this.processIndexAndGlossary(documentBody);
        
        // Process table of contents
        documentBody = this.processAdvancedTableOfContents(documentBody);
        
        // Process inline formatting
        documentBody = this.processAdvancedFormatting(documentBody);
        
        // Process page layout and numbering
        documentBody = this.wrapInPages(documentBody);
        
        return this.wrapInBookLayout(documentBody);
    }

    /**
     * Analyze book structure for navigation
     */
    analyzeBookStructure(content) {
        // Extract parts
        const partMatches = content.match(/\\part(\[([^\]]+)\])?\{([^}]+)\}/g) || [];
        partMatches.forEach((part, index) => {
            this.bookStructure.parts.push({
                title: part.match(/\\part.*?\{([^}]+)\}/)[1],
                subtitle: part.match(/\\part\[([^\]]+)\]/) ? part.match(/\\part\[([^\]]+)\]/)[1] : null,
                number: index + 1,
                id: `part-${index + 1}`
            });
        });
        
        // Extract chapters
        const chapterMatches = content.match(/\\chapter(\[([^\]]+)\])?\{([^}]+)\}/g) || [];
        chapterMatches.forEach((chapter, index) => {
            this.bookStructure.chapters.push({
                title: chapter.match(/\\chapter.*?\{([^}]+)\}/)[1],
                subtitle: chapter.match(/\\chapter\[([^\]]+)\]/) ? chapter.match(/\\chapter\[([^\]]+)\]/)[1] : null,
                number: index + 1,
                id: `chapter-${index + 1}`
            });
        });
        
        // Extract sections for TOC
        this.extractTableOfContentsEntries(content);
    }

    /**
     * Extract table of contents entries
     */
    extractTableOfContentsEntries(content) {
        const tocPatterns = [
            { pattern: /\\part(\[.*?\])?\{([^}]+)\}/g, level: 'part' },
            { pattern: /\\chapter(\[.*?\])?\{([^}]+)\}/g, level: 'chapter' },
            { pattern: /\\section(\[.*?\])?\{([^}]+)\}/g, level: 'section' },
            { pattern: /\\subsection(\[.*?\])?\{([^}]+)\}/g, level: 'subsection' },
            { pattern: /\\subsubsection(\[.*?\])?\{([^}]+)\}/g, level: 'subsubsection' }
        ];
        
        tocPatterns.forEach(({ pattern, level }) => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                const title = match[3] || match[2];
                const id = `${level}-${this.bookStructure.tocEntries.length}`;
                this.bookStructure.tocEntries.push({
                    title: title,
                    level: level,
                    id: id,
                    page: 0 // Will be calculated during layout
                });
            }
        });
    }

    /**
     * Process book matter divisions with proper formatting
     */
    processBookMatter(content) {
        let processedContent = content;
        
        // Process frontmatter (Roman numeral page numbers)
        processedContent = processedContent.replace(
            /\\frontmatter\s*/g,
            '<div class="book-matter frontmatter">\n'
        );
        
        // Process mainmatter (Arabic page numbers start)
        processedContent = processedContent.replace(
            /\\mainmatter\s*/g,
            '</div>\n<div class="book-matter mainmatter">\n'
        );
        
        // Process backmatter (continues Arabic numbering)
        processedContent = processedContent.replace(
            /\\backmatter\s*/g,
            '</div>\n<div class="book-matter backmatter">\n'
        );
        
        // Process appendix (changes chapter numbering to letters)
        processedContent = processedContent.replace(
            /\\appendix\s*/g,
            '</div>\n<div class="book-matter appendix">\n'
        );
        
        // Close all matter sections
        processedContent += '</div>\n';
        
        return processedContent;
    }

    /**
     * Process advanced title page with full LaTeX support
     */
    processAdvancedTitlePage(content) {
        // Process titlepage environment
        const titlePageMatch = content.match(/\\begin\{titlepage\}([\s\S]*?)\\end\{titlepage\}/);
        
        if (titlePageMatch) {
            const titlePageContent = titlePageMatch[1];
            const processedTitlePage = this.processTitlePageContent(titlePageContent);
            return content.replace(titlePageMatch[0], processedTitlePage);
        }
        
        // Process individual title components
        let processedContent = content;
        
        // Process dedication
        processedContent = this.processDedication(processedContent);
        
        // Process thanks
        processedContent = this.processThanks(processedContent);
        
        // Process foreword
        processedContent = this.processForeword(processedContent);
        
        // Process preface
        processedContent = this.processPreface(processedContent);
        
        // Fallback to \maketitle
        return this.processTitleBlock(processedContent);
    }

    /**
     * Process title page content with advanced formatting
     */
    processTitlePageContent(content) {
        let titlePageHTML = '<div class="title-page">\n';
        
        // Extract and process multiple authors
        const authors = this.extractMultipleAuthors(content);
        const titles = this.extractMultipleTitles(content);
        
        // Process title
        if (titles.length > 0) {
            titlePageHTML += '<div class="title-page-titles">\n';
            titles.forEach(title => {
                titlePageHTML += `<h1 class="title-page-title">${this.processTextFormatting(title)}</h1>\n`;
            });
            titlePageHTML += '</div>\n';
        }
        
        // Process authors
        if (authors.length > 0) {
            titlePageHTML += '<div class="title-page-authors">\n';
            authors.forEach((author, index) => {
                titlePageHTML += `<div class="title-page-author" data-author="${index + 1}">${this.processTextFormatting(author)}</div>\n`;
            });
            titlePageHTML += '</div>\n';
        }
        
        // Extract date and publisher
        const dateMatch = content.match(/\\date\{([^}]+)\}/);
        if (dateMatch) {
            titlePageHTML += `<div class="title-page-date">${this.processDate(dateMatch[1])}</div>\n`;
        }
        
        // Process publisher
        const publisherMatch = content.match(/\\publisher\{([^}]+)\}/);
        if (publisherMatch) {
            titlePageHTML += `<div class="title-page-publisher">${publisherMatch[1]}</div>\n`;
        }
        
        // Process location
        const locationMatch = content.match(/\\location\{([^}]+)\}/);
        if (locationMatch) {
            titlePageHTML += `<div class="title-page-location">${locationMatch[1]}</div>\n`;
        }
        
        // Process ISBN
        const isbnMatch = content.match(/\\isbn\{([^}]+)\}/);
        if (isbnMatch) {
            titlePageHTML += `<div class="title-page-isbn">ISBN: ${isbnMatch[1]}</div>\n`;
        }
        
        // Process edition
        const editionMatch = content.match(/\\edition\{([^}]+)\}/);
        if (editionMatch) {
            titlePageHTML += `<div class="title-page-edition">${editionMatch[1]} Edition</div>\n`;
        }
        
        titlePageHTML += '</div>\n\n';
        
        return titlePageHTML;
    }

    /**
     * Extract multiple authors with affiliations
     */
    extractMultipleAuthors(content) {
        const authors = [];
        
        // Extract \author{...} commands
        const authorMatches = content.match(/\\author\{([^{}]*(?:\{[^}]*\}[^{}]*)*)\}/g);
        if (authorMatches) {
            authorMatches.forEach(match => {
                const authorText = match.match(/\\author\{([^{}]*(?:\{[^}]*\}[^{}]*)*)\}/)[1];
                authors.push(authorText);
            });
        }
        
        return authors;
    }

    /**
     * Extract multiple titles
     */
    extractMultipleTitles(content) {
        const titles = [];
        
        // Extract \title{...} commands
        const titleMatches = content.match(/\\title\{([^{}]*(?:\{[^}]*\}[^{}]*)*)\}/g);
        if (titleMatches) {
            titleMatches.forEach(match => {
                const titleText = match.match(/\\title\{([^{}]*(?:\{[^}]*\}[^{}]*)*)\}/)[1];
                titles.push(titleText);
            });
        }
        
        return titles;
    }

    /**
     * Process dedication page
     */
    processDedication(content) {
        const dedicationMatch = content.match(/\\begin\{dedication\}([\s\S]*?)\\end\{dedication\}/);
        if (dedicationMatch) {
            const dedicationContent = this.processTextFormatting(dedicationMatch[1]);
            return content.replace(dedicationMatch[0], 
                '<div class="dedication-page">\n' +
                `<div class="dedication-content">${dedicationContent}</div>\n` +
                '</div>\n\n'
            );
        }
        return content;
    }

    /**
     * Process thanks page
     */
    processThanks(content) {
        const thanksMatch = content.match(/\\begin\{thanks\}([\s\S]*?)\\end\{thanks\}/);
        if (thanksMatch) {
            const thanksContent = this.processTextFormatting(thanksMatch[1]);
            return content.replace(thanksMatch[0], 
                '<div class="thanks-page">\n' +
                `<div class="thanks-content">${thanksContent}</div>\n` +
                '</div>\n\n'
            );
        }
        return content;
    }

    /**
     * Process foreword
     */
    processForeword(content) {
        const forewordMatch = content.match(/\\begin\{foreword\}([\s\S]*?)\\end\{foreword\}/);
        if (forewordMatch) {
            const forewordContent = this.processTextFormatting(forewordMatch[1]);
            return content.replace(forewordMatch[0], 
                '<div class="foreword">\n' +
                '<h2 class="foreword-title">Foreword</h2>\n' +
                `<div class="foreword-content">${forewordContent}</div>\n` +
                '</div>\n\n'
            );
        }
        return content;
    }

    /**
     * Process preface
     */
    processPreface(content) {
        const prefaceMatch = content.match(/\\begin\{preface\}([\s\S]*?)\\end\{preface\}/);
        if (prefaceMatch) {
            const prefaceContent = this.processTextFormatting(prefaceMatch[1]);
            return content.replace(prefaceMatch[0], 
                '<div class="preface">\n' +
                '<h2 class="preface-title">Preface</h2>\n' +
                `<div class="preface-content">${prefaceContent}</div>\n` +
                '</div>\n\n'
            );
        }
        return content;
    }

    /**
     * Process parts with advanced numbering and formatting
     */
    processParts(content) {
        const partPattern = /\\part(\[([^\]]+)\])?\{([^}]+)\}(?:\n\s*)?/g;
        
        return content.replace(partPattern, (match, optionalTitle, shortTitle, fullTitle) => {
            const partNumber = this.getPartNumber(match);
            const partId = `part-${partNumber}`;
            
            // Add to book structure
            this.currentPage++; // Count this page
            
            return `<div class="book-part" id="${partId}" data-page="${this.currentPage}">
                <div class="part-title-page">
                    <div class="part-header">Part ${partNumber}</div>
                    <h1 class="part-title">${fullTitle}</h1>
                    ${optionalTitle ? `<h2 class="part-subtitle">${optionalTitle}</h2>` : ''}
                </div>
            </div>\n<div class="page-break"></div>\n`;
        });
    }

    /**
     * Process advanced chapters with comprehensive features
     */
    processAdvancedChapters(content) {
        const chapterPattern = /\\chapter(\[([^\]]+)\])?\{([^}]+)\}(?:\n\s*)?/g;
        
        return content.replace(chapterPattern, (match, optionalTitle, shortTitle, fullTitle) => {
            const chapterNumber = this.getChapterNumber(match);
            const chapterId = `chapter-${chapterNumber}`;
            
            // Add to book structure
            this.currentChapter = chapterNumber;
            this.currentPage++; // Count this page
            
            return `<div class="book-chapter" id="${chapterId}" data-page="${this.currentPage}" data-chapter="${chapterNumber}">
                <div class="chapter-title-page">
                    <div class="chapter-number">Chapter ${chapterNumber}</div>
                    <h1 class="chapter-title">${fullTitle}</h1>
                    ${optionalTitle ? `<h2 class="chapter-subtitle">${optionalTitle}</h2>` : ''}
                </div>
            </div>\n`;
        });
    }

    /**
     * Process theorem environments
     */
    processTheoremEnvironments(content) {
        const theoremTypes = ['theorem', 'lemma', 'corollary', 'proposition', 'definition', 'example', 'remark'];
        
        let processedContent = content;
        
        theoremTypes.forEach(type => {
            const pattern = new RegExp(`\\\\begin\\{${type}\\}([\\s\\S]*?)\\\\end\\{${type}\\}`, 'g');
            processedContent = processedContent.replace(pattern, (match, theoremContent) => {
                const processedContent = this.processTextFormatting(theoremContent);
                const theoremNumber = this.getTheoremNumber(type);
                
                return `<div class="theorem ${type}">
                    <div class="theorem-header">
                        <span class="theorem-label">${type.charAt(0).toUpperCase() + type.slice(1)} ${theoremNumber}</span>
                    </div>
                    <div class="theorem-content">${processedContent}</div>
                    <div class="theorem-proof-marker">□</div>
                </div>`;
            });
        });
        
        // Process proofs
        processedContent = processedContent.replace(
            /\\begin\{proof\}([\s\S]*?)\\end\{proof\}/g,
            (match, proofContent) => {
                const processedProof = this.processTextFormatting(proofContent);
                return `<div class="proof">
                    <div class="proof-header">Proof.</div>
                    <div class="proof-content">${processedProof}</div>
                    <div class="proof-end">□</div>
                </div>`;
            }
        );
        
        return processedContent;
    }

    /**
     * Get theorem number
     */
    getTheoremNumber(theoremType) {
        if (!this.theoremCounters) {
            this.theoremCounters = {};
        }
        
        this.theoremCounters[theoremType] = (this.theoremCounters[theoremType] || 0) + 1;
        return this.theoremCounters[theoremType];
    }

    /**
     * Process advanced table of contents
     */
    processAdvancedTableOfContents(content) {
        const tocMatch = content.match(/\\tableofcontents\s*/);
        
        if (tocMatch) {
            const tocHTML = this.generateAdvancedTableOfContents();
            return content.replace(tocMatch[0], tocHTML);
        }
        
        return content;
    }

    /**
     * Generate comprehensive table of contents with enhanced navigation
     */
    generateAdvancedTableOfContents() {
        let tocHTML = '<div class="table-of-contents" id="table-of-contents">\n';
        tocHTML += '<h2 class="toc-title">Table of Contents</h2>\n';
        tocHTML += '<div class="toc-content">\n';
        tocHTML += '<nav class="toc-navigation">\n';
        
        // Add parts with enhanced navigation
        if (this.bookStructure.parts.length > 0) {
            tocHTML += '<div class="toc-section toc-parts">\n';
            this.bookStructure.parts.forEach(part => {
                tocHTML += `<div class="toc-item toc-part" data-level="part">
                    <a href="#part-${part.number}" class="toc-link" data-target="part-${part.number}">
                        <span class="toc-number">Part ${part.number}</span>
                        <span class="toc-title">${part.title}</span>
                        <span class="toc-indicator">→</span>
                    </a>
                </div>\n`;
            });
            tocHTML += '</div>\n';
        }
        
        // Add chapters with progress indicators
        tocHTML += '<div class="toc-section toc-chapters">\n';
        this.bookStructure.chapters.forEach((chapter, index) => {
            const progress = this.calculateChapterProgress(chapter);
            tocHTML += `<div class="toc-item toc-chapter" data-level="chapter" data-progress="${progress}">
                <a href="#${chapter.id}" class="toc-link" data-target="${chapter.id}">
                    <span class="toc-number">Chapter ${chapter.number}</span>
                    <span class="toc-title">${chapter.title}</span>
                    <span class="toc-progress" style="width: ${progress}%"></span>
                    <span class="toc-indicator">→</span>
                </a>
            </div>\n`;
            
            // Add sections for this chapter with smooth scroll
            const chapterSections = this.getSectionsInChapter(chapter);
            if (chapterSections.length > 0) {
                tocHTML += '<div class="toc-subsections">\n';
                chapterSections.forEach((section, sectionIndex) => {
                    const sectionId = `${chapter.id}-section-${sectionIndex + 1}`;
                    tocHTML += `<div class="toc-item toc-section" data-level="section">
                        <a href="#${sectionId}" class="toc-link" data-target="${sectionId}">
                            <span class="toc-number">${sectionIndex + 1}</span>
                            <span class="toc-title">${section.title}</span>
                            <span class="toc-indicator">→</span>
                        </a>
                    </div>\n`;
                });
                tocHTML += '</div>\n';
            }
        });
        tocHTML += '</div>\n';
        
        tocHTML += '</nav>\n</div>\n</div>\n\n';
        
        return tocHTML;
    }

    /**
     * Calculate reading progress for a chapter
     */
    calculateChapterProgress(chapter) {
        // Simple progress calculation based on chapter order
        const totalChapters = this.bookStructure.chapters.length;
        const currentIndex = this.bookStructure.chapters.indexOf(chapter);
        return Math.round(((currentIndex + 1) / totalChapters) * 100);
    }

    /**
     * Get sections within a chapter
     */
    getSectionsInChapter(chapter) {
        const sectionPattern = new RegExp(`\\\\section\\{([^}]+)\\}`, 'g');
        const sections = [];
        let match;
        
        // Find sections that belong to this chapter
        const chapterStartIndex = this.content.indexOf(chapter.title);
        const nextChapterIndex = this.content.indexOf('\\chapter{', chapterStartIndex + 1);
        const chapterContent = nextChapterIndex > -1 
            ? this.content.substring(chapterStartIndex, nextChapterIndex)
            : this.content.substring(chapterStartIndex);
        
        while ((match = sectionPattern.exec(chapterContent)) !== null) {
            sections.push({
                title: match[1],
                id: `${chapter.id}-section-${sections.length + 1}`
            });
        }
        
        return sections;
    }

    /**
     * Wrap content in A4-style responsive pages with enhanced layout
     */
    wrapInPages(content) {
        // Split content by page breaks
        const pages = content.split(/<div class="page-break"><\/div>/);
        
        let pageHTML = '';
        pages.forEach((page, index) => {
            const pageNumber = index + 1;
            const matterClass = this.determineMatterClass(pageNumber);
            const pageType = this.determinePageType(page, pageNumber);
            
            pageHTML += `<div class="a4-page ${matterClass} ${pageType}" data-page="${pageNumber}" data-total="${pages.length}">\n`;
            
            // Page header with book title and chapter info
            pageHTML += '<div class="a4-page-header">\n';
            pageHTML += `<div class="page-header-left">${this.getHeaderInfo(pageNumber)}</div>\n`;
            pageHTML += `<div class="page-header-right">${this.formatPageNumber(pageNumber, matterClass)}</div>\n`;
            pageHTML += '</div>\n';
            
            // Main content area with proper A4 aspect ratio
            pageHTML += '<div class="a4-page-content">\n';
            pageHTML += '<div class="content-wrapper">\n';
            pageHTML += page.trim();
            pageHTML += '</div>\n';
            pageHTML += '</div>\n';
            
            // Page footer with copyright and page number
            pageHTML += '<div class="a4-page-footer">\n';
            pageHTML += `<div class="page-footer-left">${this.metadata.title || 'Professional eBook'}</div>\n`;
            pageHTML += `<div class="page-footer-right">Page ${this.formatPageNumber(pageNumber, matterClass)} of ${this.formatPageNumber(pages.length, matterClass)}</div>\n`;
            pageHTML += '</div>\n';
            
            pageHTML += '</div>\n\n';
        });
        
        return pageHTML;
    }

    /**
     * Determine page type based on content
     */
    determinePageType(page, pageNumber) {
        if (page.includes('title-page')) return 'title-page';
        if (page.includes('table-of-contents')) return 'toc-page';
        if (page.includes('part-title-page')) return 'part-page';
        if (page.includes('chapter-title-page')) return 'chapter-page';
        if (page.includes('dedication-page')) return 'dedication-page';
        if (page.includes('abstract')) return 'abstract-page';
        if (pageNumber === 1) return 'first-page';
        return 'content-page';
    }

    /**
     * Get header information for page
     */
    getHeaderInfo(pageNumber) {
        // Determine current chapter/part for header
        if (pageNumber === 1) return 'Title';
        
        // Find current chapter based on page number
        const chaptersPerPage = 3; // Estimate
        const currentChapterIndex = Math.floor((pageNumber - 2) / chaptersPerPage);
        
        if (currentChapterIndex < this.bookStructure.chapters.length) {
            const chapter = this.bookStructure.chapters[currentChapterIndex];
            return `Chapter ${chapter.number}: ${chapter.title}`;
        }
        
        if (currentChapterIndex < this.bookStructure.parts.length + this.bookStructure.chapters.length) {
            const partIndex = currentChapterIndex - this.bookStructure.chapters.length;
            if (partIndex < this.bookStructure.parts.length) {
                const part = this.bookStructure.parts[partIndex];
                return `Part ${part.number}: ${part.title}`;
            }
        }
        
        return 'Contents';
    }

    /**
     * Determine matter class for page numbering
     */
    determineMatterClass(pageNumber) {
        // This would need more sophisticated logic based on actual content
        return 'mainmatter'; // Simplified for now
    }

    /**
     * Format page number based on matter class
     */
    formatPageNumber(pageNumber, matterClass) {
        switch (matterClass) {
            case 'frontmatter':
                return this.convertToRoman(pageNumber);
            default:
                return pageNumber;
        }
    }

    /**
     * Convert number to Roman numerals
     */
    convertToRoman(num) {
        const romanNumerals = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
        const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
        
        let result = '';
        for (let i = 0; i < romanNumerals.length; i++) {
            while (num >= values[i]) {
                result += romanNumerals[i];
                num -= values[i];
            }
        }
        return result;
    }

    /**
     * Wrap content in book layout with sidebar navigation
     */
    wrapInBookLayout(content) {
        let layoutHTML = '<div class="book-container">\n';
        
        // Add header
        layoutHTML += this.generateBookHeader();
        
        // Add main layout with sidebar
        layoutHTML += '<div class="book-layout">\n';
        
        // Add left sidebar with navigation
        layoutHTML += this.generateSidebar();
        
        // Add main content area
        layoutHTML += '<div class="book-main">\n';
        layoutHTML += content;
        layoutHTML += '</div>\n'; // End book-main
        
        layoutHTML += '</div>\n'; // End book-layout
        
        // Add footer
        layoutHTML += this.generateBookFooter();
        
        layoutHTML += '</div>\n'; // End book-container
        
        return layoutHTML;
    }

    /**
     * Generate book header
     */
    generateBookHeader() {
        return `<div class="book-header">
            <div class="book-title">${this.metadata.title || 'Untitled Book'}</div>
            <div class="book-author">${this.metadata.author || 'Unknown Author'}</div>
        </div>\n`;
    }

    /**
     * Generate sticky sidebar navigation with enhanced features
     */
    generateSidebar() {
        let sidebarHTML = '<aside class="book-sidebar sticky-sidebar">\n';
        sidebarHTML += '<div class="sidebar-header">\n';
        sidebarHTML += '<div class="sidebar-title">Navigation</div>\n';
        sidebarHTML += '<button class="sidebar-toggle" title="Toggle sidebar">Menu</button>\n';
        sidebarHTML += '</div>\n';
        
        sidebarHTML += '<div class="sidebar-content">\n';
        sidebarHTML += '<div class="sidebar-nav">\n';
        
        // Quick navigation
        sidebarHTML += '<div class="nav-section quick-nav">\n';
        sidebarHTML += '<h4 class="nav-section-title">Quick Access</h4>\n';
        sidebarHTML += '<ul class="nav-list">\n';
        sidebarHTML += '<li><a href="#table-of-contents" class="nav-link toc-link">Table of Contents</a></li>\n';
        
        // Add title page link if exists
        if (this.content.includes('\\begin{titlepage}') || this.content.includes('\\maketitle')) {
            sidebarHTML += '<li><a href="#title-page" class="nav-link">Title Page</a></li>\n';
        }
        
        sidebarHTML += '</ul>\n';
        sidebarHTML += '</div>\n';
        
        // Parts navigation
        if (this.bookStructure.parts.length > 0) {
            sidebarHTML += '<div class="nav-section parts-nav">\n';
            sidebarHTML += '<h4 class="nav-section-title">Parts</h4>\n';
            sidebarHTML += '<ul class="nav-list">\n';
            this.bookStructure.parts.forEach(part => {
                sidebarHTML += `<li><a href="#part-${part.number}" class="nav-link part-link">Part ${part.number}: ${part.title}</a></li>\n`;
            });
            sidebarHTML += '</ul>\n';
            sidebarHTML += '</div>\n';
        }
        
        // Chapters navigation with progress indicators
        sidebarHTML += '<div class="nav-section chapters-nav">\n';
        sidebarHTML += '<h4 class="nav-section-title">Chapters</h4>\n';
        sidebarHTML += '<div class="chapters-progress">\n';
        sidebarHTML += `<div class="progress-bar">
            <div class="progress-fill" style="width: 0%"></div>
        </div>\        <div class="progress-text">0% Complete</div>
        </div>\n`;
        sidebarHTML += '<ul class="nav-list">\n';
        
        this.bookStructure.chapters.forEach((chapter, index) => {
            const progress = Math.round(((index + 1) / this.bookStructure.chapters.length) * 100);
            sidebarHTML += `<li>
                <a href="#${chapter.id}" class="nav-link chapter-link" data-chapter="${chapter.number}" data-progress="${progress}">
                    <span class="chapter-number">${chapter.number}</span>
                    <span class="chapter-title">${chapter.title}</span>
                    <span class="chapter-progress" style="width: ${progress}%"></span>
                </a>
            </li>\n`;
        });
        
        sidebarHTML += '</ul>\n';
        sidebarHTML += '</div>\n';
        
        // Reading position indicator
        sidebarHTML += '<div class="nav-section reading-position">\n';
        sidebarHTML += '<h4 class="nav-section-title">Reading Position</h4>\n';
        sidebarHTML += '<div class="position-indicator">\n';
        sidebarHTML += '<div class="current-page">Page 1</div>\n';
        sidebarHTML += '<div class="scroll-progress">\n';
        sidebarHTML += '<div class="scroll-fill" style="height: 0%"></div>\n';
        sidebarHTML += '</div>\n';
        sidebarHTML += '</div>\n';
        sidebarHTML += '</div>\n';
        
        sidebarHTML += '</div>\n';
        sidebarHTML += '</div>\n';
        sidebarHTML += '</aside>\n';
        
        return sidebarHTML;
    }

    /**
     * Generate book footer
     */
    generateBookFooter() {
        return `<div class="book-footer">
            <div class="footer-content">
                <p>© ${new Date().getFullYear()} ${this.metadata.author || 'Author'}. All rights reserved.</p>
                ${this.securitySettings.copyTextDisabled ? '<p class="copy-protected">© Protected content</p>' : ''}
            </div>
        </div>\n`;
    }

    /**
     * Process text formatting with comprehensive LaTeX support
     */
    processTextFormatting(text) {
        let processedText = text;
        
        // Text formatting commands
        processedText = processedText.replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>');
        processedText = processedText.replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>');
        processedText = processedText.replace(/\\texttt\{([^}]+)\}/g, '<code>$1</code>');
        processedText = processedText.replace(/\\emph\{([^}]+)\}/g, '<em>$1</em>');
        processedText = processedText.replace(/\\underline\{([^}]+)\}/g, '<u>$1</u>');
        processedText = processedText.replace(/\\textsc\{([^}]+)\}/g, '<span class="small-caps">$1</span>');
        processedText = processedText.replace(/\\textsf\{([^}]+)\}/g, '<span class="sans-serif">$1</span>');
        processedText = processedText.replace(/\\textrm\{([^}]+)\}/g, '<span class="roman">$1</span>');
        
        // Size commands
        const sizeMap = {
            'tiny': 'font-size: 0.7em;',
            'scriptsize': 'font-size: 0.8em;',
            'footnotesize': 'font-size: 0.9em;',
            'small': 'font-size: 0.95em;',
            'normalsize': '',
            'large': 'font-size: 1.2em;',
            'Large': 'font-size: 1.44em;',
            'LARGE': 'font-size: 1.728em;',
            'huge': 'font-size: 2.074em;',
            'Huge': 'font-size: 2.488em;'
        };
        
        Object.entries(sizeMap).forEach(([command, style]) => {
            const pattern = new RegExp(`\\\\${command}`, 'g');
            processedText = processedText.replace(pattern, `<span style="${style}">`);
            processedText = processedText.replace(/<span style="[^"]*">([\\s\\S]*?)<\/span>/g, `</span>$1`);
        });
        
        return processedText;
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
     * Process float environments (figures, tables)
     */
    processFloatEnvironments(content) {
        let processedContent = content;
        
        // Process figure environments
        processedContent = processedContent.replace(
            /\\begin\{figure\}([\s\S]*?)\\end\{figure\}/g,
            (match, figureContent) => {
                return this.processFigureEnvironment(figureContent);
            }
        );
        
        // Process table environments
        processedContent = processedContent.replace(
            /\\begin\{table\}([\s\S]*?)\\end\{table\}/g,
            (match, tableContent) => {
                return this.processTableEnvironment(tableContent);
            }
        );
        
        return processedContent;
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
            ${caption ? `<figcaption class="figure-caption">${this.processTextFormatting(caption)}</figcaption>` : ''}
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
            ${caption ? `<div class="table-caption">${this.processTextFormatting(caption)}</div>` : ''}
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
            
            return `<tr>${cells.map(cell => `<${tag}>${this.processTextFormatting(cell)}</${tag}>`).join('')}</tr>`;
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
     * Process mathematics
     */
    processMathematics(content) {
        let processedContent = content;
        
        // Process equation environments
        processedContent = processedContent.replace(
            /\\begin\{equation\}([\s\S]*?)\\end\{equation\}/g,
            (match, equationContent) => {
                return `<div class="equation">
                    <div class="equation-content">${this.processTextFormatting(equationContent)}</div>
                </div>`;
            }
        );
        
        // Process equation* environments
        processedContent = processedContent.replace(
            /\\begin\{equation\*\}([\s\S]*?)\\end\{equation\*\}/g,
            (match, equationContent) => {
                return `<div class="equation">
                    <div class="equation-content">${this.processTextFormatting(equationContent)}</div>
                </div>`;
            }
        );
        
        // Process inline math
        processedContent = processedContent.replace(/\$\$([^$]+)\$\$/g, (match, mathContent) => {
            return `<span class="inline-math">${mathContent}</span>`;
        });
        
        processedContent = processedContent.replace(/\$([^$]+)\$/g, (match, mathContent) => {
            return `<span class="inline-math">${mathContent}</span>`;
        });
        
        return processedContent;
    }

    /**
     * Process code listings
     */
    processCodeListings(content) {
        let processedContent = content;
        
        // Process lstlisting environments
        processedContent = processedContent.replace(
            /\\begin\{lstlisting\}([\s\S]*?)\\end\{lstlisting\}/g,
            (match, codeContent) => {
                return `<div class="code-listing">
                    <pre><code>${this.escapeHtml(codeContent)}</code></pre>
                </div>`;
            }
        );
        
        // Process minted environments (if supported)
        processedContent = processedContent.replace(
            /\\begin\{minted\}([\s\S]*?)\\end\{minted\}/g,
            (match, codeContent) => {
                return `<div class="minted-code">
                    <pre><code>${this.escapeHtml(codeContent)}</code></pre>
                </div>`;
            }
        );
        
        // Process code environments
        processedContent = processedContent.replace(
            /\\begin\{code\}([\s\S]*?)\\end\{code\}/g,
            (match, codeContent) => {
                return `<div class="code-block">
                    <pre><code>${this.escapeHtml(codeContent)}</code></pre>
                </div>`;
            }
        );
        
        return processedContent;
    }

    /**
     * Process bibliography
     */
    processBibliography(content) {
        let processedContent = content;
        
        // Process bibliography environment
        processedContent = processedContent.replace(
            /\\begin\{thebibliography\}([\s\S]*?)\\end\{thebibliography\}/g,
            (match, bibContent) => {
                return `<div class="bibliography">
                    <h2 class="bibliography-title">Bibliography</h2>
                    <div class="bibliography-content">
                        ${this.processTextFormatting(bibContent)}
                    </div>
                </div>`;
            }
        );
        
        // Process bibliography commands
        processedContent = processedContent.replace(
            /\\bibliography\{([^}]+)\}/g,
            (match, bibFile) => {
                return `<div class="bibliography">
                    <h2 class="bibliography-title">Bibliography</h2>
                    <div class="bibliography-content">
                        <p>Bibliography file: ${bibFile}</p>
                    </div>
                </div>`;
            }
        );
        
        return processedContent;
    }

    /**
     * Process index and glossary
     */
    processIndexAndGlossary(content) {
        let processedContent = content;
        
        // Process index
        processedContent = processedContent.replace(
            /\\begin\{theindex\}([\s\S]*?)\\end\{theindex\}/g,
            (match, indexContent) => {
                return `<div class="index">
                    <h2 class="index-title">Index</h2>
                    <div class="index-content">
                        ${this.processTextFormatting(indexContent)}
                    </div>
                </div>`;
            }
        );
        
        processedContent = processedContent.replace(
            /\\printindex/g,
            '<div class="index"><h2 class="index-title">Index</h2><div class="index-content">Index entries will appear here.</div></div>'
        );
        
        // Process glossary
        processedContent = processedContent.replace(
            /\\begin\{theglossary\}([\s\S]*?)\\end\{theglossary\}/g,
            (match, glossContent) => {
                return `<div class="glossary">
                    <h2 class="glossary-title">Glossary</h2>
                    <div class="glossary-content">
                        ${this.processTextFormatting(glossContent)}
                    </div>
                </div>`;
            }
        );
        
        return processedContent;
    }

    /**
     * Process advanced formatting
     */
    processAdvancedFormatting(content) {
        let processedContent = content;
        
        // Process environments
        processedContent = this.processEnvironment(processedContent, 'abstract');
        processedContent = this.processEnvironment(processedContent, 'itemize');
        processedContent = this.processEnvironment(processedContent, 'enumerate');
        processedContent = this.processEnvironment(processedContent, 'description');
        
        // Process inline commands
        processedContent = this.processCommands(processedContent);
        
        // Process paragraphs
        processedContent = this.processParagraphs(processedContent);
        
        return processedContent;
    }

    /**
     * Get part number
     */
    getPartNumber(partMatch) {
        const parts = this.content.match(/\\part\{([^}]+)\}/g) || [];
        const currentIndex = parts.findIndex(part => part === partMatch);
        return currentIndex + 1;
    }

    /**
     * Get chapter number
     */
    getChapterNumber(chapterMatch) {
        const chapters = this.content.match(/\\chapter\{([^}]+)\}/g) || [];
        const currentIndex = chapters.findIndex(ch => ch === chapterMatch);
        return currentIndex + 1;
    }

    /**
     * Process sections (within chapters) with enhanced navigation
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
        let currentChapter = null;

        sectionCommands.forEach(({ command, level, tag }) => {
            const pattern = new RegExp(`\\\\${command}\\{([^}]+)\\}`, 'g');
            processedContent = processedContent.replace(pattern, (match, title) => {
                // Find current chapter context
                const chapterMatch = content.substring(0, content.indexOf(match)).match(/\\chapter\{([^}]+)\}/);
                if (chapterMatch) {
                    currentChapter = chapterMatch[1].toLowerCase().replace(/\\s+/g, '-');
                }
                
                // Create unique section ID
                const sectionNumber = this.getSectionNumber(command, title);
                const chapterPrefix = currentChapter || 'chapter-unknown';
                const sectionId = `${chapterPrefix}-${command}-${sectionNumber}`;
                
                // Enhanced section header with navigation attributes
                return `<${tag} id="${sectionId}" class="${command}" data-level="${level}" data-nav-title="${title}">
                    ${this.processTextFormatting(title)}
                    <a href="#${sectionId}" class="section-anchor" title="Link to this section">Link</a>
                </${tag}>\n`;
            });
        });

        return processedContent;
    }

    /**
     * Get section number for consistent numbering
     */
    getSectionNumber(command, title) {
        if (!this.sectionCounters) {
            this.sectionCounters = {};
        }
        
        const key = `${command}-${title}`;
        this.sectionCounters[key] = (this.sectionCounters[key] || 0) + 1;
        return this.sectionCounters[key];
    }

    /**
     * Process paragraphs
     */
    processParagraphs(content) {
        const paragraphs = content.split(/\\n\\s*\\n/).filter(p => p.trim());
        
        return paragraphs.map(paragraph => {
            const trimmed = paragraph.trim();
            
            if (trimmed.startsWith('<h') || trimmed.startsWith('<div class="')) {
                return trimmed;
            }
            
            if (!trimmed.includes('<') && !trimmed.includes('\\')) {
                return `<p>${this.processTextFormatting(trimmed)}</p>`;
            }
            
            return trimmed;
        }).join('\n\n');
    }

    /**
     * Escape HTML entities
     */
    escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Process title block
     */
    processTitleBlock(content) {
        const titleMatch = content.match(/\\title\{([^}]+)\}/);
        const authorMatch = content.match(/\\author\{([^}]+)\}/);
        const dateMatch = content.match(/\\date\{([^}]+)\}/);
        
        let titlePageHTML = '<div class="title-page">\n';
        
        if (titleMatch) {
            titlePageHTML += `<h1 class="title-page-title">${this.processTextFormatting(titleMatch[1])}</h1>\n`;
        }
        
        if (authorMatch) {
            titlePageHTML += `<div class="title-page-author">${this.processTextFormatting(authorMatch[1])}</div>\n`;
        }
        
        if (dateMatch) {
            titlePageHTML += `<div class="title-page-date">${this.processDate(dateMatch[1])}</div>\n`;
        }
        
        titlePageHTML += '</div>\n\n';
        
        return content.replace(/\\maketitle/, titlePageHTML);
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
                    <div class="abstract-content">${this.processTextFormatting(content)}</div>
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
                    <div class="equation-content">${this.processTextFormatting(content)}</div>
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
                return `<li>${this.processTextFormatting(trimmedItem)}</li>`;
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
                return `<dt>${term}</dt>\n<dd>${this.processTextFormatting(description)}</dd>`;
            }
            return `<dd>${this.processTextFormatting(trimmedItem)}</dd>`;
        }).filter(item => item);

        return `<dl class="description-list">\n${listItems.join('\n')}\n</dl>`;
    }
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