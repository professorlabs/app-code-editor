/**
 * Structure Parser
 * Handles sections, subsections, and document structure
 */

class StructureParser {
    parse(latexContent, context) {
        let html = latexContent;
        let sectionCounter = 0;
        let subsectionCounter = 0;
        let subsubsectionCounter = 0;
        
        // Sections and subsections
        html = html.replace(/\\section\{([^}]+)\}/g, (match, title) => {
            sectionCounter++;
            subsectionCounter = 0;
            subsubsectionCounter = 0;
            const id = `section-${sectionCounter}`;
            return `<h1 id="${id}">${title}</h1>`;
        });
        
        html = html.replace(/\\subsection\{([^}]+)\}/g, (match, title) => {
            subsectionCounter++;
            subsubsectionCounter = 0;
            const id = `section-${sectionCounter}-${subsectionCounter}`;
            return `<h2 id="${id}">${title}</h2>`;
        });
        
        html = html.replace(/\\subsubsection\{([^}]+)\}/g, (match, title) => {
            subsubsectionCounter++;
            const id = `section-${sectionCounter}-${subsectionCounter}-${subsubsectionCounter}`;
            return `<h3 id="${id}">${title}</h3>`;
        });
        
        html = html.replace(/\\paragraph\{([^}]+)\}/g, (match, title) => {
            return `<h4>${title}</h4>`;
        });
        
        html = html.replace(/\\subparagraph\{([^}]+)\}/g, (match, title) => {
            return `<h5>${title}</h5>`;
        });
        
        // Abstract environment
        html = html.replace(/\\begin\{abstract\}([\s\S]*?)\\end\{abstract\}/g, (match, content) => {
            return `<div class="abstract">
                <div class="abstract-title">Abstract</div>
                <div class="abstract-content">${content}</div>
            </div>`;
        });
        
        // Keywords
        html = html.replace(/\\keywords\{([^}]+)\}/g, (match, keywords) => {
            const keywordList = keywords.split(',').map(k => k.trim()).join(', ');
            return `<div class="keywords"><strong>Keywords:</strong> ${keywordList}</div>`;
        });
        
        // Bibliography
        html = html.replace(/\\begin\{thebibliography\}\{([^}]+)\}([\s\S]*?)\\end\{thebibliography\}/g, (match, label, content) => {
            return `<div class="bibliography">
                <h2>References</h2>
                <div class="bibliography-content">${content}</div>
            </div>`;
        });
        
        // Bibliography items
        html = html.replace(/\\bibitem\{([^}]+)\}([\s\S]*?)(?=\\bibitem\{|\\end\{thebibliography\})/g, (match, key, content) => {
            return `<div class="bibitem" id="bib-${key}">${content.trim()}</div>`;
        });
        
        // Quotes
        html = html.replace(/\\begin\{quote\}([\s\S]*?)\\end\{quote\}/g, (match, content) => {
            return `<blockquote>${content}</blockquote>`;
        });
        
        html = html.replace(/\\begin\{quotation\}([\s\S]*?)\\end\{quotation\}/g, (match, content) => {
            return `<blockquote class="quotation">${content}</blockquote>`;
        });
        
        // Verse
        html = html.replace(/\\begin\{verse\}([\s\S]*?)\\end\{verse\}/g, (match, content) => {
            return `<div class="verse">${content.replace(/\\\\/g, '<br>')}</div>`;
        });
        
        return html;
    }
}

module.exports = StructureParser;