/**
 * Figure and Table Parser
 * Handles figures, tables, captions, and references
 */

class FigureParser {
    parse(latexContent, context) {
        let html = latexContent;
        let figureCounter = 1;
        let tableCounter = 1;
        
        // Figure environment
        html = html.replace(/\\begin\{figure\}([\s\S]*?)\\end\{figure\}/g, (match, content) => {
            const id = `fig-${figureCounter}`;
            figureCounter++;
            
            // Extract caption
            const captionMatch = content.match(/\\caption\{([^}]+)\}/);
            const caption = captionMatch ? captionMatch[1] : '';
            
            // Extract label
            const labelMatch = content.match(/\\label\{([^}]+)\}/);
            const label = labelMatch ? labelMatch[1] : id;
            
            // Extract centering
            const centering = content.includes('\\centering');
            
            // Extract includegraphics
            const imgMatch = content.match(/\\includegraphics\[([^\]]*)\]\{([^}]+)\}/);
            if (imgMatch) {
                const options = imgMatch[1];
                const filename = imgMatch[2];
                const imgStyle = this.parseImageOptions(options);
                
                return `<div class="figure" id="${label}">
                    <div class="figure-content ${centering ? 'center' : ''}">
                        <img src="${filename}" alt="${caption}" ${imgStyle}>
                    </div>
                    <div class="figure-caption">Figure ${figureCounter-1}: ${caption}</div>
                </div>`;
            }
            
            // Fallback for figures without images
            return `<div class="figure" id="${label}">
                <div class="figure-content">${content}</div>
                <div class="figure-caption">Figure ${figureCounter-1}: ${caption}</div>
            </div>`;
        });
        
        // Table environment
        html = html.replace(/\\begin\{table\}([\s\S]*?)\\end\{table\}/g, (match, content) => {
            const id = `tab-${tableCounter}`;
            tableCounter++;
            
            // Extract caption
            const captionMatch = content.match(/\\caption\{([^}]+)\}/);
            const caption = captionMatch ? captionMatch[1] : '';
            
            // Extract label
            const labelMatch = content.match(/\\label\{([^}]+)\}/);
            const label = labelMatch ? labelMatch[1] : id;
            
            // Extract tabular content
            const tabularMatch = content.match(/\\begin\{tabular\}\{([^}]*)\}([\s\S]*?)\\end\{tabular\}/);
            if (tabularMatch) {
                const columnSpec = tabularMatch[1];
                const tableContent = tabularMatch[2];
                const tableHtml = this.parseTabular(tableContent, columnSpec);
                
                return `<div class="table" id="${label}">
                    <div class="table-content">
                        <table>${tableHtml}</table>
                    </div>
                    <div class="table-caption">Table ${tableCounter-1}: ${caption}</div>
                </div>`;
            }
            
            return `<div class="table" id="${label}">
                <div class="table-content">${content}</div>
                <div class="table-caption">Table ${tableCounter-1}: ${caption}</div>
            </div>`;
        });
        
        // Cross-references
        html = html.replace(/\\ref\{([^}]+)\}/g, (match, label) => {
            // Simple implementation - just return the label
            return `<a href="#${label}" class="ref">[${label}]</a>`;
        });
        
        html = html.replace(/\\pageref\{([^}]+)\}/g, (match, label) => {
            return `<a href="#${label}" class="pageref">[p.?]</a>`;
        });
        
        // Simple includegraphics outside figure environment
        html = html.replace(/\\includegraphics\[([^\]]*)\]\{([^}]+)\}/g, (match, options, filename) => {
            const imgStyle = this.parseImageOptions(options);
            return `<img src="${filename}" alt="${filename}" ${imgStyle} class="inline-image">`;
        });
        
        return html;
    }
    
    parseImageOptions(options) {
        let style = '';
        
        // Parse width
        const widthMatch = options.match(/width=([^\s,]+)/);
        if (widthMatch) {
            const width = widthMatch[1];
            if (width.includes('\\textwidth')) {
                const percent = parseFloat(width.replace('\\textwidth', '').replace('\\', '')) || 1;
                style += `width: ${(percent * 100)}%; `;
            } else if (width.includes('cm')) {
                const cm = parseFloat(width.replace('cm', ''));
                style += `width: ${cm}cm; `;
            } else {
                style += `width: ${width}; `;
            }
        }
        
        // Parse height
        const heightMatch = options.match(/height=([^\s,]+)/);
        if (heightMatch) {
            const height = heightMatch[1];
            if (height.includes('cm')) {
                const cm = parseFloat(height.replace('cm', ''));
                style += `height: ${cm}cm; `;
            } else {
                style += `height: ${height}; `;
            }
        }
        
        // Parse scale
        const scaleMatch = options.match(/scale=([^\s,]+)/);
        if (scaleMatch) {
            const scale = parseFloat(scaleMatch[1]);
            style += `transform: scale(${scale}); transform-origin: center; `;
        }
        
        return style;
    }
    
    parseTabular(content, columnSpec) {
        const rows = content.trim().split('\\\\').filter(row => row.trim());
        let html = '';
        
        rows.forEach((row, index) => {
            const cells = row.split('&').map(cell => cell.trim());
            const isHeader = index === 0;
            const tag = isHeader ? 'th' : 'td';
            
            html += '<tr>';
            cells.forEach(cell => {
                html += `<${tag}>${cell}</${tag}>`;
            });
            html += '</tr>';
        });
        
        return html;
    }
}

module.exports = FigureParser;