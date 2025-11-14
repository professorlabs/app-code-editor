/**
 * Comprehensive Test Suite for LaTeX Engine
 * Tests for math, TikZ, figures, and matrix parsing
 */

const fs = require('fs');
const path = require('path');

// Import parsers
const LatexEngine = require('../core/LatexEngine');
const MathParser = require('../core/parsers/MathParser');
const TikZParser = require('../core/parsers/TikZParser');
const FigureParser = require('../core/parsers/FigureParser');
const NiceMatrixParser = require('../core/parsers/NiceMatrixParser');

class TestSuite {
    constructor() {
        this.engine = new LatexEngine();
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
        this.total = 0;
    }

    addTest(name, testFn) {
        this.tests.push({ name, testFn });
    }

    runTests() {
        console.log('🧪 Running LaTeX Engine Test Suite\n');
        console.log('=' .repeat(50));

        this.tests.forEach(test => {
            this.total++;
            try {
                test.testFn();
                this.passed++;
                console.log(`✅ ${test.name}`);
            } catch (error) {
                this.failed++;
                console.log(`❌ ${test.name}`);
                console.log(`   Error: ${error.message}`);
            }
        });

        console.log('=' .repeat(50));
        console.log(`Results: ${this.passed}/${this.total} passed, ${this.failed} failed`);
        
        if (this.failed === 0) {
            console.log('🎉 All tests passed!');
        } else {
            console.log('⚠️  Some tests failed. Please review the errors above.');
        }
        
        return this.failed === 0;
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }

    assertContains(actual, expected, message) {
        if (!actual.includes(expected)) {
            throw new Error(`${message}: Expected "${expected}" in "${actual}"`);
        }
    }

    assertRegex(actual, pattern, message) {
        if (!pattern.test(actual)) {
            throw new Error(`${message}: Expected pattern ${pattern} in "${actual}"`);
        }
    }
}

// Create test suite
const testSuite = new TestSuite();

// ===== MATH PARSER TESTS =====
testSuite.addTest('Math Parser - Basic Inline Math', () => {
    const parser = new MathParser();
    const input = 'The equation $E = mc^2$ is famous.';
    const result = parser.parse(input, {});
    testSuite.assertContains(result, '<span class="math-inline">');
    testSuite.assertContains(result, '<sup>2</sup>');
});

testSuite.addTest('Math Parser - Display Math', () => {
    const parser = new MathParser();
    const input = '\\[\\int_0^\\infty e^{-x} dx = 1\\]';
    const result = parser.parse(input, {});
    testSuite.assertContains(result, '<div class="math-display">');
    testSuite.assertContains(result, '∫');
    testSuite.assertContains(result, '<sub>0</sub>');
    testSuite.assertContains(result, '<sup>∞</sup>');
});

testSuite.addTest('Math Parser - Equation Environment', () => {
    const parser = new MathParser();
    const input = '\\begin{equation}\\label{eq:test} a^2 + b^2 = c^2\\end{equation}';
    const result = parser.parse(input, {});
    testSuite.assertContains(result, '<div class="math-equation"');
    testSuite.assertContains(result, 'id="eq-test"');
    testSuite.assertContains(result, '<sup>2</sup>');
    testSuite.assertContains(result, 'equation-number');
});

testSuite.addTest('Math Parser - Align Environment', () => {
    const parser = new MathParser();
    const input = '\\begin{align} x &= y + z \\\\ a &= b + c \\end{align}';
    const result = parser.parse(input, {});
    testSuite.assertContains(result, '<div class="math-align">');
    testSuite.assertContains(result, 'align-line');
    testSuite.assertContains(result, 'equation-number');
});

testSuite.addTest('Math Parser - Matrix Environment', () => {
    const parser = new MathParser();
    const input = '\\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}';
    const result = parser.parse(input, {});
    testSuite.assertContains(result, '<span class="math-matrix">');
    testSuite.assertContains(result, '<table class="matrix-content">');
    testSuite.assertContains(result, '<td class="matrix-cell">1</td>');
});

