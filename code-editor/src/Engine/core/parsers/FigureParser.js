/**
 * Advanced Figure and Table Parser
 * Comprehensive float environment parser with subfigure, algorithm, and placement support
 */

class FigureParser {
    constructor() {
        this.figureCounter = 1;
        this.tableCounter = 1;
        this.algorithmCounter = 1;
        this.subfigureCounter = 1;
        
        this.figures = new Map(); // Store figure references
        this.tables = new Map(); // Store table references
        this.algorithms = new Map(); // Store algorithm references
    }

    parse(latexContent, context) {
        let html = latexContent;
        
        // Enhanced figure environment with placement and options
        html = html.replace(/\\begin\{figure\}(?:\[([^\]]*)\])?([\s\S]*?)\\end\{figure\}/g, (match, placement, content) => {
            return this.parseFigureEnvironment(content, placement);
        });
        
        // Subfigure support
        html = html.replace(/\\begin\{subfigure\}(?:\[([^\]]*)\])?([\s\S]*?)\\end\{subfigure\}/g, (match, options, content) => {
            return this.parseSubfigure(content, options);
        });
        
        // Figure* environment (double column figures)
        html = html.replace(/\\begin\{figure\*\}(?:\[([^\]]*)\])?([\s\S]*?)\\end\{figure\*\}/g, (match, placement, content) => {
            return this.parseFigureEnvironment(content, placement, true);
        });
        
        // Enhanced table environment
        html = html.replace(/\\begin\{table\}(?:\[([^\]]*)\])?([\s\S]*?)\\end\{table\}/g, (match, placement, content) => {
            return this.parseTableEnvironment(content, placement);
        });
        
        // Table* environment (double column tables)
        html = html.replace(/\\begin\{table\*\}(?:\[([^\]]*)\])?([\s\S]*?)\\end\{table\*\}/g, (match, placement, content) => {
            return this.parseTableEnvironment(content, placement, true);
        });
        
        // Algorithm environment
        html = html.replace(/\\begin\{algorithm\}(?:\[([^\]]*)\])?([\s\S]*?)\\end\{algorithm\}/g, (match, placement, content) => {
            return this.parseAlgorithmEnvironment(content, placement);
        });
        
        // Algorithmic environment
        html = html.replace(/\\begin\{algorithmic\}([\s\S]*?)\\end\{algorithmic\}/g, (match, content) => {
            return this.parseAlgorithmicEnvironment(content);
        });
        
        // Enhanced cross-references with label resolution
        html = html.replace(/\\ref\{([^}]+)\}/g, (match, label) => {
            return this.createReference(label);
        });
        
        html = html.replace(/\\pageref\{([^}]+)\}/g, (match, label) => {
            return `<a href="#${label}" class="pageref">[p.?]</a>`;
        });
        
        // Enhanced includegraphics outside figure environment
        html = html.replace(/\\includegraphics\[([^\]]*)\]\{([^}]+)\}/g, (match, options, filename) => {
            const imgStyle = this.parseImageOptions(options);
            return `<img src="${filename}" alt="${filename}" ${imgStyle} class="inline-image">`;
        });
        
        return html;
    }
    
    parseFigureEnvironment(content, placement = '', isDoubleColumn = false) {
        const id = `fig-${this.figureCounter}`;
        this.figureCounter++;
        
        // Extract caption
        const captionMatch = content.match(/\\caption\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/);
        const caption = captionMatch ? captionMatch[1] : '';
        
        // Extract label
        const labelMatch = content.match(/\\label\{([^}]+)\}/);
        const label = labelMatch ? labelMatch[1] : id;
        
        // Extract centering
        const centering = content.includes('\\centering');
        
        // Extract figure options
        const figureOptions = this.parseFigureOptions(content);
        
        // Check if this contains subfigures
        const hasSubfigures = content.includes('\\begin{subfigure}');
        
        let figureContent = '';
        
        if (hasSubfigures) {
            // Handle subfigures
            const subfigureHtml = this.processSubfigures(content);
            figureContent = `<div class="subfigures-container">${subfigureHtml}</div>`;
        } else {
            // Handle single figure
            const imgMatch = content.match(/\\includegraphics\[([^\]]*)\]\{([^}]+)\}/);
            if (imgMatch) {
                const options = imgMatch[1];
                const filename = imgMatch[2];
                const imgStyle = this.parseImageOptions(options);
                
                figureContent = `<div class="figure-content ${centering ? 'center' : ''}">
                    <img src="${filename}" alt="${caption}" ${imgStyle}>
                </div>`;
            } else {
                // Handle TikZ pictures or other content
                const tikzMatch = content.match(/\\begin\{tikzpicture\}([\s\S]*?)\\end\{tikzpicture\}/);
                if (tikzMatch) {
                    figureContent = `<div class="figure-content ${centering ? 'center' : ''}">
                        <div class="tikz-diagram">TikZ Diagram: ${tikzMatch[1].substring(0, 50)}...</div>
                    </div>`;
                } else {
                    figureContent = `<div class="figure-content">${content}</div>`;
                }
            }
        }
        
        // Store reference
        this.figures.set(label, { 
            number: this.figureCounter - 1, 
            caption, 
            type: 'figure',
            placement 
        });
        
        const placementClass = placement ? ` placement-${placement.replace(/[^a-zA-Z]/g, '')}` : '';
        const doubleColumnClass = isDoubleColumn ? ' double-column' : '';
        
        return `<div class="figure${placementClass}${doubleColumnClass}" id="${label}">
            ${figureContent}
            <div class="figure-caption">Figure ${this.figureCounter - 1}: ${this.convertMath(caption)}</div>
        </div>`;
    }
    
    parseSubfigure(content, options = '') {
        const id = `subfig-${this.subfigureCounter}`;
        this.subfigureCounter++;
        
        // Extract subcaption
        const subcaptionMatch = content.match(/\\caption\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/);
        const subcaption = subcaptionMatch ? subcaptionMatch[1] : '';
        
        // Extract label
        const labelMatch = content.match(/\\label\{([^}]+)\}/);
        const label = labelMatch ? labelMatch[1] : id;
        
        // Parse subfigure options (width, etc.)
        const subfigureOptions = this.parseSubfigureOptions(options);
        
        // Extract includegraphics
        let imageContent = '';
        const imgMatch = content.match(/\\includegraphics\[([^\]]*)\]\{([^}]+)\}/);
        if (imgMatch) {
            const imgOptions = imgMatch[1];
            const filename = imgMatch[2];
            const imgStyle = this.parseImageOptions(imgOptions);
            imageContent = `<img src="${filename}" alt="${subcaption}" ${imgStyle}>`;
        }
        
        // Store subfigure reference
        this.figures.set(label, { 
            number: `${String.fromCharCode(96 + (this.subfigureCounter - 1) % 26)}`, // a, b, c, ...
            caption: subcaption, 
            type: 'subfigure',
            parent: this.figureCounter
        });
        
        const widthStyle = subfigureOptions.width ? `style="width: ${subfigureOptions.width};"` : '';
        
        return `<div class="subfigure" id="${label}" ${widthStyle}>
            <div class="subfigure-content">
                ${imageContent}
            </div>
            <div class="subfigure-caption">(${String.fromCharCode(96 + (this.subfigureCounter - 1) % 26)}) ${this.convertMath(subcaption)}</div>
        </div>`;
    }
    
    processSubfigures(content) {
        const subfigures = [];
        const subfigureRegex = /\\begin\{subfigure\}(?:\[([^\]]*)\])?([\s\S]*?)\\end\{subfigure\}/g;
        let match;
        
        while ((match = subfigureRegex.exec(content)) !== null) {
            const options = match[1] || '';
            const subfigureContent = match[2];
            subfigures.push(this.parseSubfigure(subfigureContent, options));
        }
        
        return subfigures.join('\n');
    }
    
    parseTableEnvironment(content, placement = '', isDoubleColumn = false) {
        const id = `tab-${this.tableCounter}`;
        this.tableCounter++;
        
        // Extract caption
        const captionMatch = content.match(/\\caption\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/);
        const caption = captionMatch ? captionMatch[1] : '';
        
        // Extract label
        const labelMatch = content.match(/\\label\{([^}]+)\}/);
        const label = labelMatch ? labelMatch[1] : id;
        
        // Extract centering
        const centering = content.includes('\\centering');
        
        // Extract tabular content (try multiple environments)
        let tableHtml = '';
        const environments = ['tabular', 'tabularx', 'longtable', 'array'];
        
        for (const env of environments) {
            const tabularMatch = content.match(new RegExp(`\\\\begin\\{${env}\\}\\{([^}]*)\\}([\\s\\S]*?)\\\\end\\{${env}\\}`));
            if (tabularMatch) {
                const columnSpec = tabularMatch[1];
                const tableContent = tabularMatch[2];
                tableHtml = this.parseTabular(tableContent, columnSpec, env);
                break;
            }
        }
        
        if (!tableHtml) {
            tableHtml = `<tr><td>Table content could not be parsed</td></tr>`;
        }
        
        // Store reference
        this.tables.set(label, { 
            number: this.tableCounter - 1, 
            caption, 
            type: 'table',
            placement 
        });
        
        const placementClass = placement ? ` placement-${placement.replace(/[^a-zA-Z]/g, '')}` : '';
        const doubleColumnClass = isDoubleColumn ? ' double-column' : '';
        
        return `<div class="table${placementClass}${doubleColumnClass}" id="${label}">
            <div class="table-content ${centering ? 'center' : ''}">
                <table class="latex-table">${tableHtml}</table>
            </div>
            <div class="table-caption">Table ${this.tableCounter - 1}: ${this.convertMath(caption)}</div>
        </div>`;
    }
    
    parseAlgorithmEnvironment(content, placement = '') {
        const id = `algo-${this.algorithmCounter}`;
        this.algorithmCounter++;
        
        // Extract caption
        const captionMatch = content.match(/\\caption\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/);
        const caption = captionMatch ? captionMatch[1] : '';
        
        // Extract label
        const labelMatch = content.match(/\\label\{([^}]+)\}/);
        const label = labelMatch ? labelMatch[1] : id;
        
        // Extract algorithmic content
        const algorithmicMatch = content.match(/\\begin\{algorithmic\}([\s\S]*?)\\end\{algorithmic\}/);
        let algorithmContent = '';
        
        if (algorithmicMatch) {
            algorithmContent = this.parseAlgorithmicEnvironment(algorithmicMatch[1]);
        } else {
            algorithmContent = `<div class="algorithm-content">${content}</div>`;
        }
        
        // Store reference
        this.algorithms.set(label, { 
            number: this.algorithmCounter - 1, 
            caption, 
            type: 'algorithm',
            placement 
        });
        
        const placementClass = placement ? ` placement-${placement.replace(/[^a-zA-Z]/g, '')}` : '';
        
        return `<div class="algorithm${placementClass}" id="${label}">
            <div class="algorithm-header">
                <strong>Algorithm ${this.algorithmCounter - 1}:</strong> ${this.convertMath(caption)}
            </div>
            <div class="algorithm-body">
                ${algorithmContent}
            </div>
        </div>`;
    }
    
    parseAlgorithmicEnvironment(content) {
        const lines = content.split('\\State').filter(line => line.trim());
        let html = '<div class="algorithmic-content">';
        let lineNumber = 1;
        
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed) {
                // Handle If/Else structures
                if (trimmed.startsWith('\\If')) {
                    const condition = trimmed.replace(/\\If\{([^}]+)\}/, '$1');
                    html += `<div class="algorithm-line">
                        <span class="line-number">${lineNumber}:</span>
                        <span class="algorithm-keyword">if</span> ${this.convertMath(condition)} then
                    </div>`;
                } else if (trimmed.startsWith('\\Else')) {
                    html += `<div class="algorithm-line">
                        <span class="line-number">${lineNumber}:</span>
                        <span class="algorithm-keyword">else</span>
                    </div>`;
                } else if (trimmed.startsWith('\\EndIf')) {
                    html += `<div class="algorithm-line">
                        <span class="line-number">${lineNumber}:</span>
                        <span class="algorithm-keyword">end if</span>
                    </div>`;
                } else if (trimmed.startsWith('\\For')) {
                    const loopCondition = trimmed.replace(/\\For\{([^}]+)\}/, '$1');
                    html += `<div class="algorithm-line">
                        <span class="line-number">${lineNumber}:</span>
                        <span class="algorithm-keyword">for</span> ${this.convertMath(loopCondition)} do
                    </div>`;
                } else if (trimmed.startsWith('\\EndFor')) {
                    html += `<div class="algorithm-line">
                        <span class="line-number">${lineNumber}:</span>
                        <span class="algorithm-keyword">end for</span>
                    </div>`;
                } else if (trimmed.startsWith('\\While')) {
                    const condition = trimmed.replace(/\\While\{([^}]+)\}/, '$1');
                    html += `<div class="algorithm-line">
                        <span class="line-number">${lineNumber}:</span>
                        <span class="algorithm-keyword">while</span> ${this.convertMath(condition)} do
                    </div>`;
                } else if (trimmed.startsWith('\\EndWhile')) {
                    html += `<div class="algorithm-line">
                        <span class="line-number">${lineNumber}:</span>
                        <span class="algorithm-keyword">end while</span>
                    </div>`;
                } else if (trimmed.startsWith('\\Return')) {
                    const returnValue = trimmed.replace(/\\Return\{([^}]+)\}/, '$1');
                    html += `<div class="algorithm-line">
                        <span class="line-number">${lineNumber}:</span>
                        <span class="algorithm-keyword">return</span> ${this.convertMath(returnValue)}
                    </div>`;
                } else {
                    html += `<div class="algorithm-line">
                        <span class="line-number">${lineNumber}:</span>
                        ${this.convertMath(trimmed)}
                    </div>`;
                }
                lineNumber++;
            }
        });
        
        html += '</div>';
        return html;
    }
    
    createReference(label) {
        // Check figures first
        if (this.figures.has(label)) {
            const figure = this.figures.get(label);
            return `<a href="#${label}" class="ref figure-ref">Figure ${figure.number}</a>`;
        }
        
        // Check tables
        if (this.tables.has(label)) {
            const table = this.tables.get(label);
            return `<a href="#${label}" class="ref table-ref">Table ${table.number}</a>`;
        }
        
        // Check algorithms
        if (this.algorithms.has(label)) {
            const algorithm = this.algorithms.get(label);
            return `<a href="#${label}" class="ref algorithm-ref">Algorithm ${algorithm.number}</a>`;
        }
        
        // Fallback
        return `<a href="#${label}" class="ref">[${label}]</a>`;
    }
    
    parseFigureOptions(content) {
        const options = {};
        
        // Extract width specifications
        const widthMatch = content.match(/\\includegraphics\[([^\]]*)width=([^\s,]+)/);
        if (widthMatch) {
            options.width = widthMatch[2];
        }
        
        // Extract height specifications
        const heightMatch = content.match(/\\includegraphics\[([^\]]*)height=([^\s,]+)/);
        if (heightMatch) {
            options.height = heightMatch[2];
        }
        
        return options;
    }
    
    parseSubfigureOptions(optionsString) {
        const options = {};
        
        if (!optionsString) return options;
        
        // Parse width
        const widthMatch = optionsString.match(/width=([^\s,]+)/);
        if (widthMatch) {
            options.width = widthMatch[1];
        }
        
        return options;
    }
    
    convertMath(text) {
        // Basic math conversion for captions
        return text
            .replace(/\\text\{([^{}]+)\}/g, '$1')
            .replace(/\^\\\{([^{}]+)\\\}/g, '<sup>$1</sup>')
            .replace(/_\\\{([^{}]+)\\\}/g, '<sub>$1</sub>');
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