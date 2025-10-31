/**
 * Advanced Math Parser
 * Comprehensive mathematical equation parser with amsmath, mathtools, physics, tensor, and nicematrix support
 */

class MathParser {
    constructor() {
        this.equationCounter = 1;
        this.labelCounter = 1;
        
        // Comprehensive Greek letters mapping
        this.greekLetters = {
            '\\alpha': 'α', '\\beta': 'β', '\\gamma': 'γ', '\\delta': 'δ',
            '\\epsilon': 'ε', '\\varepsilon': 'ε', '\\zeta': 'ζ', '\\eta': 'η',
            '\\theta': 'θ', '\\vartheta': 'ϑ', '\\iota': 'ι', '\\kappa': 'κ',
            '\\lambda': 'λ', '\\mu': 'μ', '\\nu': 'ν', '\\xi': 'ξ',
            '\\pi': 'π', '\\varpi': 'ϖ', '\\rho': 'ρ', '\\varrho': 'ϱ',
            '\\sigma': 'σ', '\\varsigma': 'ς', '\\tau': 'τ', '\\upsilon': 'υ',
            '\\phi': 'φ', '\\varphi': 'φ', '\\chi': 'χ', '\\psi': 'ψ',
            '\\omega': 'ω', '\\Gamma': 'Γ', '\\Delta': 'Δ', '\\Theta': 'Θ',
            '\\Lambda': 'Λ', '\\Xi': 'Ξ', '\\Pi': 'Π', '\\Sigma': 'Σ',
            '\\Upsilon': 'Υ', '\\Phi': 'Φ', '\\Psi': 'Ψ', '\\Omega': 'Ω'
        };
        
        // Mathematical operators and symbols
        this.operators = {
            '\\times': '×', '\\div': '÷', '\\pm': '±', '\\mp': '∓',
            '\\leq': '≤', '\\geq': '≥', '\\neq': '≠', '\\approx': '≈',
            '\\equiv': '≡', '\\sim': '∼', '\\simeq': '≃', '\\cong': '≅',
            '\\infty': '∞', '\\partial': '∂', '\\nabla': '∇', '\\exists': '∃',
            '\\forall': '∀', '\\neg': '¬', '\\wedge': '∧', '\\vee': '∨',
            '\\sum': '∑', '\\prod': '∏', '\\coprod': '∐', '\\int': '∫',
            '\\oint': '∮', '\\iint': '∬', '\\iiint': '∭', '\\sqrt': '√',
            '\\angle': '∠', '\\perp': '⊥', '\\parallel': '∥', '\\in': '∈',
            '\\notin': '∉', '\\subset': '⊂', '\\subseteq': '⊆', '\\supset': '⊃',
            '\\supseteq': '⊇', '\\cup': '∪', '\\cap': '∩', '\\emptyset': '∅',
            '\\varnothing': '∅', '\\union': '⋃', '\\intersection': '⋂',
            '\\rightarrow': '→', '\\leftarrow': '←', '\\leftrightarrow': '↔',
            '\\Rightarrow': '⇒', '\\Leftarrow': '⇐', '\\Leftrightarrow': '⇔'
        };
        
        // Physics package symbols and operators
        this.physicsSymbols = {
            '\\va{': '→', '\\vb{': '→', '\\vc{': '→', '\\vd{': '→',
            '\\va*{': '→', '\\vb*{': '→', '\\vc*{': '→', '\\vd*{': '→',
            '\\grad': '∇', '\\curl': '∇×', '\\div': '∇·',
            '\\laplacian': '∇²', '\\pderivative': '∂', '\\qderivative': 'δ',
            '\\hbar': 'ℏ', '\\ell': 'ℓ', '\\imath': 'i', '\\jmath': 'j'
        };
        
        // Physics package operators that need special handling
        this.physicsOperators = {
            '\\expval': '⟨', '\\bra': '⟨', '\\ket': '⟩', '\\comm': '[', '\\anticomm': '{',
            '\\pderiv': '∂', '\\qderiv': 'δ', '\\mdv': '∇', '\\pdv': '∂'
        };
        
        // Matrix environments
        this.matrixEnvironments = [
            'matrix', 'pmatrix', 'bmatrix', 'vmatrix', 'Vmatrix',
            'smallmatrix', 'cases', 'array'
        ];
    }