testSuite.addTest('Math Parser - Greek Letters', () => {
    const parser = new MathParser();
    const input = '$\\alpha + \\beta = \\gamma$';
    const result = parser.parse(input, {});
    testSuite.assertContains(result, 'α');
    testSuite.assertContains(result, 'β');
    testSuite.assertContains(result, 'γ');
});

testSuite.addTest('Math Parser - Physics Package', () => {
    const parser = new MathParser();
    const input = '$\\grad \\cdot \\mathbf{F} = \\div \\mathbf{F}$';
    const result = parser.parse(input, {});
    testSuite.assertContains(result, '∇');
    testSuite.assertContains(result, '∇·');
    testSuite.assertContains(result, '<span class="math-bf">F</span>');
});

// ===== TIKZ PARSER TESTS =====
testSuite.addTest('TikZ Parser - Basic Diagram', () => {
    const parser = new TikZParser();
    const input = '\\begin{tikzpicture}\\draw (0,0) -- (2,0);\n\\draw (0,0) -- (0,2);\n\\end{tikzpicture}';
    const result = parser.parse(input, {});
    testSuite.assertContains(result, '<div class="tikz-diagram">');
    testSuite.assertContains(result, '<svg');
    testSuite.assertContains(result, '<path');
});

testSuite.addTest('TikZ Parser - Node with Text', () => {
    const parser = new TikZParser();
    const input = '\\begin{tikzpicture}\\node at (0,0) {Hello};\n\\end{tikzpicture}';
    const result = parser.parse(input, {});
    testSuite.assertContains(result, '<div class="tikz-diagram">');
    testSuite.assertContains(result, 'Hello');
});

testSuite.addTest('TikZ Parser - Circle Shape', () => {
    const parser = new TikZParser();
    const input = '\\begin{tikzpicture}\\draw (0,0) circle (1);\n\\end{tikzpicture}';
    const result = parser.parse(input, {});
    testSuite.assertContains(result, '<div class="tikz-diagram">');
    testSuite.assertContains(result, '<circle');
});

// ===== FIGURE PARSER TESTS =====
testSuite.addTest('Figure Parser - Basic Figure', () => {
    const parser = new FigureParser();
    const input = '\\begin{figure}\\centering\\includegraphics[width=0.5\\textwidth]{test.png}\\caption{Test Figure}\\label{fig:test}\\end{figure}';
    const result = parser.parse(input, {});
    testSuite.assertContains(result, '<div class="figure"');
    testSuite.assertContains(result, 'id="fig:test"');
    testSuite.assertContains(result, 'Test Figure');
    testSuite.assertContains(result, 'Figure 1');
});

testSuite.addTest('Figure Parser - Subfigures', () => {
    const parser = new FigureParser();
    const input = '\\begin{figure}\\begin{subfigure}[width=0.5\\textwidth]\\includegraphics{fig1.png}\\caption{Part A}\\label{fig:a}\\end{subfigure}\\begin{subfigure}[width=0.5\\textwidth]\\includegraphics{fig2.png}\\caption{Part B}\\label{fig:b}\\end{subfigure}\\caption{Complete Figure}\\end{figure}';
    const result = parser.parse(input, {});
    testSuite.assertContains(result, '<div class="subfigures-container">');
    testSuite.assertContains(result, '<div class="subfigure"');
    testSuite.assertContains(result, 'Part A');
    testSuite.assertContains(result, 'Part B');
});

testSuite.addTest('Figure Parser - Table Environment', () => {
    const parser = new FigureParser();
    const input = '\\begin{table}\\centering\\begin{tabular}{|c|c|}\\hline A & B \\\\ \\hline 1 & 2 \\\\ \\hline\\end{tabular}\\caption{Test Table}\\label{tab:test}\\end{table}';
    const result = parser.parse(input, {});
    testSuite.assertContains(result, '<div class="table"');
    testSuite.assertContains(result, 'id="tab:test"');
    testSuite.assertContains(result, 'Test Table');
    testSuite.assertContains(result, 'Table 1');
});

