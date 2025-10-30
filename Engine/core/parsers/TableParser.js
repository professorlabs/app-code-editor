/**
 * Table Parser
 * Handles complex table structures
 */

class TableParser {
    parse(latexContent, context) {
        let html = latexContent;
        
        // Tabular environments
        html = html.replace(/\\begin\{tabular\}\{([^}]+)\}([\s\S]*?)\\end\{tabular\}/g, (match, spec, content) => {
            return `<table class="tabular">${this.parseTabularContent(content, spec)}</table>`;
        });
        
        // Tabular* environments
        html = html.replace(/\\begin\{tabular\*\}\{[^}]+\}\{([^}]+)\}([\s\S]*?)\\end\{tabular\*\}/g, (match, spec, content) => {
            return `<table class="tabular-star">${this.parseTabularContent(content, spec)}</table>`;
        });
        
        // Tabularx environments
        html = html.replace(/\\begin\{tabularx\}\{[^}]+\}\{([^}]+)\}([\s\S]*?)\\end\{tabularx\}/g, (match, spec, content) => {
            return `<table class="tabularx">${this.parseTabularContent(content, spec)}</table>`;
        });
        
        // Longtable environments
        html = html.replace(/\\begin\{longtable\}\{([^}]+)\}([\s\S]*?)\\end\{longtable\}/g, (match, spec, content) => {
            return `<table class="longtable">${this.parseTabularContent(content, spec)}</table>`;
        });
        
        // Array environments
        html = html.replace(/\\begin\{array\}\{([^}]+)\}([\s\S]*?)\\end\{array\}/g, (match, spec, content) => {
            return `<table class="array">${this.parseTabularContent(content, spec)}</table>`;
        });
        
        // Matrix environments
        ['matrix', 'pmatrix', 'bmatrix', 'vmatrix', 'Vmatrix'].forEach(env => {
            const regex = new RegExp(`\\\\begin\\{${env}\\}([\\s\\S]*?)\\\\end\\{${env}\\}`, 'g');
            html = html.replace(regex, (match, content) => {
                const delimiters = {
                    'matrix': ['', ''],
                    'pmatrix': ['(', ')'],
                    'bmatrix': ['[', ']'],
                    'vmatrix': ['|', '|'],
                    'Vmatrix': ['‖', '‖']
                };
                const [left, right] = delimiters[env];
                const tableContent = this.parseTabularContent(content, 'c');
                return `<span class="matrix">${left}<table class="matrix-table">${tableContent}</table>${right}</span>`;
            });
        });
        
        // Table styling commands
        html = html.replace(/\\hline/g, '<tr class="hline"><td colspan="100"><hr></td></tr>');
        html = html.replace(/\\cline\{([^}]+)\}/g, (match, cols) => {
            return `<tr class="cline"><td colspan="100"><hr class="cline-${cols}"></td></tr>`;
        });
        
        html = html.replace(/\\vline/g, '<span class="vline"></span>');
        
        // Multicolumn
        html = html.replace(/\\multicolumn\{(\d+)\}\{([^}]+)\}\{([^}]*)\}/g, (match, colspan, align, content) => {
            return `<td colspan="${colspan}" class="multicolumn" style="text-align: ${this.getAlignment(align)}">${content}</td>`;
        });
        
        // Multirow
        html = html.replace(/\\multirow\{(\d+)\}\{[^}]*\}\{([^}]*)\}/g, (match, rowspan, content) => {
            return `<td rowspan="${rowspan}" class="multirow">${content}</td>`;
        });
        
        return html;
    }
    
    parseTabularContent(content, spec) {
        const rows = content.split('\\\\').filter(row => row.trim());
        let html = '';
        
        rows.forEach((row, index) => {
            const cells = this.parseTableRow(row, spec);
            const isHeader = this.shouldBeHeader(row, index);
            const tag = isHeader ? 'th' : 'td';
            
            html += '<tr>';
            cells.forEach(cell => {
                html += `<${tag}>${cell}</${tag}>`;
            });
            html += '</tr>';
        });
        
        return html;
    }
    
    parseTableRow(row, spec) {
        // Handle ampersands that are escaped
        row = row.replace(/\\&/g, '___AMPERSAND___');
        
        const cells = row.split('&').map(cell => {
            // Restore escaped ampersands
            return cell.replace(/___AMPERSAND___/g, '&');
        }).map(cell => cell.trim());
        
        return cells;
    }
    
    getAlignment(alignSpec) {
        if (alignSpec.includes('c')) return 'center';
        if (alignSpec.includes('l')) return 'left';
        if (alignSpec.includes('r')) return 'right';
        return 'left';
    }
    
    shouldBeHeader(row, index) {
        // Simple heuristic: first row is often a header
        return index === 0 && row.includes('\\textbf');
    }
}

module.exports = TableParser;