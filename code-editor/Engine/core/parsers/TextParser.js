/**
 * Text Formatting Parser
 * Handles text formatting commands like \textbf, \textit, etc.
 */

class TextParser {
    parse(latexContent, context) {
        let html = latexContent;
        
        // Text formatting commands
        html = html.replace(/\\textbf\{([^}]+)\}/g, '<span class="textbf">$1</span>');
        html = html.replace(/\\textit\{([^}]+)\}/g, '<span class="textit">$1</span>');
        html = html.replace(/\\texttt\{([^}]+)\}/g, '<span class="texttt">$1</span>');
        html = html.replace(/\\emph\{([^}]+)\}/g, '<span class="emph">$1</span>');
        html = html.replace(/\\underline\{([^}]+)\}/g, '<span class="underline">$1</span>');
        html = html.replace(/\\textsc\{([^}]+)\}/g, '<span class="textsc">$1</span>');
        html = html.replace(/\\textsf\{([^}]+)\}/g, '<span class="textsf">$1</span>');
        html = html.replace(/\\textrm\{([^}]+)\}/g, '<span class="textrm">$1</span>');
        
        // Inline code
        html = html.replace(/\\`([^`]+)`/g, '<code class="inline-code">$1</code>');
        
        // Small and Large
        html = html.replace(/\\tiny\{([^}]+)\}/g, '<span class="tiny">$1</span>');
        html = html.replace(/\\small\{([^}]+)\}/g, '<span class="small">$1</span>');
        html = html.replace(/\\large\{([^}]+)\}/g, '<span class="large">$1</span>');
        html = html.replace(/\\Large\{([^}]+)\}/g, '<span class="Large">$1</span>');
        html = html.replace(/\\LARGE\{([^}]+)\}/g, '<span class="LARGE">$1</span>');
        html = html.replace(/\\huge\{([^}]+)\}/g, '<span class="huge">$1</span>');
        html = html.replace(/\\Huge\{([^}]+)\}/g, '<span class="Huge">$1</span>');
        
        // Colors
        html = html.replace(/\\textcolor\{([^}]+)\}\{([^}]+)\}/g, '<span style="color: $1">$2</span>');
        
        // Line breaks
        html = html.replace(/\\\\/g, '<br>');
        html = html.replace(/\\newline/g, '<br>');
        
        return html;
    }
}

module.exports = TextParser;