testSuite.addTest('Figure Parser - Algorithm Environment', () => {
    const parser = new FigureParser();
    const input = '\\begin{algorithm}\\caption{Test Algorithm}\\label{algo:test}\\begin{algorithmic}\\State $x \\gets 0$\\State\\If{$x > 0$}\\State\\Return $x$\\EndIf\\end{algorithmic}\\end{algorithm}';
    const result = parser.parse(input, {});
    testSuite.assertContains(result, '<div class="algorithm"');
    testSuite.assertContains(result, 'id="algo:test"');
    testSuite.assertContains(result, 'Test Algorithm');
    testSuite.assertContains(result, 'Algorithm 1');
    testSuite.assertContains(result, 'algorithm-keyword');
});

testSuite.addTest('Figure Parser - Cross References', () => {
    const parser = new FigureParser();
    const input = 'As shown in \\ref{fig:test} and \\ref{tab:test}.';
    const result = parser.parse(input, {});
    testSuite.assertContains(result, '<a href="#fig:test"');
    testSuite.assertContains(result, 'figure-ref');
    testSuite.assertContains(result, '<a href="#tab:test"');
    testSuite.assertContains(result, 'table-ref');
});

// ===== NICE MATRIX PARSER TESTS =====
testSuite.addTest('NiceMatrix Parser - Basic Matrix', () => {
    const parser = new NiceMatrixParser();
    const input = '\\begin{NiceMatrix} 1 & 2 \\\\ 3 & 4 \\end{NiceMatrix}';
    const result = parser.parse(input, {});
    testSuite.assertContains(result, '<span class="nice-matrix');
    testSuite.assertContains(result, 'nice-matrix-table');
    testSuite.assertContains(result, '<td class="nice-matrix-cell">1</td>');
});

testSuite.addTest('NiceMatrix Parser - Matrix with Options', () => {
    const parser = new NiceMatrixParser();
    const input = '\\begin{bNiceMatrix}[cell-background-color=blue] 1 & 2 \\\\ 3 & 4 \\end{bNiceMatrix}';
    const result = parser.parse(input, {});
    testSuite.assertContains(result, 'bNiceMatrix');
    testSuite.assertContains(result, 'cell-background');
});

testSuite.addTest('NiceMatrix Parser - Inline Matrix', () => {
    const parser = new NiceMatrixParser();
    const input = '$\\Matrix{1 & 2 \\\\ 3 & 4}$';
    const result = parser.parse(input, {});
    testSuite.assertContains(result, '<span class="inline-matrix">');
    testSuite.assertContains(result, 'inline-matrix-table');
});

// ===== INTEGRATION TESTS =====
testSuite.addTest('Integration - Complex Document', () => {
    const input = `
\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{tikz}
\\usepackage{graphicx}

\\begin{document}

\\title{Test Document}
\\author{Test Author}

\\section{Introduction}

This document tests various LaTeX features.

\\begin{equation}
\\label{eq:einstein}
E = mc^2
\\end{equation}

\\begin{figure}
\\centering
\\begin{tikzpicture}
\\draw (0,0) circle (1);
\\node at (0,0) {Center};
\\end{tikzpicture}
\\caption{TikZ Diagram}
\\label{fig:tikz}
\\end{figure}

As shown in Equation \\ref{eq:einstein} and Figure \\ref{fig:tikz}.

\\begin{align}
f(x) &= x^2 + 2x + 1 \\\\
&= (x + 1)^2
\\end{align}

\\end{document}
    `;
    
    const result = testSuite.engine.parse(input);
    testSuite.assertContains(result.html, 'Test Document');
    testSuite.assertContains(result.html, 'E = mc<sup>2</sup>');
    testSuite.assertContains(result.html, '<div class="tikz-diagram">');
    testSuite.assertContains(result.html, 'equation-number');
    testSuite.assertContains(result.html, 'math-align');
});

