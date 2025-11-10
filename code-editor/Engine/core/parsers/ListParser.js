/**
 * List Parser
 * Handles itemize, enumerate, and description lists
 */

class ListParser {
    parse(latexContent, context) {
        let html = latexContent;
        
        // Itemize lists (bulleted)
        html = html.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (match, content) => {
            const items = this.parseItems(content, 'itemize');
            return `<ul class="itemize">${items}</ul>`;
        });
        
        // Enumerate lists (numbered)
        html = html.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, (match, content) => {
            const items = this.parseItems(content, 'enumerate');
            return `<ol class="enumerate">${items}</ol>`;
        });
        
        // Description lists
        html = html.replace(/\\begin\{description\}([\s\S]*?)\\end\{description\}/g, (match, content) => {
            const items = this.parseDescriptionItems(content);
            return `<dl class="description">${items}</dl>`;
        });
        
        // Custom list styles
        html = html.replace(/\\begin\{itemize\}\[([^\]]*)\]([\s\S]*?)\\end\{itemize\}/g, (match, style, content) => {
            const items = this.parseItems(content, 'itemize');
            const styleClass = this.getListStyle(style);
            return `<ul class="itemize ${styleClass}">${items}</ul>`;
        });
        
        return html;
    }
    
    parseItems(content, listType) {
        const itemPattern = /\\item\s*(.*?)(?=\\item|\\end\{)/gs;
        const items = [];
        let match;
        
        while ((match = itemPattern.exec(content)) !== null) {
            const itemContent = match[1].trim();
            items.push(`<li>${itemContent}</li>`);
        }
        
        return items.join('\n');
    }
    
    parseDescriptionItems(content) {
        const itemPattern = /\\item\[([^\]]*)\]\s*(.*?)(?=\\item|\\end\{)/gs;
        const items = [];
        let match;
        
        while ((match = itemPattern.exec(content)) !== null) {
            const term = match[1].trim();
            const description = match[2].trim();
            items.push(`<dt>${term}</dt><dd>${description}</dd>`);
        }
        
        return items.join('\n');
    }
    
    getListStyle(style) {
        if (style.includes('circle')) return 'list-circle';
        if (style.includes('square')) return 'list-square';
        if (style.includes('diamond')) return 'list-diamond';
        if (style.includes('asterisk')) return 'list-asterisk';
        return '';
    }
}

module.exports = ListParser;