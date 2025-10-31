/**
 * Mathematical Typesetting CSS
 * Comprehensive styling for mathematical expressions, matrices, and diagrams
 */

const MathCSS = `
/* ===== MATHEMATICAL TYPESETTING ===== */

/* Base mathematical typography */
.math-display, .math-equation, .math-align, .math-gather, .math-multiline {
    display: block;
    margin: 1.5em 0;
    padding: 1em;
    font-family: 'Latin Modern Math', 'STIX Two Math', 'Asana Math', 'Cambria Math', serif;
    font-size: 1.1em;
    line-height: 1.4;
    text-align: center;
    background: #fafafa;
    border-radius: 8px;
    border-left: 4px solid #3498db;
}

.math-inline {
    font-family: 'Latin Modern Math', 'STIX Two Math', 'Asana Math', 'Cambria Math', serif;
    font-size: 0.95em;
    white-space: nowrap;
}

.math-content {
    display: inline-block;
    vertical-align: middle;
}

/* Equation numbering */
.equation-number {
    display: inline-block;
    margin-left: 1em;
    font-size: 0.85em;
    color: #666;
    font-weight: 500;
    vertical-align: super;
}

/* ===== FRACTIONS ===== */
.math-fraction {
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    margin: 0 0.2em;
    font-size: 0.9em;
}

.numerator {
    display: block;
    border-bottom: 1px solid #333;
    padding: 0.1em 0.3em;
    font-weight: 500;
}

.denominator {
    display: block;
    padding: 0.1em 0.3em;
}

/* ===== BINOMIAL COEFFICIENTS ===== */
.math-binomial {
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    margin: 0 0.3em;
    font-size: 0.85em;
    border: 1px solid #333;
    border-radius: 4px;
    padding: 0.1em;
}

.binomial-top {
    display: block;
    border-bottom: 1px solid #333;
    padding: 0.1em 0.3em;
}

.binomial-bottom {
    display: block;
    padding: 0.1em 0.3em;
}

/* ===== MATRICES ===== */
.math-matrix, .nice-matrix {
    display: inline-block;
    vertical-align: middle;
    margin: 0 0.5em;
}

.matrix-content, .nice-matrix-table {
    display: inline-table;
    vertical-align: middle;
    border-collapse: separate;
    border-spacing: 2px;
}

.matrix-row {
    vertical-align: middle;
}

.matrix-cell, .nice-matrix-cell {
    padding: 0.3em 0.5em;
    text-align: center;
    vertical-align: middle;
    font-size: 0.9em;
    border: 1px solid transparent;
    background: #fff;
    min-width: 1.5em;
}

/* Matrix delimiters */
.matrix-delim {
    font-family: 'Latin Modern Math', 'STIX Two Math', serif;
    font-size: 1.8em;
    vertical-align: middle;
    margin: 0 0.1em;
    color: #333;
    font-weight: 300;
}

.matrix-left {
    margin-right: 0.2em;
}

.matrix-right {
    margin-left: 0.2em;
}

/* ===== NICE MATRIX SPECIFIC ===== */
.nice-matrix-table {
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nice-matrix-table.with-rules {
    border: 1px solid #ddd;
}

.nice-matrix-cell {
    border-color: #ddd;
    transition: all 0.2s ease;
}

.nice-matrix-cell:hover {
    background: #e3f2fd !important;
    transform: scale(1.05);
    z-index: 1;
    position: relative;
    box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}

/* Column types */
.column-center { text-align: center; }
.column-left { text-align: left; }
.column-right { text-align: right; }
.column-expand { width: 100%; text-align: center; }
.column-decimal { text-align: right; }
.column-italic { font-style: italic; }
.column-bold { font-weight: bold; }
.column-underline { text-decoration: underline; }

/* ===== CASES ENVIRONMENT ===== */
.math-cases {
    display: inline-block;
    vertical-align: middle;
    margin: 0 0.5em;
}

.cases-delim {
    font-family: 'Latin Modern Math', 'STIX Two Math', serif;
    font-size: 2.5em;
    vertical-align: middle;
    color: #333;
    margin-right: 0.3em;
}

.cases-content {
    display: inline-table;
    vertical-align: middle;
}

.cases-row {
    vertical-align: middle;
}

.cases-condition {
    padding: 0.2em 0.5em 0.2em 0;
    text-align: right;
    font-weight: 500;
    border-right: 2px solid #333;
}

.cases-expression {
    padding: 0.2em 0.5em 0.2em 0.5em;
    text-align: left;
}

/* ===== ROOTS ===== */
.math-root {
    display: inline-block;
    vertical-align: middle;
    margin: 0 0.2em;
    position: relative;
}

.root-index {
    position: absolute;
    top: -0.3em;
    left: 0.1em;
    font-size: 0.7em;
    color: #333;
}

.root-symbol {
    font-size: 1.2em;
    vertical-align: top;
    color: #333;
}

.radicand {
    border-top: 1px solid #333;
    padding: 0.1em 0.3em 0;
    margin-left: 0.1em;
    display: inline-block;
    vertical-align: top;
}

/* ===== TEXT STYLES IN MATH ===== */
.math-text {
    font-family: 'Georgia', 'Times New Roman', serif;
    font-size: 0.9em;
    color: #333;
}

.math-rm {
    font-family: 'Times New Roman', serif;
    font-style: normal;
    font-weight: normal;
}

.math-bf {
    font-weight: bold;
    color: #2c3e50;
}

.math-it {
    font-style: italic;
    color: #34495e;
}

.math-sf {
    font-family: 'Arial', 'Helvetica', sans-serif;
    color: #2c3e50;
}

.math-tt {
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
    background: #f8f9fa;
    padding: 0.1em 0.2em;
    border-radius: 2px;
}

/* ===== OPERATORS AND SYMBOLS ===== */
.math-operator {
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0.1em;
}

.math-vector {
    font-weight: 500;
    color: #e74c3c;
    font-style: italic;
}

.math-derivative {
    font-weight: 500;
    color: #3498db;
    font-style: italic;
}

/* ===== SPACING ===== */
.math-quad {
    display: inline-block;
    width: 1em;
}

.math-qquad {
    display: inline-block;
    width: 2em;
}

.math-thickspace {
    display: inline-block;
    width: 0.277em;
}

.math-medspace {
    display: inline-block;
    width: 0.222em;
}

.math-thinspace {
    display: inline-block;
    width: 0.167em;
}

.math-negthinspace {
    display: inline-block;
    width: -0.167em;
    margin: 0 -0.167em;
}

/* ===== LARGE DELIMITERS ===== */
.math-large {
    font-family: 'Latin Modern Math', 'STIX Two Math', serif;
    font-size: 1.5em;
    vertical-align: middle;
    margin: 0 0.05em;
}

/* ===== ALIGN ENVIRONMENTS ===== */
.math-align {
    margin: 2em 0;
    padding: 1.5em;
}

.align-line {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.5em 0;
    gap: 1em;
}

.align-row {
    display: grid;
    grid-template-columns: 1fr auto 1fr auto;
    align-items: center;
    gap: 1em;
    margin: 0.5em 0;
}

.align-column {
    text-align: right;
}

.align-column.align-right {
    text-align: left;
}

.math-gather {
    margin: 2em 0;
    padding: 1.5em;
}

.gather-line {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.5em 0;
}

.math-multiline {
    margin: 2em 0;
    padding: 1.5em;
}

.multiline-line {
    display: block;
    margin: 0.5em 0;
    padding: 0.5em;
    border-radius: 4px;
}

.multiline-first {
    text-align: left;
    background: #f0f8ff;
}

.multiline-middle {
    text-align: center;
    background: #f8f9fa;
}

.multiline-last {
    text-align: right;
    background: #f0fff0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* ===== SPLIT ENVIRONMENT ===== */
.math-split {
    display: inline-block;
    text-align: center;
    vertical-align: middle;
}

/* ===== ALGORITHMS ===== */
.algorithm {
    margin: 2em 0;
    padding: 1.5em;
    background: #f8f9fa;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    font-family: 'Courier New', monospace;
}

.algorithm-header {
    font-family: 'Times New Roman', serif;
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 1em;
    color: #2c3e50;
    text-align: center;
    border-bottom: 2px solid #3498db;
    padding-bottom: 0.5em;
}

.algorithm-body {
    background: white;
    padding: 1em;
    border-radius: 4px;
    border: 1px solid #dee2e6;
}

.algorithmic-content {
    line-height: 1.6;
}

.algorithm-line {
    display: flex;
    align-items: flex-start;
    margin: 0.3em 0;
    padding: 0.2em 0.5em;
    border-radius: 3px;
    transition: background 0.2s ease;
}

.algorithm-line:hover {
    background: #e3f2fd;
}

.line-number {
    font-weight: bold;
    color: #6c757d;
    margin-right: 1em;
    min-width: 2em;
    text-align: right;
}

.algorithm-keyword {
    font-weight: bold;
    color: #dc3545;
    text-transform: lowercase;
    margin-right: 0.5em;
}

/* ===== FIGURES AND TABLES ===== */
.figure, .table {
    margin: 2em 0;
    padding: 1.5em;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.figure-content, .table-content {
    text-align: center;
    margin-bottom: 1em;
    padding: 1em;
    background: #fafafa;
    border-radius: 6px;
}

.figure-caption, .table-caption {
    font-style: italic;
    text-align: center;
    color: #495057;
    font-size: 0.95em;
    margin-top: 1em;
}

/* ===== SUBFIGURES ===== */
.subfigures-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    justify-content: center;
    align-items: center;
    margin: 1em 0;
}

.subfigure {
    display: inline-block;
    text-align: center;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    padding: 0.5em;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.subfigure:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.subfigure-content {
    margin-bottom: 0.5em;
}

.subfigure-caption {
    font-size: 0.85em;
    color: #6c757d;
    font-style: italic;
}

/* ===== TIKZ DIAGRAMS ===== */
.tikz-diagram {
    display: inline-block;
    text-align: center;
    margin: 1em 0;
    padding: 1em;
    background: #fafafa;
    border: 1px dashed #ccc;
    border-radius: 8px;
    font-family: 'Arial', sans-serif;
    color: #666;
}

/* ===== INLINE IMAGES ===== */
.inline-image {
    max-height: 1.2em;
    vertical-align: middle;
    margin: 0 0.2em;
}

/* ===== REFERENCES ===== */
.ref {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;
    border-bottom: 1px dotted #007bff;
    transition: all 0.2s ease;
}

.ref:hover {
    color: #0056b3;
    border-bottom-style: solid;
    background: #e3f2fd;
    padding: 0 2px;
    border-radius: 2px;
}

.figure-ref::before { content: "📊 "; }
.table-ref::before { content: "📋 "; }
.algorithm-ref::before { content: "⚙️ "; }

.pageref {
    color: #6c757d;
    font-size: 0.85em;
    font-style: italic;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
    .math-display, .math-equation, .math-align, .math-gather, .math-multiline {
        font-size: 1em;
        padding: 0.8em;
        margin: 1em 0;
    }
    
    .figure, .table {
        padding: 1em;
        margin: 1em 0;
    }
    
    .subfigures-container {
        flex-direction: column;
    }
    
    .subfigure {
        width: 100%;
        max-width: 300px;
    }
    
    .algorithm {
        padding: 1em;
    }
    
    .align-row {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto;
        gap: 0.5em;
    }
    
    .align-column.align-right {
        text-align: center;
    }
}

@media (max-width: 480px) {
    .math-matrix, .nice-matrix {
        font-size: 0.9em;
        margin: 0 0.2em;
    }
    
    .matrix-cell, .nice-matrix-cell {
        padding: 0.2em 0.3em;
        min-width: 1.2em;
    }
    
    .algorithm-line {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .line-number {
        margin-bottom: 0.2em;
        margin-right: 0;
    }
}

/* ===== PRINT STYLES ===== */
@media print {
    .math-display, .math-equation, .math-align, .math-gather, .math-multiline {
        background: white;
        border: 1px solid #ccc;
        page-break-inside: avoid;
    }
    
    .figure, .table, .algorithm {
        page-break-inside: avoid;
        border: 1px solid #000;
        box-shadow: none;
    }
    
    .ref {
        color: #000;
        border-bottom: 1px solid #000;
    }
    
    .tikz-diagram {
        border: 1px solid #000;
    }
}

/* ===== DARK MODE SUPPORT ===== */
@media (prefers-color-scheme: dark) {
    .math-display, .math-equation, .math-align, .math-gather, .math-multiline {
        background: #2d3748;
        border-left-color: #4299e1;
        color: #e2e8f0;
    }
    
    .nice-matrix-table {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
    
    .matrix-cell, .nice-matrix-cell {
        background: #2d3748;
        color: #e2e8f0;
        border-color: #4a5568;
    }
    
    .figure, .table {
        background: #2d3748;
        border-color: #4a5568;
    }
    
    .figure-content, .table-content {
        background: #1a202c;
    }
    
    .algorithm {
        background: #2d3748;
        border-color: #4a5568;
    }
    
    .algorithm-body {
        background: #1a202c;
    }
    
    .algorithm-line:hover {
        background: #2b6cb0;
    }
    
    .subfigure {
        background: #2d3748;
        border-color: #4a5568;
    }
    
    .tikz-diagram {
        background: #2d3748;
        border-color: #4a5568;
        color: #a0aec0;
    }
    
    .ref {
        color: #63b3ed;
        border-bottom-color: #63b3ed;
    }
    
    .ref:hover {
        color: #90cdf4;
        background: #2b6cb0;
    }
}

/* ===== ACCESSIBILITY ===== */
@media (prefers-reduced-motion: reduce) {
    .nice-matrix-cell:hover,
    .subfigure:hover,
    .algorithm-line:hover,
    .ref:hover {
        transform: none;
        transition: none;
    }
}

/* High contrast mode */
@media (prefers-contrast: high) {
    .math-display, .math-equation, .math-align, .math-gather, .math-multiline {
        border-width: 2px;
        border-left-width: 4px;
    }
    
    .figure, .table, .algorithm {
        border-width: 2px;
    }
    
    .ref {
        border-bottom-width: 2px;
    }
}

/* Focus styles for keyboard navigation */
.ref:focus,
.subfigure:focus,
.algorithm-line:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
}

/* ===== ANIMATIONS ===== */
@keyframes mathFadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.math-display, .math-equation, .figure, .table, .algorithm {
    animation: mathFadeIn 0.6s ease-out;
}

@keyframes matrixCellHighlight {
    0% { background: transparent; }
    50% { background: #e3f2fd; }
    100% { background: transparent; }
}

.nice-matrix-cell {
    animation: matrixCellHighlight 2s ease-in-out;
}

/* ===== CUSTOM PROPERTIES FOR THEMING ===== */
:root {
    --math-primary-color: #3498db;
    --math-secondary-color: #2c3e50;
    --math-background: #fafafa;
    --math-text-color: #333;
    --math-border-color: #dee2e6;
    --math-highlight-color: #e3f2fd;
    --math-hover-color: #007bff;
}

[data-theme="dark"] {
    --math-primary-color: #4299e1;
    --math-secondary-color: #e2e8f0;
    --math-background: #2d3748;
    --math-text-color: #e2e8f0;
    --math-border-color: #4a5568;
    --math-highlight-color: #2b6cb0;
    --math-hover-color: #63b3ed;
}
`;

module.exports = MathCSS;