testSuite.addTest('Integration - Advanced Mathematics', () => {
    const input = `
\\documentclass{article}
\\usepackage{amsmath, amssymb, mathtools, physics, tensor}

\\begin{document}

\\section{Advanced Mathematics}

\\[
\\grad \\cdot \\mathbf{F} = \\div \\mathbf{F} = \\rho
\\]

\\begin{align}
\\int_0^\\infty e^{-x} dx &= 1 \\\\
\\sum_{n=1}^\\infty \\frac{1}{n^2} &= \\frac{\\pi^2}{6}
\\end{align}

\\begin{pmatrix}
\\alpha & \\beta \\\\
\\gamma & \\delta
\\end{pmatrix}

\\end{document}
    `;
    
    const result = testSuite.engine.parse(input);
    testSuite.assertContains(result.html, '∇');
    testSuite.assertContains(result.html, '∇·');
    testSuite.assertContains(result.html, '∫');
    testSuite.assertContains(result.html, '∑');
    testSuite.assertContains(result.html, 'α');
    testSuite.assertContains(result.html, 'β');
    testSuite.assertContains(result.html, 'γ');
    testSuite.assertContains(result.html, 'δ');
});

testSuite.addTest('Integration - NiceMatrix with Math', () => {
    const input = `
\\documentclass{article}
\\usepackage{nicematrix}
\\usepackage{amsmath}

\\begin{document}

\\section{Advanced Matrices}

\\begin{bNiceMatrix}[cell-background-color=red]
a_{11} & a_{12} \\\\
a_{21} & a_{22}
\\end{bNiceMatrix}

\\[
\\begin{pmatrix}
\\frac{1}{2} & \\frac{1}{3} \\\\
\\frac{1}{4} & \\frac{1}{5}
\\end{pmatrix}
\\]

\\end{document}
    `;
    
    const result = testSuite.engine.parse(input);
    testSuite.assertContains(result.html, 'nice-matrix');
    testSuite.assertContains(result.html, 'a<sub>11</sub>');
    testSuite.assertContains(result.html, 'numerator');
    testSuite.assertContains(result.html, 'denominator');
});

// ===== PERFORMANCE TESTS =====
testSuite.addTest('Performance - Large Document', () => {
    const largeContent = `
\\documentclass{article}
\\usepackage{amsmath}
\\begin{document}
${Array.from({length: 100}, (_, i) => `Section ${i + 1}: $x_{${i + 1}} = ${i + 1}$`).join('\n')}
\\end{document}
    `;
    
    const startTime = Date.now();
    const result = testSuite.engine.parse(largeContent);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    testSuite.assert(duration < 5000, `Parsing took too long: ${duration}ms`);
    testSuite.assert(result.html.length > 1000, 'Result should be substantial');
});

testSuite.addTest('Performance - Complex Math', () => {
    const complexMath = `
\\documentclass{article}
\\usepackage{amsmath}
\\begin{document}
${Array.from({length: 50}, (_, i) => `
\\begin{align}
\\int_{0}^{\\infty} x^{${i}} e^{-x} dx &= ${i}!
\\\\
\\sum_{n=1}^{\\infty} \\frac{1}{n^{${i + 2}}} &= \\zeta(${i + 2})
\\end{align}
`).join('\n')}
\\end{document}
    `;
    
    const startTime = Date.now();
    const result = testSuite.engine.parse(complexMath);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    testSuite.assert(duration < 3000, `Complex math parsing took too long: ${duration}ms`);
    testSuite.assertContains(result.html, 'ζ(');
});

// ===== ERROR HANDLING TESTS =====
testSuite.addTest('Error Handling - Malformed Math', () => {
    const parser = new MathParser();
    const input = '$\\frac{1}{0$ (missing closing brace)';
    const result = parser.parse(input, {});
    testSuite.assertContains(result, '<span class="math-inline">');
    testSuite.assert(result.length > 0, 'Should not crash on malformed input');
});