    parse(latexContent, context) {
        let html = latexContent;
        
        // Display math (equations with \[ \])
        html = html.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (match, math) => {
            return `<div class="math-display">${this.convertMath(math)}</div>`;
        });
        
        // Enhanced equation environments with label support
        html = html.replace(/\\begin\{equation\}([\s\S]*?)\\end\{equation\}/g, (match, content) => {
            const labelMatch = content.match(/\\label\{([^}]+)\}/);
            const label = labelMatch ? labelMatch[1] : `eq-${this.equationCounter}`;
            const math = content.replace(/\\label\{[^}]*\}/, '').trim();
            
            const result = `<div class="math-equation" id="${label}">
                <div class="math-content">${this.convertMath(math)}</div>
                <div class="equation-number">(${this.equationCounter})</div>
            </div>`;
            this.equationCounter++;
            return result;
        });
        
        // Equation* environment (without numbering)
        html = html.replace(/\\begin\{equation\*\}([\s\S]*?)\\end\{equation\*\}/g, (match, math) => {
            return `<div class="math-display">${this.convertMath(math)}</div>`;
        });
        
        // Inline math ($...$) with improved handling
        html = html.replace(/\$([^$\n]+)\$/g, (match, math) => {
            return `<span class="math-inline">${this.convertMath(math)}</span>`;
        });
        
        // Enhanced align environment
        html = html.replace(/\\begin\{align\}([\s\S]*?)\\end\{align\}/g, (match, content) => {
            return this.parseAlignEnvironment(content, true);
        });
        
        // Align* environment (without numbering)
        html = html.replace(/\\begin\{align\*\}([\s\S]*?)\\end\{align\*\}/g, (match, content) => {
            return this.parseAlignEnvironment(content, false);
        });
        
        // Gather environment
        html = html.replace(/\\begin\{gather\}([\s\S]*?)\\end\{gather\}/g, (match, content) => {
            return this.parseGatherEnvironment(content, true);
        });
        
        // Gather* environment
        html = html.replace(/\\begin\{gather\*\}([\s\S]*?)\\end\{gather\*\}/g, (match, content) => {
            return this.parseGatherEnvironment(content, false);
        });
        
        // Multiline environment
        html = html.replace(/\\begin\{multline\}([\s\S]*?)\\end\{multline\}/g, (match, content) => {
            return this.parseMultilineEnvironment(content, true);
        });
        
        // Split environment
        html = html.replace(/\\begin\{split\}([\s\S]*?)\\end\{split\}/g, (match, content) => {
            const lines = content.split('\\\\').filter(line => line.trim());
            let html = '<span class="math-split">';
            html += lines.map((line, index) => {
                const math = line.trim();
                if (index === lines.length - 1) {
                    return this.convertMath(math);
                }
                return this.convertMath(math) + ' \\\\ ';
            }).join('');
            html += '</span>';
            return html;
        });
        
        // Matrix environments
        this.matrixEnvironments.forEach(env => {
            const regex = new RegExp(`\\\\begin\\{${env}\\}([\\s\\S]*?)\\\\end\\{${env}\\}`, 'g');
            html = html.replace(regex, (match, content) => {
                return this.parseMatrixEnvironment(content, env);
            });
        });
        
        // Cases environment
        html = html.replace(/\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g, (match, content) => {
            return this.parseCasesEnvironment(content);
        });
        
        // Enhanced fractions with nested support
        html = html.replace(/\\frac\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, (match, numerator, denominator) => {
            return `<span class="math-fraction">
                <span class="numerator">${this.convertMath(numerator)}</span>
                <span class="denominator">${this.convertMath(denominator)}</span>
            </span>`;
        });
        
        // Binomial coefficients
        html = html.replace(/\\binom\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, (match, top, bottom) => {
            return `<span class="math-binomial">
                <span class="binomial-top">${this.convertMath(top)}</span>
                <span class="binomial-bottom">${this.convertMath(bottom)}</span>
            </span>`;
        });
        
        // Enhanced subscripts and superscripts
        html = html.replace(/_(\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}|\w)/g, (match, sub) => {
            const content = sub.startsWith('{') ? sub.slice(1, -1) : sub;
            return `<sub>${this.convertMath(content)}</sub>`;
        });
        
        html = html.replace(/\^(\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}|\w)/g, (match, sup) => {
            const content = sup.startsWith('{') ? sup.slice(1, -1) : sup;
            return `<sup>${this.convertMath(content)}</sup>`;
        });
        
        // Greek letters (comprehensive)
        Object.entries(this.greekLetters).forEach(([latex, unicode]) => {
            const regex = new RegExp(latex.replace(/\\/g, '\\\\'), 'g');
            html = html.replace(regex, unicode);
        });
        
        // Mathematical operators
        Object.entries(this.operators).forEach(([latex, symbol]) => {
            const regex = new RegExp(latex.replace(/\\/g, '\\\\'), 'g');
            html = html.replace(regex, symbol);
        });
        
        // Physics package support
        html = this.parsePhysicsCommands(html);
        
        // Enhanced roots with index support
        html = html.replace(/\\sqrt\[(.*?)\]\{([^{}]+)\}/g, (match, index, radicand) => {
            return `<span class="math-root">
                <span class="root-index">${this.convertMath(index)}</span>
                <span class="root-symbol">√</span>
                <span class="radicand">${this.convertMath(radicand)}</span>
            </span>`;
        });
        
        html = html.replace(/\\sqrt\{([^{}]+)\}/g, (match, radicand) => {
            return `<span class="math-root">√(${this.convertMath(radicand)})</span>`;
        });
        
        // Text inside math
        html = html.replace(/\\text\{([^{}]+)\}/g, '<span class="math-text">$1</span>');
        html = html.replace(/\\mathrm\{([^{}]+)\}/g, '<span class="math-rm">$1</span>');
        html = html.replace(/\\mathbf\{([^{}]+)\}/g, '<span class="math-bf">$1</span>');
        html = html.replace(/\\mathit\{([^{}]+)\}/g, '<span class="math-it">$1</span>');
        html = html.replace(/\\mathsf\{([^{}]+)\}/g, '<span class="math-sf">$1</span>');
        html = html.replace(/\\mathtt\{([^{}]+)\}/g, '<span class="math-tt">$1</span>');
        
        // Enhanced delimiters
        html = html.replace(/\\left\(/g, '<span class="math-large">(</span>');
        html = html.replace(/\\right\)/g, '<span class="math-large">)</span>');
        html = html.replace(/\\left\[/g, '<span class="math-large">[</span>');
        html = html.replace(/\\right\]/g, '<span class="math-large">]</span>');
        html = html.replace(/\\left\\\{/g, '<span class="math-large">{</span>');
        html = html.replace(/\\right\\\}/g, '<span class="math-large">}</span>');
        
        // Spacing commands
        html = html.replace(/\\quad/g, '<span class="math-quad"></span>');
        html = html.replace(/\\qquad/g, '<span class="math-qquad"></span>');
        html = html.replace(/\\;/g, '<span class="math-thickspace"></span>');
        html = html.replace(/\\:/g, '<span class="math-medspace"></span>');
        html = html.replace(/\\,/g, '<span class="math-thinspace"></span>');
        html = html.replace(/\\!/g, '<span class="math-negthinspace"></span>');
        
        return html;
    }
    
    parseAlignEnvironment(content, numbered) {
        const lines = content.split('\\\\').filter(line => line.trim());
        let html = '<div class="math-align">';
        
        lines.forEach((line, index) => {
            const parts = line.split('&').map(part => part.trim());
            const labelMatch = line.match(/\\label\{([^}]+)\}/);
            const label = labelMatch ? labelMatch[1] : null;
            const mathWithoutLabel = line.replace(/\\label\{[^}]*\}/, '').trim();
            
            if (parts.length > 1) {
                // Multi-column alignment
                html += '<div class="align-row">';
                html += '<div class="align-column">';
                html += `<span class="math-content">${this.convertMath(parts[0])}</span>`;
                html += '</div>';
                html += '<div class="align-column align-right">';
                html += `<span class="math-content">${this.convertMath(parts[1])}</span>`;
                html += '</div>';
                if (numbered) {
                    html += `<div class="equation-number">(${this.equationCounter})</div>`;
                    this.equationCounter++;
                }
                html += '</div>';
            } else {
                html += `<div class="align-line">
                    <span class="math-content">${this.convertMath(mathWithoutLabel)}</span>`;
                if (numbered) {
                    html += `<span class="equation-number">(${this.equationCounter})</span>`;
                    this.equationCounter++;
                }
                html += '</div>';
            }
        });
        
        html += '</div>';
        return html;
    }
    
    parseGatherEnvironment(content, numbered) {
        const lines = content.split('\\\\').filter(line => line.trim());
        let html = '<div class="math-gather">';
        
        lines.forEach((line, index) => {
            const math = line.replace(/\\label\{[^}]*\}/, '').trim();
            html += `<div class="gather-line">
                <span class="math-content">${this.convertMath(math)}</span>`;
            if (numbered) {
                html += `<span class="equation-number">(${this.equationCounter})</span>`;
                this.equationCounter++;
            }
            html += '</div>';
        });
        
        html += '</div>';
        return html;
    }
    
    parseMultilineEnvironment(content, numbered) {
        const lines = content.split('\\\\').filter(line => line.trim());
        let html = '<div class="math-multiline">';
        
        lines.forEach((line, index) => {
            const math = line.replace(/\\label\{[^}]*\}/, '').trim();
            const isFirst = index === 0;
            const isLast = index === lines.length - 1;
            
            let alignClass = '';
            if (isFirst) alignClass = 'multiline-first';
            else if (isLast) alignClass = 'multiline-last';
            else alignClass = 'multiline-middle';
            
            html += `<div class="multiline-line ${alignClass}">
                <span class="math-content">${this.convertMath(math)}</span>`;
            if (numbered && isLast) {
                html += `<span class="equation-number">(${this.equationCounter})</span>`;
                this.equationCounter++;
            }
            html += '</div>';
        });
        
        html += '</div>';
        return html;
    }
    
    parseMatrixEnvironment(content, environment) {
        const rows = content.split('\\\\').filter(row => row.trim());
        const matrixHtml = [];
        
        // Determine delimiter based on environment
        let leftDelim = '(', rightDelim = ')';
        switch (environment) {
            case 'pmatrix': leftDelim = '('; rightDelim = ')'; break;
            case 'bmatrix': leftDelim = '['; rightDelim = ']'; break;
            case 'vmatrix': leftDelim = '|'; rightDelim = '|'; break;
            case 'Vmatrix': leftDelim = '‖'; rightDelim = '‖'; break;
            case 'cases': leftDelim = '{'; rightDelim = ''; break;
            default: leftDelim = ''; rightDelim = '';
        }
        
        rows.forEach((row, rowIndex) => {
            const cells = row.split('&').map(cell => cell.trim());
            const cellsHtml = cells.map(cell => 
                `<td class="matrix-cell">${this.convertMath(cell)}</td>`
            ).join('');
            matrixHtml.push(`<tr class="matrix-row">${cellsHtml}</tr>`);
        });
        
        return `<span class="math-matrix">
            <span class="matrix-delim matrix-left">${leftDelim}</span>
            <table class="matrix-content">${matrixHtml.join('')}</table>
            <span class="matrix-delim matrix-right">${rightDelim}</span>
        </span>`;
    }
    
    parseCasesEnvironment(content) {
        const rows = content.split('\\\\').filter(row => row.trim());
        const casesHtml = [];
        
        rows.forEach((row, index) => {
            const parts = row.split('&').map(part => part.trim());
            if (parts.length >= 2) {
                casesHtml.push(`
                    <tr class="cases-row">
                        <td class="cases-condition">${this.convertMath(parts[0])}</td>
                        <td class="cases-expression">${this.convertMath(parts[1])}</td>
                    </tr>
                `);
            } else {
                casesHtml.push(`
                    <tr class="cases-row">
                        <td class="cases-condition" colspan="2">${this.convertMath(parts[0])}</td>
                    </tr>
                `);
            }
        });
        
        return `<span class="math-cases">
            <span class="cases-delim">{</span>
            <table class="cases-content">${casesHtml.join('')}</table>
        </span>`;
    }
    
    parsePhysicsCommands(html) {
        // Vector notation
        html = html.replace(/\\(va|vb|vc|vd)\*\{([^}]+)\}/g, (match, type, vector) => {
            return `<span class="math-vector">→${this.convertMath(vector)}</span>`;
        });
        
        html = html.replace(/\\(va|vb|vc|vd)\{([^}]+)\}/g, (match, type, vector) => {
            return `<span class="math-vector">${this.convertMath(vector)}</span>`;
        });
        
        // Derivatives
        html = html.replace(/\\(p|q)derivative\{([^}]+)\}\{([^}]+)\}/g, (match, type, expr, varName) => {
            const symbol = type === 'p' ? '∂' : 'δ';
            return `<span class="math-derivative">
                ${symbol}${this.convertMath(expr)}/${symbol}${this.convertMath(varName)}
            </span>`;
        });
        
        // Physics operators
        html = html.replace(/\\grad/g, '<span class="math-operator">∇</span>');
        html = html.replace(/\\curl/g, '<span class="math-operator">∇×</span>');
        html = html.replace(/\\div/g, '<span class="math-operator">∇·</span>');
        html = html.replace(/\\laplacian/g, '<span class="math-operator">∇²</span>');
        
        // Quantum mechanics operators (physics package)
        html = html.replace(/\\expval\{([^{}]+)\}/g, '<span class="math-operator">⟨$1⟩</span>');
        html = html.replace(/\\bra\{([^{}]+)\}/g, '<span class="math-operator">⟨$1|</span>');
        html = html.replace(/\\ket\{([^{}]+)\}/g, '<span class="math-operator">|$1⟩</span>');
        html = html.replace(/\\comm\{([^{}]+)\}\{([^{}]+)\}/g, '<span class="math-operator">[$1,$2]</span>');
        html = html.replace(/\\anticomm\{([^{}]+)\}\{([^{}]+)\}/g, '<span class="math-operator">{$1,$2}</span>');
        
        // Derivative operators from physics package
        html = html.replace(/\\pdv\{([^{}]+)\}\{([^{}]+)\}/g, '<span class="math-derivative">∂$1/∂$2</span>');
        html = html.replace(/\\pdv\{([^{}]+)\}\{([^{}]+)\}\{([^{}]+)\}/g, '<span class="math-derivative">∂²$1/∂$2²</span>');
        html = html.replace(/\\dv\{([^{}]+)\}\{([^{}]+)\}/g, '<span class="math-operator">d$1/d$2</span>');
        html = html.replace(/\\dv\{([^{}]+)\}\{([^{}]+)\}\{([^{}]+)\}/g, '<span class="math-operator">d²$1/d$2²</span>');
        
        // Physics symbols
        Object.entries(this.physicsSymbols).forEach(([latex, symbol]) => {
            const regex = new RegExp(latex.replace(/\\/g, '\\\\'), 'g');
            html = html.replace(regex, symbol);
        });
        
        return html;
    }
    
    convertMath(math) {
        // Apply basic math conversion recursively
        return math
            .replace(/\\text\{([^{}]+)\}/g, '<span class="math-text">$1</span>')
            .replace(/\^\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, '<sup>$1</sup>')
            .replace(/_\{([^{}]*(?:\{[^{}]*\}[^{}]*)*)\}/g, '<sub>$1</sub>')
            .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
            .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1/$2)');
    }
}

module.exports = MathParser;