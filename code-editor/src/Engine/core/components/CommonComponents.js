/**
 * Common Components System for LaTeX to HTML Engine
 * Provides reusable components for all document types (tables, equations, layouts, etc.)
 */

class CommonComponents {
    constructor() {
        this.components = new Map();
        this.initializeComponents();
    }

    /**
     * Initialize all common components
     */
    initializeComponents() {
        // Table Components
        this.registerComponent('table', this.renderTable.bind(this));
        this.registerComponent('tabular', this.renderTabular.bind(this));
        this.registerComponent('longtable', this.renderLongTable.bind(this));
        
        // Equation Components
        this.registerComponent('equation', this.renderEquation.bind(this));
        this.registerComponent('align', this.renderAlign.bind(this));
        this.registerComponent('gather', this.renderGather.bind(this));
        this.registerComponent('multline', this.renderMultiline.bind(this));
        
        // Layout Components
        this.registerComponent('columns', this.renderColumns.bind(this));
        this.registerComponent('column', this.renderColumn.bind(this));
        this.registerComponent('minipage', this.renderMinipage.bind(this));
        this.registerComponent('parbox', this.renderParbox.bind(this));
        
        // List Components
        this.registerComponent('itemize', this.renderItemize.bind(this));
        this.registerComponent('enumerate', this.renderEnumerate.bind(this));
        this.registerComponent('description', this.renderDescription.bind(this));
        
        // Figure Components
        this.registerComponent('figure', this.renderFigure.bind(this));
        this.registerComponent('figure*', this.renderFigureStar.bind(this));
        this.registerComponent('wrapfigure', this.renderWrapFigure.bind(this));
        
        // Section Components
        this.registerComponent('section', this.renderSection.bind(this));
        this.registerComponent('subsection', this.renderSubsection.bind(this));
        this.registerComponent('subsubsection', this.renderSubsubsection.bind(this));
        this.registerComponent('paragraph', this.renderParagraph.bind(this));
        this.registerComponent('subparagraph', this.renderSubparagraph.bind(this));
        
        // Text Components
        this.registerComponent('textbf', this.renderTextbf.bind(this));
        this.registerComponent('textit', this.renderTextit.bind(this));
        this.registerComponent('texttt', this.renderTexttt.bind(this));
        this.registerComponent('emph', this.renderEmph.bind(this));
        this.registerComponent('underline', this.renderUnderline.bind(this));
        
        // Math Components
        this.registerComponent('frac', this.renderFrac.bind(this));
        this.registerComponent('sqrt', this.renderSqrt.bind(this));
        this.registerComponent('sum', this.renderSum.bind(this));
        this.registerComponent('int', this.renderIntegral.bind(this));
        this.registerComponent('prod', this.renderProduct.bind(this));
        this.registerComponent('limit', this.renderLimit.bind(this));
        
        // Reference Components
        this.registerComponent('ref', this.renderRef.bind(this));
        this.registerComponent('cite', this.renderCite.bind(this));
        this.registerComponent('label', this.renderLabel.bind(this));
        this.registerComponent('bibliography', this.renderBibliography.bind(this));
        
        // Verbatim Components
        this.registerComponent('verbatim', this.renderVerbatim.bind(this));
        this.registerComponent('lstlisting', this.renderListing.bind(this));
        this.registerComponent('minted', this.renderMinted.bind(this));
        
        // Box Components
        this.registerComponent('fbox', this.renderFbox.bind(this));
        this.registerComponent('framebox', this.renderFramebox.bind(this));
        this.registerComponent('colorbox', this.renderColorbox.bind(this));
        this.registerComponent('fcolorbox', this.renderFcolorbox.bind(this));
    }

    /**
     * Register a component
     */
    registerComponent(name, renderer) {
        this.components.set(name, renderer);
    }

    /**
     * Get a component renderer
     */
    getComponent(name) {
        return this.components.get(name);
    }

    /**
     * Check if a component exists
     */
    hasComponent(name) {
        return this.components.has(name);
    }

    /**
     * Process content with all available components
     */
    processContent(content, options = {}) {
        let processed = content;

        // Process all registered components
        this.components.forEach((renderer, name) => {
            if (options[name] !== false) { // Allow disabling specific components
                processed = renderer(processed, options);
            }
        });

        return processed;
    }

    // ==================== TABLE COMPONENTS ====================