testSuite.addTest('Error Handling - Invalid TikZ', () => {
    const parser = new TikZParser();
    const input = '\\begin{tikzpicture}\\draw (0,0) -- \\end{tikzpicture}';
    const result = parser.parse(input, {});
    testSuite.assertContains(result, '<div class="tikz-diagram">');
    testSuite.assert(result.length > 0, 'Should not crash on invalid TikZ');
});

testSuite.addTest('Error Handling - Empty Document', () => {
    const input = '\\documentclass{article}\\begin{document}\\end{document}';
    const result = testSuite.engine.parse(input);
    testSuite.assert(result.html.length > 0, 'Should handle empty documents');
});

// ===== REGRESSION TESTS =====
testSuite.addTest('Regression - Special Characters', () => {
    const parser = new MathParser();
    const input = '$\\langle x, y \\rangle \\le \\|x\\| \\cdot \\|y\\|$';
    const result = parser.parse(input, {});
    testSuite.assertContains(result, '⟨');
    testSuite.assertContains(result, '⟩');
    testSuite.assertContains(result, '≤');
    testSuite.assertContains(result, '∥');
    testSuite.assertContains(result, '·');
});

testSuite.addTest('Regression - Nested Brackets', () => {
    const parser = new MathParser();
    const input = '$\\frac{\\int_{0}^{1} f(x) dx}{\\int_{0}^{1} g(x) dx}$';
    const result = parser.parse(input, {});
    testSuite.assertContains(result, 'numerator');
    testSuite.assertContains(result, 'denominator');
    testSuite.assertContains(result, '∫');
});

// ===== GENERATE TEST OUTPUT FILES =====
function generateTestOutputs() {
    console.log('\n📝 Generating test output files...');
    
    const testCases = [
        {
            name: 'basic-math',
            content: `\\documentclass{article}
\\usepackage{amsmath}
\\begin{document}
\\title{Basic Math Test}
\\section{Mathematics}
The famous equation: $E = mc^2$
\\[\\int_0^\\infty e^{-x} dx = 1\\]
\\end{document}`
        },
        {
            name: 'tikz-diagram',
            content: `\\documentclass{article}
\\usepackage{tikz}
\\begin{document}
\\title{TikZ Test}
\\section{Diagrams}
\\begin{tikzpicture}
\\draw (0,0) -- (2,0) -- (2,2) -- cycle;
\\node at (1,1) {Triangle};
\\end{tikzpicture}
\\end{document}`
        },
        {
            name: 'advanced-figures',
            content: `\\documentclass{article}
\\usepackage{graphicx}
\\usepackage{subcaption}
\\begin{document}
\\title{Advanced Figures Test}
\\section{Figures}
\\begin{figure}
\\begin{subfigure}[width=0.5\\textwidth]\\caption{A}\\end{subfigure}
\\begin{subfigure}[width=0.5\\textwidth]\\caption{B}\\end{subfigure}
\\caption{Complete figure}
\\end{figure}
\\end{document}`
        }
    ];
    
    const outputDir = path.join(__dirname, '..', 'test-output');
    
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    testCases.forEach(testCase => {
        try {
            const result = testSuite.engine.parse(testCase.content);
            const outputPath = path.join(outputDir, `${testCase.name}.html`);
            
            const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${testCase.name}</title>
    <style>
        ${require('../core/styles/MathCSS.js')}
        ${require('../core/styles/TikZCSS.js')}
    </style>
</head>
<body>
    ${result.html}
</body>
</html>`;
            
            fs.writeFileSync(outputPath, fullHtml);
            console.log(`✅ Generated ${testCase.name}.html`);
        } catch (error) {
            console.log(`❌ Failed to generate ${testCase.name}.html: ${error.message}`);
        }
    });
}

// Run tests
if (require.main === module) {
    const success = testSuite.runTests();
    
    if (success) {
        generateTestOutputs();
        console.log('\n🎊 All tests completed successfully!');
        process.exit(0);
    } else {
        console.log('\n💥 Some tests failed!');
        process.exit(1);
    }
}

module.exports = TestSuite;