/**
 * NiceMatrix Parser
 * Advanced matrix parser with NiceMatrix package support for enhanced mathematical matrices
 */

class NiceMatrixParser {
    constructor() {
        this.matrixCounter = 1;
        this.niceMatrixEnvironments = [
            'NiceMatrix', 'bNiceMatrix', 'pNiceMatrix', 'vNiceMatrix', 'VNiceMatrix',
            'NiceMatrixC', 'NiceMatrixR', 'NiceMatrixWithCursors',
            'NiceTabular', 'NiceTabular*'
        ];
        
        this.niceMatrixOptions = {
            // Column types
            'C': 'center',
            'L': 'left', 
            'R': 'right',
            'c': 'center',
            'l': 'left',
            'r': 'right',
            
            // Special column types
            'X': 'expand',
            'S': 'decimal',
            'I': 'italic',
            'B': 'bold',
            'U': 'underline',
            
            // Vertical rules
            '|': 'thick-rule',
            '||': 'double-rule',
            ':': 'dotted-rule',
            ';': 'dashed-rule'
        };
        
        this.colors = {
            'red': '#FF0000', 'blue': '#0000FF', 'green': '#00FF00', 'yellow': '#FFFF00',
            'orange': '#FFA500', 'purple': '#800080', 'pink': '#FFC0CB', 'brown': '#A52A2A',
            'black': '#000000', 'white': '#FFFFFF', 'gray': '#808080', 'cyan': '#00FFFF',
            'magenta': '#FF00FF', 'lime': '#00FF00', 'navy': '#000080', 'teal': '#008080'
        };
    }

    parse(latexContent, context) {
        let html = latexContent;
        
        // Parse all NiceMatrix environments
        this.niceMatrixEnvironments.forEach(env => {
            const regex = new RegExp(`\\\\begin\\{${env}\\}(?:\\[([^\\]]*)\\])?([\\s\\S]*?)\\\\end\\{${env}\\}`, 'g');
            html = html.replace(regex, (match, options, content) => {
                return this.parseNiceMatrix(content, env, options);
            });
        });
        
        // Parse \Matrix command
        html = html.replace(/\\Matrix\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, (match, content) => {
            return this.parseInlineMatrix(content);
        });
        
        // Parse enhanced matrix commands with options
        html = html.replace(/\\(NiceMatrix|bNiceMatrix|pNiceMatrix|vNiceMatrix|VNiceMatrix)(\[([^\]]*)\])?\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, (match, type, optionsStr, options, content) => {
            return this.parseInlineNiceMatrix(content, type, options);
        });
        
