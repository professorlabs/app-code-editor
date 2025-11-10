/**
 * Book Structure Parser
 * Handles parsing of LaTeX book document structure
 * Extracts parts, chapters, sections, and metadata
 */

class BookStructureParser {
    constructor() {
        this.bookStructure = {
            parts: [],
            chapters: [],
            sections: [],
            frontMatter: [],
            mainMatter: [],
            backMatter: []
        };
        this.content = '';
    }

    /**
     * Set content for reference
     */
    setContent(content) {
        this.content = content;
        return this;
    }

    /**
     * Parse complete book structure
     */
    parse(content) {
        const structure = { ...this.bookStructure };
        
        // Extract document body
        const documentMatch = content.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/);
        if (!documentMatch) {
            throw new Error('Invalid book document: missing begin/end document');
        }

        const documentBody = documentMatch[1];
        
        // Parse structure components
        structure.parts = this.extractParts(content);
        structure.chapters = this.extractChapters(content);
        structure.sections = this.extractSections(content);
        
        return structure;
    }

    /**
     * Extract parts from document
     */
    extractParts(content) {
        const parts = [];
        const partMatches = content.match(/\\part(\[([^\]]+)\])?\{([^}]+)\}/g) || [];
        
        partMatches.forEach((part, index) => {
            const titleMatch = part.match(/\\part.*?\{([^}]+)\}/);
            const optionalMatch = part.match(/\\part\[([^\]]+)\]/);
            
            parts.push({
                number: index + 1,
                title: titleMatch ? titleMatch[1] : '',
                subtitle: optionalMatch ? optionalMatch[1] : null,
                id: `part-${index + 1}`
            });
        });
        
        return parts;
    }

    /**
     * Extract chapters from document
     */
    extractChapters(content) {
        const chapters = [];
        const chapterMatches = content.match(/\\chapter(\[([^\]]+)\])?\{([^}]+)\}/g) || [];
        
        chapterMatches.forEach((chapter, index) => {
            const titleMatch = chapter.match(/\\chapter.*?\{([^}]+)\}/);
            const optionalMatch = chapter.match(/\\chapter\[([^\]]+)\]/);
            
            chapters.push({
                number: index + 1,
                title: titleMatch ? titleMatch[1] : '',
                subtitle: optionalMatch ? optionalMatch[1] : null,
                id: `chapter-${index + 1}`
            });
        });
        
        return chapters;
    }

    /**
     * Extract sections from document
     */
    extractSections(content) {
        const sections = [];
        const sectionPatterns = [
            { pattern: /\\section(\[([^\]]+)\])?\{([^}]+)\}/g, level: 1, type: 'section' },
            { pattern: /\\subsection(\[([^\]]+)\])?\{([^}]+)\}/g, level: 2, type: 'subsection' },
            { pattern: /\\subsubsection(\[([^\]]+)\])?\{([^}]+)\}/g, level: 3, type: 'subsubsection' }
        ];
        
        sectionPatterns.forEach(({ pattern, level, type }) => {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                const title = match[3];
                const optional = match[2];
                
                sections.push({
                    type: type,
                    level: level,
                    title: title,
                    subtitle: optional,
                    id: `${type}-${sections.length + 1}`
                });
            }
        });
        
        return sections;
    }

    /**
     * Process document matter divisions
     */
    processMatterDivisions(content) {
        let processed = content;
        
        // Front matter
        processed = processed.replace(
            /\\frontmatter\s*/g,
            '<div class="book-matter frontmatter">\n'
        );
        
        // Main matter
        processed = processed.replace(
            /\\mainmatter\s*/g,
            '</div>\n<div class="book-matter mainmatter">\n'
        );
        
        // Back matter
        processed = processed.replace(
            /\\backmatter\s*/g,
            '</div>\n<div class="book-matter backmatter">\n'
        );
        
        // Appendix
        processed = processed.replace(
            /\\appendix\s*/g,
            '</div>\n<div class="book-matter appendix">\n'
        );
        
        // Close all matter sections
        processed += '</div>\n';
        
        return processed;
    }

    /**
     * Process title page
     */
    processTitlePage(content) {
        const titlePageMatch = content.match(/\\begin\{titlepage\}([\s\S]*?)\\end\{titlepage\}/);
        
        if (titlePageMatch) {
            const titlePageContent = this.processTitlePageContent(titlePageMatch[1]);
            return content.replace(titlePageMatch[0], titlePageContent);
        }
        
        // Process individual components if no titlepage environment
        let processed = content;
        
        processed = this.processDedication(processed);
        processed = this.processThanks(processed);
        processed = this.processPreface(processed);
        processed = this.processTitleBlock(processed);
        
        return processed;
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
            titlePageHTML += `<div class="title-page-date">${this.processDate(dateMatch[1])}</div>\n`;
        }
        
        titlePageHTML += '</div>\n';
        return titlePageHTML;
    }

    /**
     * Process dedication
     */
    processDedication(content) {
        const dedicationMatch = content.match(/\\begin\{dedication\}([\s\S]*?)\\end\{dedication\}/);
        if (dedicationMatch) {
            return content.replace(dedicationMatch[0], 
                `<div class="dedication-page">
                    <div class="dedication-content">${dedicationMatch[1]}</div>
                </div>`
            );
        }
        return content;
    }

    /**
     * Process thanks
     */
    processThanks(content) {
        const thanksMatch = content.match(/\\begin\{thanks\}([\s\S]*?)\\end\{thanks\}/);
        if (thanksMatch) {
            return content.replace(thanksMatch[0], 
                `<div class="thanks-page">
                    <div class="thanks-content">${thanksMatch[1]}</div>
                </div>`
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
            return content.replace(prefaceMatch[0], 
                `<div class="preface">
                    <h2 class="preface-title">Preface</h2>
                    <div class="preface-content">${prefaceMatch[1]}</div>
                </div>`
            );
        }
        return content;
    }

    /**
     * Process title block
     */
    processTitleBlock(content) {
        const titleMatch = content.match(/\\title\{([^}]+)\}/);
        const authorMatch = content.match(/\\author\{([^}]+)\}/);
        const dateMatch = content.match(/\\date\{([^}]+)\}/);
        
        if (titleMatch) {
            const titlePageHTML = `<div class="title-page">
                <h1 class="title-page-title">${titleMatch[1]}</h1>
                ${authorMatch ? `<div class="title-page-author">${authorMatch[1]}</div>` : ''}
                ${dateMatch ? `<div class="title-page-date">${this.processDate(dateMatch[1])}</div>` : ''}
            </div>`;
            
            return content.replace(/\\maketitle/, titlePageHTML);
        }
        
        return content;
    }

    /**
     * Process parts
     */
    processParts(content) {
        const partPattern = /\\part(\[([^\]]+)\])?\{([^}]+)\}/g;
        
        return content.replace(partPattern, (match, optionalTitle, shortTitle, fullTitle) => {
            const partNumber = this.getPartNumber(match);
            const partId = `part-${partNumber}`;
            
            return `<div class="book-part" id="${partId}">
                <div class="part-title-page">
                    <div class="part-header">Part ${partNumber}</div>
                    <h1 class="part-title">${fullTitle}</h1>
                    ${optionalTitle ? `<h2 class="part-subtitle">${optionalTitle}</h2>` : ''}
                </div>
            </div>`;
        });
    }

    /**
     * Process chapters
     */
    processChapters(content) {
        const chapterPattern = /\\chapter(\[([^\]]+)\])?\{([^}]+)\}/g;
        
        return content.replace(chapterPattern, (match, optionalTitle, shortTitle, fullTitle) => {
            const chapterNumber = this.getChapterNumber(match);
            const chapterId = `chapter-${chapterNumber}`;
            
            return `<div class="book-chapter" id="${chapterId}">
                <div class="chapter-title-page">
                    <div class="chapter-number">Chapter ${chapterNumber}</div>
                    <h1 class="chapter-title">${fullTitle}</h1>
                    ${optionalTitle ? `<h2 class="chapter-subtitle">${optionalTitle}</h2>` : ''}
                </div>
            </div>`;
        });
    }

    /**
     * Process sections
     */
    processSections(content) {
        const sectionCommands = [
            { command: 'section', level: 1, tag: 'h3' },
            { command: 'subsection', level: 2, tag: 'h4' },
            { command: 'subsubsection', level: 3, tag: 'h5' },
            { command: 'paragraph', level: 4, tag: 'h6' }
        ];

        let processed = content;
        let currentChapter = null;

        sectionCommands.forEach(({ command, level, tag }) => {
            const pattern = new RegExp(`\\\\${command}\\{([^}]+)\\}`, 'g');
            processed = processed.replace(pattern, (match, title) => {
                // Find current chapter context
                const chapterMatch = content.substring(0, content.indexOf(match)).match(/\\chapter\{([^}]+)\}/);
                if (chapterMatch) {
                    currentChapter = chapterMatch[1].toLowerCase().replace(/\s+/g, '-');
                }
                
                const sectionId = `${currentChapter || 'chapter'}-${command}-${this.getSectionNumber(command, title)}`;
                
                return `<${tag} id="${sectionId}" class="${command}">
                    ${title}
                    <a href="#${sectionId}" class="section-anchor">Link</a>
                </${tag}>`;
            });
        });

        return processed;
    }

    /**
     * Get part number
     */
    getPartNumber(partMatch) {
        const parts = this.content ? this.content.match(/\\part\{([^}]+)\}/g) : [];
        return parts.findIndex(part => part === partMatch) + 1;
    }

    /**
     * Get chapter number
     */
    getChapterNumber(chapterMatch) {
        const chapters = this.content ? this.content.match(/\\chapter\{([^}]+)\}/g) : [];
        return chapters.findIndex(ch => ch === chapterMatch) + 1;
    }

    /**
     * Get section number
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
}

module.exports = BookStructureParser;