/**
 * Document Structure Parser
 * Handles document class, packages, and basic structure
 */

class DocumentParser {
    parse(latexContent, context) {
        let html = latexContent;
        
        // Remove document class and packages - they're handled in context
        html = html.replace(/\\documentclass\[[^\]]*\]\{[^}]*\}/g, '');
        html = html.replace(/\\documentclass\{[^}]*\}/g, '');
        html = html.replace(/\\usepackage\[[^\]]*\]\{[^}]*\}/g, '');
        html = html.replace(/\\usepackage\{[^}]*\}/g, '');
        
        // Remove bibliography and other external references
        html = html.replace(/\\bibliography\{[^}]*\}/g, '');
        html = html.replace(/\\bibliographystyle\{[^}]*\}/g, '');
        
        // Handle document environment
        html = html.replace(/\\begin\{document\}/g, '<div class="document-body">');
        html = html.replace(/\\end\{document\}/g, '</div>');
        
        // Handle maketitle
        html = html.replace(/\\maketitle/g, '<div class="title-section"></div>');
        
        // Handle newpage
        html = html.replace(/\\newpage/g, '<div class="page-break"></div>');
        html = html.replace(/\\clearpage/g, '<div class="page-break"></div>');
        
        // Handle table of contents
        html = html.replace(/\\tableofcontents/g, '<div class="table-of-contents"><h2>Table of Contents</h2><div class="toc-content"></div></div>');
        
        // Handle list of figures
        html = html.replace(/\\listoffigures/g, '<div class="list-of-figures"><h2>List of Figures</h2></div>');
        
        // Handle list of tables
        html = html.replace(/\\listoftables/g, '<div class="list-of-tables"><h2>List of Tables</h2></div>');
        
        return html;
    }
}

module.exports = DocumentParser;