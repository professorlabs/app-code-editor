/**
 * Math Parser
 * Handles mathematical equations and formulas
 */

class MathParser {
    parse(latexContent, context) {
        let html = latexContent;
        let equationCounter = 1;
        
        // Display math (equations with \[ \])
        html = html.replace(/\\\[\s*([\s\S]*?)\s*\\\]/g, (match, math) => {
            return `<div class="math-display">${this.convertMath(math)}</div>`;
        });
        
        // Equation environment
        html = html.replace(/\\begin\{equation\}([\s\S]*?)\\end\{equation\}/g, (match, math) => {
            const id = `eq-${equationCounter}`;
            equationCounter++;
            return `<div class="math-equation" id="${id}">
                <div class="math-content">${this.convertMath(math)}</div>
                <div class="equation-number">(${equationCounter-1})</div>
            </div>`;
        });
        
        // Equation* environment (without numbering)
        html = html.replace(/\\begin\{equation\*\}([\s\S]*?)\\end\{equation\*\}/g, (match, math) => {
            return `<div class="math-display">${this.convertMath(math)}</div>`;
        });
        
        // Inline math ($...$)
        html = html.replace(/\$([^$\n]+)\$/g, (match, math) => {
            return `<span class="math-inline">${this.convertMath(math)}</span>`;
        });
        
        // Math environments
        html = html.replace(/\\begin\{align\}([\s\S]*?)\\end\{align\}/g, (match, content) => {
            const lines = content.split('\\\\').filter(line => line.trim());
            let html = '<div class="math-align">';
            
            lines.forEach((line, index) => {
                const math = line.replace(/\\label\{[^}]*\}/, '').trim();
                html += `<div class="align-line">
                    <span class="math-content">${this.convertMath(math)}</span>
                    <span class="equation-number">(${equationCounter})</span>
                </div>`;
                equationCounter++;
            });
            
            html += '</div>';
            return html;
        });
        
        html = html.replace(/\\begin\{align\*\}([\s\S]*?)\\end\{align\*\}/g, (match, content) => {
            const lines = content.split('\\\\').filter(line => line.trim());
            let html = '<div class="math-align">';
            
            lines.forEach(line => {
                const math = line.trim();
                html += `<div class="align-line">
                    <span class="math-content">${this.convertMath(math)}</span>
                </div>`;
            });
            
            html += '</div>';
            return html;
        });
        
        // Gather environment
        html = html.replace(/\\begin\{gather\}([\s\S]*?)\\end\{gather\}/g, (match, content) => {
            const lines = content.split('\\\\').filter(line => line.trim());
            let html = '<div class="math-gather">';
            
            lines.forEach((line, index) => {
                const math = line.trim();
                html += `<div class="gather-line">
                    <span class="math-content">${this.convertMath(math)}</span>
                    <span class="equation-number">(${equationCounter})</span>
                </div>`;
                equationCounter++;
            });
            
            html += '</div>';
            return html;
        });
        
        // Fractions
        html = html.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, (match, numerator, denominator) => {
            return `<span class="math-fraction">
                <span class="numerator">${numerator}</span>
                <span class="denominator">${denominator}</span>
            </span>`;
        });
        
        // Subscripts and superscripts
        html = html.replace(/_(\{[^}]+\}|\w)/g, (match, sub) => {
            const content = sub.startsWith('{') ? sub.slice(1, -1) : sub;
            return `<sub>${content}</sub>`;
        });
        
        html = html.replace(/\^(\{[^}]+\}|\w)/g, (match, sup) => {
            const content = sup.startsWith('{') ? sup.slice(1, -1) : sup;
            return `<sup>${content}</sup>`;
        });
        
        // Greek letters
        const greekLetters = {
            '\\alpha': 'α', '\\beta': 'β', '\\gamma': 'γ', '\\delta': 'δ',
            '\\epsilon': 'ε', '\\zeta': 'ζ', '\\eta': 'η', '\\theta': 'θ',
            '\\iota': 'ι', '\\kappa': 'κ', '\\lambda': 'λ', '\\mu': 'μ',
            '\\nu': 'ν', '\\xi': 'ξ', '\\pi': 'π', '\\rho': 'ρ',
            '\\sigma': 'σ', '\\tau': 'τ', '\\upsilon': 'υ', '\\phi': 'φ',
            '\\chi': 'χ', '\\psi': 'ψ', '\\omega': 'ω',
            '\\Gamma': 'Γ', '\\Delta': 'Δ', '\\Theta': 'Θ', '\\Lambda': 'Λ',
            '\\Xi': 'Ξ', '\\Pi': 'Π', '\\Sigma': 'Σ', '\\Upsilon': 'Υ',
            '\\Phi': 'Φ', '\\Psi': 'Ψ', '\\Omega': 'Ω'
        };
        
        Object.entries(greekLetters).forEach(([latex, unicode]) => {
            html = html.replace(new RegExp(latex.replace(/\\/g, '\\\\'), 'g'), unicode);
        });
        
        // Math operators
        const operators = {
            '\\times': '×', '\\div': '÷', '\\pm': '±', '\\mp': '∓',
            '\\leq': '≤', '\\geq': '≥', '\\neq': '≠', '\\approx': '≈',
            '\\infty': '∞', '\\partial': '∂', '\\nabla': '∇', '\\sum': '∑',
            '\\prod': '∏', '\\int': '∫', '\\oint': '∮', '\\sqrt': '√',
            '\\alpha': 'α', '\\beta': 'β', '\\gamma': 'γ', '\\delta': 'δ'
        };
        
        Object.entries(operators).forEach(([latex, symbol]) => {
            html = html.replace(new RegExp(latex.replace(/\\/g, '\\\\'), 'g'), symbol);
        });
        
        return html;
    }
    
    convertMath(math) {
        // Basic math conversion - could be enhanced with MathJax/KaTeX
        return math
            .replace(/\\text\{([^}]+)\}/g, '$1')
            .replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>')
            .replace(/_\{([^}]+)\}/g, '<sub>$1</sub>')
            .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
            .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1/$2)')
            .replace(/\\sum_\{([^}]+)\}\^\{([^}]+)\}/g, '∑<sub>$1</sub><sup>$2</sup>')
            .replace(/\\int_\{([^}]+)\}\^\{([^}]+)\}/g, '∫<sub>$1</sub><sup>$2</sup>');
    }
}

module.exports = MathParser;