        return html;
    }
    
    parseNiceMatrix(content, environment, options = '') {
        const id = `nicematrix-${this.matrixCounter}`;
        this.matrixCounter++;
        
        // Parse options
        const matrixOptions = this.parseNiceMatrixOptions(options);
        
        // Parse column specification
        const columnSpec = this.extractColumnSpec(content);
        
        // Parse matrix content
        const matrixContent = this.extractMatrixContent(content);
        
        // Parse rows
        const rows = matrixContent.split('\\\\').filter(row => row.trim());
        const matrixHtml = this.parseMatrixRows(rows, columnSpec, matrixOptions);
        
        // Determine delimiters based on environment
        const delimiters = this.getDelimiters(environment);
        
        // Generate matrix HTML
        const html = `<span class="nice-matrix ${environment.toLowerCase()}" id="${id}">
            ${this.renderMatrixWithDecorations(matrixHtml, delimiters, matrixOptions, columnSpec)}
        </span>`;
        
        return html;
    }
    
    parseNiceMatrixOptions(optionsString) {
        const options = {
            cellBackground: null,
            rowColors: [],
            columnColors: [],
            borders: [],
            corners: 'rounded',
            rules: 'standard',
            lineHeight: '1.2',
            columnSpacing: 'normal'
        };
        
        if (!optionsString) return options;
        
        // Parse cell background colors
        const cellBgMatch = optionsString.match(/cell-background-color\s*=\s*([a-zA-Z]+)/);
        if (cellBgMatch) {
            options.cellBackground = this.colors[cellBgMatch[1].toLowerCase()] || cellBgMatch[1];
        }
        
        // Parse row colors
        const rowColorsMatch = optionsString.match(/row-colors\s*=\s*\{([^}]+)\}/);
        if (rowColorsMatch) {
            options.rowColors = rowColorsMatch[1].split(',').map(color => color.trim().toLowerCase());
        }
        
        // Parse column colors
        const colColorsMatch = optionsString.match(/column-colors\s*=\s*\{([^}]+)\}/);
        if (colColorsMatch) {
            options.columnColors = colColorsMatch[1].split(',').map(color => color.trim().toLowerCase());
        }
        
        // Parse line height
        const lineHeightMatch = optionsString.match(/line-height\s*=\s*([\d.]+)/);
        if (lineHeightMatch) {
            options.lineHeight = lineHeightMatch[1];
        }
        
        // Parse column spacing
        const colSpacingMatch = optionsString.match(/column-sep\s*=\s*([\d.]+(?:em|px|pt))/);
        if (colSpacingMatch) {
            options.columnSpacing = colSpacingMatch[1];
        }
        
        return options;
    }
    
    extractColumnSpec(content) {
        // Try to extract column specification from \begin{NiceMatrix}[options]{cols}
        const specMatch = content.match(/^{([^{}]+)}/);
        if (specMatch) {
            return specMatch[1];
        }
        
        // Default to centered columns
        return 'c';
    }
    
    extractMatrixContent(content) {
        // Remove column specification if present
        let matrixContent = content.replace(/^{([^{}]+)}/, '').trim();
        
        // Remove any leading options that weren't caught
        matrixContent = matrixContent.replace(/^\[.*?\]/, '').trim();
        
        return matrixContent;
    }
    
    parseMatrixRows(rows, columnSpec, options) {
        const numColumns = columnSpec.length;
        const rowHtml = [];
        
        rows.forEach((row, rowIndex) => {
            const cells = this.parseMatrixRow(row, numColumns, rowIndex, options);
            rowHtml.push(cells);
        });
        
        return rowHtml;
    }
    
    parseMatrixRow(row, numColumns, rowIndex, options) {
        const cells = row.split('&').map(cell => cell.trim());
        const cellHtml = [];
        
        for (let colIndex = 0; colIndex < numColumns; colIndex++) {
            const cellContent = cells[colIndex] || '';
            const cellType = columnSpec[colIndex] || 'c';
            
            // Apply row coloring
            let backgroundColor = '';
            if (options.rowColors.length > 0) {
                const colorIndex = rowIndex % options.rowColors.length;
                const rowColor = options.rowColors[colorIndex];
                if (this.colors[rowColor]) {
                    backgroundColor = `background-color: ${this.colors[rowColor]};`;
                }
            }
            
            // Apply column coloring
            if (options.columnColors.length > 0 && options.columnColors[colIndex]) {
                const colColor = options.columnColors[colIndex];
                if (this.colors[colColor]) {
                    backgroundColor += `background-color: ${this.colors[colColor]};`;
                }
            }
            
            // Apply cell background
            if (options.cellBackground) {
                backgroundColor = `background-color: ${options.cellBackground};`;
            }
            
            const styleAttr = backgroundColor ? `style="${backgroundColor}"` : '';
            
            cellHtml.push(`<td class="nice-matrix-cell cell-type-${this.niceMatrixOptions[cellType] || cellType}" ${styleAttr}>${cellContent}</td>`);
        }
        
        return cellHtml.join('');
    }
    
    getDelimiters(environment) {
        const delimiterMap = {
            'NiceMatrix': { left: '', right: '' },
            'bNiceMatrix': { left: '[', right: ']' },
            'pNiceMatrix': { left: '(', right: ')' },
            'vNiceMatrix': { left: '|', right: '|' },
            'VNiceMatrix': { left: '‖', right: '‖' },
            'NiceMatrixC': { left: '', right: '' },
            'NiceMatrixR': { left: '', right: '' }
        };
        
        return delimiterMap[environment] || { left: '', right: '' };
    }
    
    renderMatrixWithDecorations(matrixHtml, delimiters, options, columnSpec) {
        const hasRules = this.hasColumnRules(columnSpec);
        const tableClass = hasRules ? 'nice-matrix-table with-rules' : 'nice-matrix-table';
        
        let html = `<span class="matrix-delim matrix-left">${delimiters.left}</span>`;
        html += `<table class="${tableClass}" style="line-height: ${options.lineHeight};">`;
        
        // Add column group for styling
        html += '<colgroup>';
        for (let i = 0; i < columnSpec.length; i++) {
            const colType = this.niceMatrixOptions[columnSpec[i]] || columnSpec[i];
            html += `<col class="column-${colType}">`;
        }
        html += '</colgroup>';
        
        // Add rows
        matrixHtml.forEach((rowContent, rowIndex) => {
            html += `<tr class="nice-matrix-row row-${rowIndex}">${rowContent}</tr>`;
        });
        
        html += '</table>';
        html += `<span class="matrix-delim matrix-right">${delimiters.right}</span>`;
        
        return html;
    }
    
    hasColumnRules(columnSpec) {
        return columnSpec.includes('|') || columnSpec.includes('||') || 
               columnSpec.includes(':') || columnSpec.includes(';');
    }
    
    parseInlineMatrix(content) {
        const rows = content.split('\\\\').filter(row => row.trim());
        const maxCols = Math.max(...rows.map(row => row.split('&').length));
        
        let html = '<span class="inline-matrix">(';
        html += '<table class="inline-matrix-table">';
        
        rows.forEach((row, rowIndex) => {
            const cells = row.split('&').map(cell => cell.trim());
            const cellsHtml = [];
            
            for (let i = 0; i < maxCols; i++) {
                cellsHtml.push(`<td class="inline-matrix-cell">${cells[i] || ''}</td>`);
            }
            
            html += `<tr>${cellsHtml.join('')}</tr>`;
        });
        
        html += '</table>)</span>';
        return html;
    }
    
    parseInlineNiceMatrix(content, type, options = '') {
        const matrixOptions = this.parseNiceMatrixOptions(options);
        const rows = content.split('\\\\').filter(row => row.trim());
        const maxCols = Math.max(...rows.map(row => row.split('&').length));
        
        const delimiters = this.getDelimiters(type);
        
        let html = '<span class="inline-nice-matrix">';
        html += `<span class="matrix-delim">${delimiters.left}</span>`;
        html += '<table class="inline-nice-matrix-table">';
        
        rows.forEach((row, rowIndex) => {
            const cells = row.split('&').map(cell => cell.trim());
            const cellsHtml = [];
            
            for (let i = 0; i < maxCols; i++) {
                let backgroundColor = '';
                if (matrixOptions.rowColors.length > 0) {
                    const colorIndex = rowIndex % matrixOptions.rowColors.length;
                    const rowColor = matrixOptions.rowColors[colorIndex];
                    if (this.colors[rowColor]) {
                        backgroundColor = `background-color: ${this.colors[rowColor]};`;
                    }
                }
                
                const styleAttr = backgroundColor ? `style="${backgroundColor}"` : '';
                cellsHtml.push(`<td class="inline-nice-matrix-cell" ${styleAttr}>${cells[i] || ''}</td>`);
            }
            
            html += `<tr>${cellsHtml.join('')}</tr>`;
        });
        
        html += '</table>';
        html += `<span class="matrix-delim">${delimiters.right}</span>`;
        html += '</span>';
        
        return html;
    }
    
    // Support for NiceMatrix block commands
    parseNiceMatrixBlocks(latexContent) {
        let html = latexContent;
        
        // Parse \Block command for merging cells
        html = html.replace(/\\Block\{(\d+)-(\d+)\}\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, (match, rows, cols, content) => {
            return `<span class="nice-matrix-block" style="grid-row: span ${rows}; grid-column: span ${cols};">${content}</span>`;
        });
        
        // Parse \CircledValue command
        html = html.replace(/\\CircledValue\{([^{}]+)\}/g, (match, value) => {
            return `<span class="circled-value">${value}</span>`;
        });
        
        // Parse \DottedValue command
        html = html.replace(/\\DottedValue\{([^{}]+)\}/g, (match, value) => {
            return `<span class="dotted-value">${value}</span>`;
        });
        
        // Parse \Underline command
        html = html.replace(/\\Underline\{([^{}]+)\}/g, (match, content) => {
            return `<span class="underline">${content}</span>`;
        });
        
        // Parse \Overline command
        html = html.replace(/\\Overline\{([^{}]+)\}/g, (match, content) => {
            return `<span class="overline">${content}</span>`;
        });
        
        return html;
    }
    
    // Support for NiceMatrix cursor commands
    parseNiceMatrixCursors(latexContent) {
        let html = latexContent;
        
        // Parse \ShowPoints command
        html = html.replace(/\\ShowPoints/g, '<span class="show-points"></span>');
        
        // Parse \ShowPoints[xcolor] command
        html = html.replace(/\\ShowPoints\[([^\]]+)\]/g, (match, color) => {
            const colorValue = this.colors[color.toLowerCase()] || color;
            return `<span class="show-points" style="color: ${colorValue};"></span>`;
        });
        
        // Parse \SubMatrix command
        html = html.replace(/\\SubMatrix\{([^,]+),([^,]+),([^,]+),([^}]+)\}/g, (match, row1, col1, row2, col2) => {
            return `<span class="submatrix" data-coords="${row1},${col1},${row2},${col2}"></span>`;
        });
        
        // Parse \Diagonal command
        html = html.replace(/\\Diagonal/g, '<span class="matrix-diagonal"></span>');
        
        // Parse \Diagonal\* command (anti-diagonal)
        html = html.replace(/\\Diagonal\*/g, '<span class="matrix-anti-diagonal"></span>');
        
        return html;
    }
}

module.exports = NiceMatrixParser;