    /**
     * Render LaTeX table environment
     */
    renderTable(content, options = {}) {
        return content.replace(/\\begin\{table\}([\s\S]*?)\\end\{table\}/g, (match, tableContent) => {
            const captionMatch = tableContent.match(/\\caption\{([^}]+)\}/);
            const labelMatch = tableContent.match(/\\label\{([^}]+)\}/);
            const centering = tableContent.includes('\\centering');
            const tabularMatch = tableContent.match(/\\begin\{tabular\}([\s\S]*?)\\end\{tabular\}/);
            
            let caption = captionMatch ? captionMatch[1] : '';
            let label = labelMatch ? labelMatch[1] : '';
            let tabularContent = tabularMatch ? this.renderTabular(tabularMatch[0], options) : '';

            const tableClasses = ['common-table'];
            if (centering) tableClasses.push('centered');
            if (options.tableClass) tableClasses.push(options.tableClass);

            return `
                <div class="${tableClasses.join(' ')}" ${label ? `id="${label}"` : ''}>
                    ${tabularContent}
                    ${caption ? `<div class="table-caption">${caption}</div>` : ''}
                </div>
            `;
        });
    }

    /**
     * Render LaTeX tabular environment
     */
    renderTabular(content, options = {}) {
        return content.replace(/\\begin\{tabular\}\{([^}]*)\}([\s\S]*?)\\end\{tabular\}/g, (match, columnSpec, tableContent) => {
            const rows = this.parseTabularContent(tableContent);
            const numColumns = this.countColumns(columnSpec);
            const columnAlignment = this.parseColumnSpec(columnSpec);

            let tableHTML = '<table class="common-tabular">\n';
            
            // Add column groups if specified
            if (columnAlignment.length > 0) {
                tableHTML += '<colgroup>\n';
                columnAlignment.forEach(align => {
                    tableHTML += `<col style="text-align: ${align}">`;
                });
                tableHTML += '</colgroup>\n';
            }

            // Process rows
            rows.forEach((row, index) => {
                const isHeaderRow = options.headerRow && index === 0;
                const rowTag = isHeaderRow ? 'th' : 'tr';
                const cellTag = isHeaderRow ? 'th' : 'td';
                
                if (row.trim()) {
                    tableHTML += `<tr class="table-row ${isHeaderRow ? 'header-row' : ''}">`;
                    const cells = this.parseTableRow(row, numColumns);
                    cells.forEach(cell => {
                        const cellAlign = columnAlignment[cells.indexOf(cell)] || 'left';
                        tableHTML += `<${cellTag} class="table-cell" style="text-align: ${cellAlign}">${cell}</${cellTag}>`;
                    });
                    tableHTML += '</tr>\n';
                }
            });

            tableHTML += '</table>';
            return tableHTML;
        });
    }

    /**
     * Render longtable environment
     */
    renderLongTable(content, options = {}) {
        return content.replace(/\\begin\{longtable\}\{([^}]*)\}([\s\S]*?)\\end\{longtable\}/g, (match, columnSpec, tableContent) => {
            const parts = tableContent.split(/\\\\endhead|\\\\endfirsthead|\\\\endfoot|\\\\endlastfoot/);
            const headerPart = tableContent.match(/\\\\endfirsthead([\s\S]*?)\\\\endhead/);
            const bodyPart = tableContent.match(/\\\\endhead([\s\S]*?)(?=\\\\endfoot|\\\\endlastfoot|$)/);
            
            let html = '<div class="common-longtable">\n<table class="longtable">\n';
            
            // Header
            if (headerPart) {
                html += '<thead>\n';
                html += this.renderTabular(`\\begin{tabular}{${columnSpec}}${headerPart[1]}\\end{tabular}`, options);
                html += '</thead>\n';
            }
            
            // Body
            if (bodyPart) {
                html += '<tbody>\n';
                html += this.renderTabular(`\\begin{tabular}{${columnSpec}}${bodyPart[1]}\\end{tabular}`, options);
                html += '</tbody>\n';
            }
            
            html += '</table>\n</div>';
            return html;
        });
    }

    // ==================== EQUATION COMPONENTS ====================

    /**
     * Render equation environment
     */
    renderEquation(content, options = {}) {
        return content.replace(/\\begin\{equation\}([\s\S]*?)\\end\{equation\}/g, (match, equation) => {
            const labelMatch = equation.match(/\\label\{([^}]+)\}/);
            const label = labelMatch ? labelMatch[1] : '';
            const cleanEquation = equation.replace(/\\label\{[^}]*\}/g, '').trim();
            
            return `
                <div class="common-equation" ${label ? `id="${label}"` : ''}>
                    <div class="equation-content">
                        ${this.renderMath(cleanEquation, options)}
                    </div>
                </div>
            `;
        });
    }

    /**
     * Render align environment
     */
    renderAlign(content, options = {}) {
        return content.replace(/\\begin\{align\*?\}([\s\S]*?)\\end\{align\*?\}/g, (match, alignContent) => {
            const lines = alignContent.split('\\\\').filter(line => line.trim());
            
            let html = '<div class="common-align">\n';
            lines.forEach((line, index) => {
                const labelMatch = line.match(/\\label\{([^}]+)\}/);
                const label = labelMatch ? labelMatch[1] : '';
                const cleanLine = line.replace(/\\label\{[^}]*\}/g, '').trim();
                
                // Split by & for alignment points
                const parts = cleanLine.split('&').map(part => part.trim());
                
                html += '<div class="align-row">\n';
                parts.forEach((part, partIndex) => {
                    const alignment = partIndex === 0 ? 'align-left' : 'align-right';
                    html += `<div class="align-column ${alignment}">${this.renderMath(part, options)}</div>`;
                });
                html += '</div>\n';
            });
            html += '</div>';
            
            return html;
        });
    }

    /**
     * Render gather environment
     */
    renderGather(content, options = {}) {
        return content.replace(/\\begin\{gather\*?\}([\s\S]*?)\\end\{gather\*?\}/g, (match, gatherContent) => {
            const lines = gatherContent.split('\\\\').filter(line => line.trim());
            
            let html = '<div class="common-gather">\n';
            lines.forEach(line => {
                const cleanLine = line.replace(/\\label\{[^}]*\}/g, '').trim();
                html += `<div class="gather-row">${this.renderMath(cleanLine, options)}</div>\n`;
            });
            html += '</div>';
            
            return html;
        });
    }

    /**
     * Render multiline environment
     */
    renderMultiline(content, options = {}) {
        return content.replace(/\\begin\{multline\*?\}([\s\S]*?)\\end\{multline\*?\}/g, (match, multilineContent) => {
            const lines = multilineContent.split('\\\\').filter(line => line.trim());
            
            let html = '<div class="common-multiline">\n';
            lines.forEach((line, index) => {
                const cleanLine = line.replace(/\\label\{[^}]*\}/g, '').trim();
                let alignment = 'multiline-center';
                if (index === 0) alignment = 'multiline-left';
                if (index === lines.length - 1) alignment = 'multiline-right';
                
                html += `<div class="multiline-row ${alignment}">${this.renderMath(cleanLine, options)}</div>\n`;
            });
            html += '</div>';
            
            return html;
        });
    }

    // ==================== LAYOUT COMPONENTS ====================

    /**
     * Render columns environment
     */
    renderColumns(content, options = {}) {
        return content.replace(/\\begin\{columns\}\[?([^\]]*)\]?([\s\S]*?)\\end\{columns\}/g, (match, columnOptions, columnsContent) => {
            const columns = this.parseColumnsContent(columnsContent);
            
            let html = '<div class="common-columns">\n';
            columns.forEach((column, index) => {
                html += `<div class="column" style="flex: 1; padding: 0 0.5rem;">${column}</div>\n`;
            });
            html += '</div>';
            
            return html;
        });
    }

    /**
     * Render column environment
     */
    renderColumn(content, options = {}) {
        return content.replace(/\\begin\{column\}\{([^}]+)\}([\s\S]*?)\\end\{column\}/g, (match, width, columnContent) => {
            return `<div class="common-column" style="width: ${this.parseDimension(width)};">${columnContent}</div>`;
        });
    }

    /**
     * Render minipage environment
     */
    renderMinipage(content, options = {}) {
        return content.replace(/\\begin\{minipage\}\[?([^\]]*)\]?\{([^}]+)\}([\s\S]*?)\\end\{minipage\}/g, (match, position, width, minipageContent) => {
            return `<div class="common-minipage" style="width: ${this.parseDimension(width)}; display: inline-block; vertical-align: ${position || 'top'};">${minipageContent}</div>`;
        });
    }

    /**
     * Render parbox environment
     */
    renderParbox(content, options = {}) {
        return content.replace(/\\parbox\[([^\]]*)\]\{([^}]+)\}\{([^}]+)\}/g, (match, position, width, parboxContent) => {
            return `<div class="common-parbox" style="width: ${this.parseDimension(width)}; display: inline-block; vertical-align: ${position || 'top'};">${parboxContent}</div>`;
        });
    }

    // ==================== LIST COMPONENTS ====================

    /**
     * Render itemize environment
     */
    renderItemize(content, options = {}) {
        return content.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (match, listContent) => {
            const items = this.parseListItems(listContent);
            const bulletStyle = options.itemizeStyle || 'disc';
            
            let html = `<ul class="common-itemize" style="list-style-type: ${bulletStyle};">\n`;
            items.forEach(item => {
                html += `<li class="itemize-item">${item}</li>\n`;
            });
            html += '</ul>';
            
            return html;
        });
    }

    /**
     * Render enumerate environment
     */
    renderEnumerate(content, options = {}) {
        return content.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, (match, listContent) => {
            const items = this.parseListItems(listContent);
            
            let html = '<ol class="common-enumerate">\n';
            items.forEach((item, index) => {
                html += `<li class="enumerate-item" value="${index + 1}">${item}</li>\n`;
            });
            html += '</ol>';
            
            return html;
        });
    }

    /**
     * Render description environment
     */
    renderDescription(content, options = {}) {
        return content.replace(/\\begin\{description\}([\s\S]*?)\\end\{description\}/g, (match, listContent) => {
            const items = this.parseDescriptionItems(listContent);
            
            let html = '<dl class="common-description">\n';
            items.forEach(([term, description]) => {
                html += `<dt class="description-term">${term}</dt>\n`;
                html += `<dd class="description-desc">${description}</dd>\n`;
            });
            html += '</dl>';
            
            return html;
        });
    }

    // ==================== FIGURE COMPONENTS ====================

    /**
     * Render figure environment
     */
    renderFigure(content, options = {}) {
        return content.replace(/\\begin\{figure\}([\s\S]*?)\\end\{figure\}/g, (match, figureContent) => {
            return this.renderFigureContent(figureContent, false, options);
        });
    }

    /**
     * Render figure* environment
     */
    renderFigureStar(content, options = {}) {
        return content.replace(/\\begin\{figure\*\}([\s\S]*?)\\end\{figure\*\}/g, (match, figureContent) => {
            return this.renderFigureContent(figureContent, true, options);
        });
    }

    /**
     * Render wrapfigure environment
     */
    renderWrapFigure(content, options = {}) {
        return content.replace(/\\begin\{wrapfigure\}\{([^}]+)\}\{([^}]+)\}([\s\S]*?)\\end\{wrapfigure\}/g, (match, placement, width, wrapContent) => {
            const captionMatch = wrapContent.match(/\\caption\{([^}]+)\}/);
            const imgMatch = wrapContent.match(/\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\}/);
            
            let html = '<div class="common-wrapfigure" style="float: ' + placement + '; width: ' + this.parseDimension(width) + ';">\n';
            if (imgMatch) {
                html += `<img src="${imgMatch[1]}" alt="Figure" style="max-width: 100%;">\n`;
            }
            if (captionMatch) {
                html += `<div class="wrap-caption">${captionMatch[1]}</div>\n`;
            }
            html += '</div>';
            
            return html;
        });
    }

    // ==================== SECTION COMPONENTS ====================

    /**
     * Render section
     */
    renderSection(content, options = {}) {
        return content.replace(/\\section\*?\{([^}]+)\}/g, (match, title) => {
            const level = options.sectionLevel || 2;
            return `<h${level} class="common-section">${title}</h${level}>`;
        });
    }

    /**
     * Render subsection
     */
    renderSubsection(content, options = {}) {
        return content.replace(/\\subsection\*?\{([^}]+)\}/g, (match, title) => {
            const level = (options.sectionLevel || 2) + 1;
            return `<h${level} class="common-subsection">${title}</h${level}>`;
        });
    }

    /**
     * Render subsubsection
     */
    renderSubsubsection(content, options = {}) {
        return content.replace(/\\subsubsection\*?\{([^}]+)\}/g, (match, title) => {
            const level = (options.sectionLevel || 2) + 2;
            return `<h${level} class="common-subsubsection">${title}</h${level}>`;
        });
    }

    /**
     * Render paragraph
     */
    renderParagraph(content, options = {}) {
        return content.replace(/\\paragraph\*?\{([^}]+)\}/g, (match, title) => {
            return `<h4 class="common-paragraph">${title}</h4>`;
        });
    }

    /**
     * Render subparagraph
     */
    renderSubparagraph(content, options = {}) {
        return content.replace(/\\subparagraph\*?\{([^}]+)\}/g, (match, title) => {
            return `<h5 class="common-subparagraph">${title}</h5>`;
        });
    }

    // ==================== TEXT COMPONENTS ====================

    /**
     * Render bold text
     */
    renderTextbf(content, options = {}) {
        return content.replace(/\\textbf\{([^}]+)\}/g, '<strong class="common-textbf">$1</strong>');
    }

    /**
     * Render italic text
     */
    renderTextit(content, options = {}) {
        return content.replace(/\\textit\{([^}]+)\}/g, '<em class="common-textit">$1</em>');
    }

    /**
     * Render monospace text
     */
    renderTexttt(content, options = {}) {
        return content.replace(/\\texttt\{([^}]+)\}/g, '<code class="common-texttt">$1</code>');
    }

    /**
     * Render emphasized text
     */
    renderEmph(content, options = {}) {
        return content.replace(/\\emph\{([^}]+)\}/g, '<em class="common-emph">$1</em>');
    }

    /**
     * Render underlined text
     */
    renderUnderline(content, options = {}) {
        return content.replace(/\\underline\{([^}]+)\}/g, '<u class="common-underline">$1</u>');
    }

    // ==================== MATH COMPONENTS ====================

    /**
     * Render fraction
     */
    renderFrac(content, options = {}) {
        return content.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '<span class="common-frac"><span class="frac-numerator">$1</span><span class="frac-denominator">$2</span></span>');
    }

    /**
     * Render square root
     */
    renderSqrt(content, options = {}) {
        return content.replace(/\\sqrt(?:\[([^\]]+)\])?\{([^}]+)\}/g, (match, n, radicand) => {
            if (n) {
                return `<span class="common-root"><span class="root-index">${n}</span><span class="root-content">√${radicand}</span></span>`;
            }
            return `<span class="common-sqrt">√${radicand}</span>`;
        });
    }

    /**
     * Render summation
     */
    renderSum(content, options = {}) {
        return content.replace(/\\sum(?:_([^=]+)=([^}]+))?(?:\^([^}]+))?/g, (match, lowerFrom, lowerTo, upper) => {
            let html = '<span class="common-sum">∑';
            if (lowerFrom && lowerTo) html += `<sub>${lowerFrom}=${lowerTo}</sub>`;
            if (upper) html += `<sup>${upper}</sup>`;
            html += '</span>';
            return html;
        });
    }

    /**
     * Render integral
     */
    renderIntegral(content, options = {}) {
        return content.replace(/\\int(?:_([^}]+))?(?:\^([^}]+))?/g, (match, lower, upper) => {
            let html = '<span class="common-integral">∫';
            if (lower) html += `<sub>${lower}</sub>`;
            if (upper) html += `<sup>${upper}</sup>`;
            html += '</span>';
            return html;
        });
    }

    /**
     * Render product
     */
    renderProduct(content, options = {}) {
        return content.replace(/\\prod(?:_([^=]+)=([^}]+))?(?:\^([^}]+))?/g, (match, lowerFrom, lowerTo, upper) => {
            let html = '<span class="common-product">∏';
            if (lowerFrom && lowerTo) html += `<sub>${lowerFrom}=${lowerTo}</sub>`;
            if (upper) html += `<sup>${upper}</sup>`;
            html += '</span>';
            return html;
        });
    }

    /**
     * Render limit
     */
    renderLimit(content, options = {}) {
        return content.replace(/\\lim_(\w+)\{([^}]+)\}/g, '<span class="common-limit">lim<sub>$1→$2</sub></span>');
    }

    // ==================== REFERENCE COMPONENTS ====================

    /**
     * Render reference
     */
    renderRef(content, options = {}) {
        return content.replace(/\\ref\{([^}]+)\}/g, '<a href="#$1" class="common-ref">[$1]</a>');
    }

    /**
     * Render citation
     */
    renderCite(content, options = {}) {
        return content.replace(/\\cite\{([^}]+)\}/g, '<span class="common-cite">[$1]</span>');
    }

    /**
     * Render label
     */
    renderLabel(content, options = {}) {
        // Labels are handled by other components, so return empty
        return content.replace(/\\label\{([^}]+)\}/g, '');
    }

    /**
     * Render bibliography
     */
    renderBibliography(content, options = {}) {
        return content.replace(/\\bibliography\{([^}]+)\}/g, '<div class="common-bibliography">Bibliography: $1</div>');
    }

    // ==================== VERBATIM COMPONENTS ====================

    /**
     * Render verbatim
     */
    renderVerbatim(content, options = {}) {
        return content.replace(/\\begin\{verbatim\}([\s\S]*?)\\end\{verbatim\}/g, (match, verbatimContent) => {
            return `<pre class="common-verbatim">${verbatimContent}</pre>`;
        });
    }

    /**
     * Render listing
     */
    renderListing(content, options = {}) {
        return content.replace(/\\begin\{lstlisting\}(?:\[([^\]]*)\])?([\s\S]*?)\\end\{lstlisting\}/g, (match, listingOptions, listingContent) => {
            return `<pre class="common-listing" ${listingOptions ? `data-options="${listingOptions}"` : ''}>${listingContent}</pre>`;
        });
    }

    /**
     * Render minted
     */
    renderMinted(content, options = {}) {
        return content.replace(/\\begin\{minted\}\{([^}]+)\}([\s\S]*?)\\end\{minted\}/g, (match, language, mintedContent) => {
            return `<pre class="common-minted" data-language="${language}"><code>${mintedContent}</code></pre>`;
        });
    }

    // ==================== BOX COMPONENTS ====================

    /**
     * Render fbox
     */
    renderFbox(content, options = {}) {
        return content.replace(/\\fbox\{([^}]+)\}/g, '<span class="common-fbox">$1</span>');
    }

    /**
     * Render framebox
     */
    renderFramebox(content, options = {}) {
        return content.replace(/\\framebox(?:\{([^}]+)\})?\{([^}]+)\}/g, (match, width, text) => {
            if (width) {
                return `<div class="common-framebox" style="width: ${this.parseDimension(width)};">${text}</div>`;
            }
            return `<span class="common-framebox">${text}</span>`;
        });
    }

    /**
     * Render colorbox
     */
    renderColorbox(content, options = {}) {
        return content.replace(/\\colorbox\{([^}]+)\}\{([^}]+)\}/g, '<span class="common-colorbox" style="background-color: $1;">$2</span>');
    }

    /**
     * Render fcolorbox
     */
    renderFcolorbox(content, options = {}) {
        return content.replace(/\\fcolorbox\{([^}]+)\}\{([^}]+)\}\{([^}]+)\}/g, '<span class="common-fcolorbox" style="border-color: $1; background-color: $2;">$3</span>');
    }

    // ==================== UTILITY METHODS ====================

    /**
     * Parse tabular content into rows
     */
    parseTabularContent(content) {
        return content.split('\\\\').map(row => row.trim()).filter(row => row);
    }

    /**
     * Parse table row into cells
     */
    parseTableRow(row, expectedColumns) {
        const cells = row.split('&').map(cell => cell.trim());
        
        // Pad with empty cells if necessary
        while (cells.length < expectedColumns) {
            cells.push('');
        }
        
        return cells;
    }

    /**
     * Count columns from column specification
     */
    countColumns(columnSpec) {
        return columnSpec.replace(/[lcr]/g, '').length + columnSpec.match(/[lcr]/g)?.length || 0;
    }

    /**
     * Parse column specification for alignment
     */
    parseColumnSpec(columnSpec) {
        const alignments = [];
        for (let char of columnSpec) {
            switch (char) {
                case 'l': alignments.push('left'); break;
                case 'c': alignments.push('center'); break;
                case 'r': alignments.push('right'); break;
                case '|': // vertical line - ignore for alignment
                    break;
            }
        }
        return alignments;
    }

    /**
     * Parse list items from list content
     */
    parseListItems(content) {
        return content.split('\\item').filter(item => item.trim()).map(item => item.trim());
    }

    /**
     * Parse description items
     */
    parseDescriptionItems(content) {
        const items = [];
        const parts = content.split('\\item').filter(item => item.trim());
        
        parts.forEach(part => {
            const lines = part.split('\n').filter(line => line.trim());
            if (lines.length > 0) {
                const term = lines[0].trim();
                const description = lines.slice(1).join(' ').trim();
                items.push([term, description]);
            }
        });
        
        return items;
    }

    /**
     * Parse columns content
     */
    parseColumnsContent(content) {
        const columnPattern = /\\begin\{column\}\{[^}]+\}([\s\S]*?)\\end\{column\}/g;
        const columns = [];
        let match;
        
        while ((match = columnPattern.exec(content)) !== null) {
            columns.push(match[1].trim());
        }
        
        return columns;
    }

    /**
     * Parse dimension (width, height) from LaTeX to CSS
     */
    parseDimension(dimension) {
        dimension = dimension.trim();
        
        if (dimension.includes('\\textwidth')) {
            return '100%';
        } else if (dimension.includes('\\linewidth')) {
            return '100%';
        } else if (dimension.includes('cm')) {
            const value = parseFloat(dimension);
            return `${value * 37.8}px`;
        } else if (dimension.includes('mm')) {
            const value = parseFloat(dimension);
            return `${value * 3.78}px`;
        } else if (dimension.includes('pt')) {
            const value = parseFloat(dimension);
            return `${value * 1.33}px`;
        } else if (dimension.includes('in')) {
            const value = parseFloat(dimension);
            return `${value * 96}px`;
        } else if (dimension.match(/\d+px/)) {
            return dimension;
        } else if (dimension.match(/\d+%$/)) {
            return dimension;
        } else if (dimension.match(/^\d+$/)) {
            return `${dimension}px`;
        }
        
        return dimension; // fallback
    }

    /**
     * Render math content
     */
    renderMath(math, options = {}) {
        // Basic math rendering - can be extended with MathJax or KaTeX integration
        return math;
    }

    /**
     * Render figure content (shared between figure and figure*)
     */
    renderFigureContent(figureContent, isStar, options = {}) {
        const captionMatch = figureContent.match(/\\caption\{([^}]+)\}/);
        const labelMatch = figureContent.match(/\\label\{([^}]+)\}/);
        const centering = figureContent.includes('\\centering');
        const imgMatch = figureContent.match(/\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\}/);
        
        let caption = captionMatch ? captionMatch[1] : '';
        let label = labelMatch ? labelMatch[1] : '';
        
        const figureClasses = ['common-figure'];
        if (isStar) figureClasses.push('figure-star');
        if (centering) figureClasses.push('centered');
        if (options.figureClass) figureClasses.push(options.figureClass);

        let html = `<div class="${figureClasses.join(' ')}" ${label ? `id="${label}"` : ''}>\n`;
        
        if (imgMatch) {
            const optionsMatch = figureContent.match(/\\includegraphics\[([^\]]+)\]\{([^}]+)\}/);
            if (optionsMatch) {
                const imgStyle = this.parseImageOptions(optionsMatch[1]);
                html += `<img src="${optionsMatch[2]}" alt="Figure" style="${imgStyle}">\n`;
            } else {
                html += `<img src="${imgMatch[1]}" alt="Figure" style="max-width: 100%; height: auto;">\n`;
            }
        }
        
        if (caption) {
            html += `<div class="figure-caption">${caption}</div>\n`;
        }
        
        html += '</div>';
        return html;
    }

    /**
     * Parse image options
     */
    parseImageOptions(options) {
        let style = 'max-width: 100%; height: auto;';
        
        const optionsList = options.split(',');
        optionsList.forEach(option => {
            const [key, value] = option.split('=').map(s => s.trim());
            
            switch (key) {
                case 'width':
                    style += ` max-width: ${this.parseDimension(value)};`;
                    break;
                case 'height':
                    style += ` max-height: ${this.parseDimension(value)};`;
                    break;
                case 'scale':
                    const scale = parseFloat(value);
                    if (!isNaN(scale)) {
                        style += ` transform: scale(${scale});`;
                    }
                    break;
                case 'angle':
                    const angle = parseFloat(value);
                    if (!isNaN(angle)) {
                        style += ` transform: rotate(${angle}deg);`;
                    }
                    break;
            }
        });
        
        return style;
    }

    /**
     * Get default CSS for all common components
     */
    getDefaultCSS() {
        return `
        /* ===== COMMON COMPONENTS BASE STYLES ===== */
        
        /* Tables */
        .common-table {
            margin: 2rem 0;
            overflow-x: auto;
        }
        
        .common-tabular {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
            font-size: 0.95rem;
        }
        
        .common-tabular .table-row {
            border-bottom: 1px solid #ddd;
        }
        
        .common-tabular .table-row.header-row {
            background-color: #f8f9fa;
            font-weight: 600;
        }
        
        .common-tabular .table-cell {
            padding: 0.75rem;
            border: 1px solid #ddd;
        }
        
        .table-caption {
            text-align: center;
            font-style: italic;
            margin-top: 0.5rem;
            font-size: 0.9rem;
            color: #666;
        }
        
        /* Equations */
        .common-equation, .common-align, .common-gather, .common-multiline {
            margin: 1.5rem 0;
            text-align: center;
            overflow-x: auto;
        }
        
        .equation-content {
            font-family: 'Times New Roman', serif;
            font-size: 1.1rem;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 4px;
        }
        
        .align-row, .gather-row, .multiline-row {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0.5rem 0;
        }
        
        .align-left {
            flex: 1;
            text-align: right;
            margin-right: 1rem;
        }
        
        .align-right {
            flex: 1;
            text-align: left;
            margin-left: 1rem;
        }
        
        .multiline-left {
            text-align: left;
        }
        
        .multiline-center {
            text-align: center;
        }
        
        .multiline-right {
            text-align: right;
        }
        
        /* Math Components */
        .common-frac {
            display: inline-block;
            vertical-align: middle;
            text-align: center;
        }
        
        .frac-numerator {
            display: block;
            border-bottom: 1px solid #000;
            padding: 0 0.25rem;
        }
        
        .frac-denominator {
            display: block;
            padding: 0 0.25rem;
        }
        
        .common-sqrt, .common-root {
            font-family: 'Times New Roman', serif;
        }
        
        .common-sum, .common-integral, .common-product, .common-limit {
            font-family: 'Times New Roman', serif;
            font-size: 1.2em;
        }
        
        /* Layout Components */
        .common-columns {
            display: flex;
            gap: 1rem;
            margin: 1rem 0;
        }
        
        .common-column {
            flex: 1;
            overflow: hidden;
        }
        
        .common-minipage, .common-parbox {
            border: 1px dashed #ccc;
            padding: 0.5rem;
            margin: 0.5rem 0;
        }
        
        /* Lists */
        .common-itemize, .common-enumerate {
            margin: 1rem 0;
            padding-left: 2rem;
        }
        
        .itemize-item, .enumerate-item {
            margin: 0.5rem 0;
            line-height: 1.5;
        }
        
        .common-description {
            margin: 1rem 0;
        }
        
        .description-term {
            font-weight: 600;
            margin-top: 0.5rem;
        }
        
        .description-desc {
            margin-left: 2rem;
            margin-bottom: 0.5rem;
        }
        
        /* Figures */
        .common-figure, .common-wrapfigure {
            margin: 1.5rem 0;
            text-align: center;
        }
        
        .figure-caption, .wrap-caption {
            text-align: center;
            font-style: italic;
            margin-top: 0.5rem;
            font-size: 0.9rem;
            color: #666;
        }
        
        .common-wrapfigure {
            margin: 0 1rem 1rem 1rem;
        }
        
        /* Sections */
        .common-section, .common-subsection, .common-subsubsection {
            margin: 2rem 0 1rem 0;
            color: #333;
            line-height: 1.3;
        }
        
        .common-section {
            font-size: 1.8rem;
            border-bottom: 2px solid #eee;
            padding-bottom: 0.5rem;
        }
        
        .common-subsection {
            font-size: 1.5rem;
        }
        
        .common-subsubsection {
            font-size: 1.3rem;
        }
        
        .common-paragraph {
            font-size: 1.1rem;
            margin: 1.5rem 0 0.5rem 0;
            font-weight: 600;
        }
        
        .common-subparagraph {
            font-size: 1rem;
            margin: 1rem 0 0.5rem 0;
            font-weight: 600;
        }
        
        /* Text Components */
        .common-textbf {
            font-weight: 600;
        }
        
        .common-textit, .common-emph {
            font-style: italic;
        }
        
        .common-texttt {
            font-family: 'Courier New', monospace;
            background: #f8f9fa;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-size: 0.9em;
        }
        
        .common-underline {
            text-decoration: underline;
        }
        
        /* References */
        .common-ref {
            color: #0066cc;
            text-decoration: none;
        }
        
        .common-ref:hover {
            text-decoration: underline;
        }
        
        .common-cite {
            color: #0066cc;
            font-size: 0.9em;
        }
        
        /* Verbatim */
        .common-verbatim, .common-listing, .common-minted {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 1rem;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            overflow-x: auto;
            white-space: pre;
            margin: 1rem 0;
        }
        
        /* Boxes */
        .common-fbox, .common-framebox {
            border: 1px solid #000;
            padding: 0.25rem 0.5rem;
            display: inline-block;
            margin: 0.25rem;
        }
        
        .common-colorbox {
            padding: 0.25rem 0.5rem;
            display: inline-block;
            margin: 0.25rem;
        }
        
        .common-fcolorbox {
            border: 1px solid;
            padding: 0.25rem 0.5rem;
            display: inline-block;
            margin: 0.25rem;
        }
        
        /* Longtable */
        .common-longtable {
            overflow-x: auto;
            margin: 2rem 0;
        }
        
        .longtable {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.95rem;
        }
        
        .longtable th {
            background: #f8f9fa;
            font-weight: 600;
            border: 1px solid #ddd;
            padding: 0.75rem;
            text-align: left;
        }
        
        .longtable td {
            border: 1px solid #ddd;
            padding: 0.75rem;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .common-columns {
                flex-direction: column;
                gap: 1rem;
            }
            
            .common-tabular {
                font-size: 0.85rem;
            }
            
            .common-tabular .table-cell {
                padding: 0.5rem;
            }
            
            .equation-content {
                font-size: 1rem;
                padding: 0.75rem;
            }
            
            .common-wrapfigure {
                float: none;
                width: 100% !important;
                margin: 1rem 0;
            }
        }
        
        @media (max-width: 480px) {
            .common-tabular {
                font-size: 0.8rem;
            }
            
            .common-tabular .table-cell {
                padding: 0.4rem;
            }
            
            .common-section {
                font-size: 1.5rem;
            }
            
            .common-subsection {
                font-size: 1.3rem;
            }
            
            .common-subsubsection {
                font-size: 1.1rem;
            }
        }
        
        /* Print Styles */
        @media print {
            .common-figure, .common-table {
                page-break-inside: avoid;
            }
            
            .common-equation {
                page-break-inside: avoid;
            }
            
            .common-columns {
                flex-direction: column;
            }
        }
        `;
    }
}

module.exports = CommonComponents;