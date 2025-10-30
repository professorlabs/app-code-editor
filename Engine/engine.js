#!/usr/bin/env node

/**
 * Professional LaTeX to HTML Engine
 * Complete LaTeX feature support with modular architecture
 * Usage: node engine.js input.tex [output.html] [options]
 */

const path = require('path');
const LatexEngine = require('./core/LatexEngine');

function parseArguments() {
    const args = process.argv.slice(2);
    const options = {
        theme: 'auto',
        format: 'html',
        minify: false,
        watch: false,
        verbose: false
    };
    
    const files = [];
    
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        if (arg.startsWith('--')) {
            const option = arg.substring(2);
            const value = args[i + 1];
            
            switch (option) {
                case 'theme':
                    options.theme = value;
                    i++; // Skip next argument
                    break;
                case 'format':
                    options.format = value;
                    i++;
                    break;
                case 'minify':
                    options.minify = true;
                    break;
                case 'watch':
                    options.watch = true;
                    break;
                case 'verbose':
                    options.verbose = true;
                    break;
                case 'help':
                    showHelp();
                    process.exit(0);
                    break;
                case 'version':
                    console.log('LaTeX2HTML Professional v2.0.0');
                    console.log('Complete LaTeX to HTML converter with premium features');
                    process.exit(0);
                    break;
            }
        } else if (!arg.startsWith('-')) {
            files.push(arg);
        }
    }
    
    return { files, options };
}

function showHelp() {
    console.log(`
LaTeX2HTML Professional - Complete LaTeX to HTML Converter

USAGE:
    node engine.js <input.tex> [output.html] [options]

EXAMPLES:
    node engine.js document.tex                    # Basic conversion
    node engine.js resume.tex resume.html          # Specify output
    node engine.js book.tex --theme academic       # Use academic theme
    node engine.js slides.tex --format revealjs    # Export as reveal.js
    node engine.js report.tex --watch              # Watch for changes
    node engine.js thesis.tex --theme book --minify # Optimized output

SUPPORTED THEMES:
    auto     - Auto-detect from LaTeX document
    default  - Clean, modern theme
    a4       - A4 paper format
    resume   - Professional resume theme
    book     - Book/chapter layout
    modern   - Modern minimalist design
    academic - Academic paper style

SUPPORTED FORMATS:
    html     - Standard HTML (default)
    pdf      - PDF via headless Chrome
    revealjs - Reveal.js presentation
    markdown - Markdown format

DOCUMENT CLASSES:
    article  - Articles and papers
    report   - Technical reports
    book     - Books and theses
    letter   - Letters and correspondence
    resume   - Resumes and CVs
    beamer   - Presentations

ADVANCED FEATURES:
    Complete LaTeX command support
    Mathematical equations (MathJax/KaTeX)
    Multi-language syntax highlighting
    Tables, figures, and floats
    Bibliographies and citations
    Cross-references and links
    Professional themes
    Responsive design
    Code blocks with copy functionality
    Table of contents generation
    Index and glossary support

OPTIONS:
    --theme <name>      Set theme (auto, default, a4, resume, book, modern, academic)
    --format <type>     Output format (html, pdf, revealjs, markdown)
    --minify           Minify output CSS/JS
    --watch            Watch file for changes
    --verbose          Show detailed processing information
    --help             Show this help message
    --version          Show version information

For more information, visit: https://github.com/professorlab/latex2html-professional
`);
}

function main() {
    const { files, options } = parseArguments();
    
    if (files.length === 0) {
        console.error('Error: No input file specified');
        console.log('Use --help for usage information');
        process.exit(1);
    }
    
    const inputFile = files[0];
    const outputFile = files[1];
    
    if (options.verbose) {
        console.log(`LaTeX2HTML Professional v2.0.0`);
        console.log(`Input: ${inputFile}`);
        if (outputFile) console.log(`Output: ${outputFile}`);
        console.log(`Theme: ${options.theme}`);
        console.log(`Format: ${options.format}`);
        console.log('');
    }
    
    // Initialize engine
    const engine = new LatexEngine();
    
    try {
        // Convert the file
        const result = engine.convert(inputFile, outputFile, options);
        
        if (options.verbose) {
            console.log('Conversion completed successfully!');
            console.log(`Tip: Open ${result} in your browser`);
        }
        
        // Watch mode
        if (options.watch) {
            console.log(`Watching ${inputFile} for changes...`);
            console.log('Press Ctrl+C to stop watching');
            
            const fs = require('fs');
            let lastModified = fs.statSync(inputFile).mtime;
            
            setInterval(() => {
                try {
                    const currentModified = fs.statSync(inputFile).mtime;
                    if (currentModified > lastModified) {
                        lastModified = currentModified;
                        console.log(`File changed, recompiling...`);
                        engine.convert(inputFile, outputFile, options);
                        console.log(`Recompilation complete!`);
                    }
                } catch (error) {
                    console.error(`Error watching file: ${error.message}`);
                }
            }, 1000);
        }
        
    } catch (error) {
        console.error(`Error: ${error.message}`);
        if (options.verbose) {
            console.error(error.stack);
        }
        process.exit(1);
    }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
    process.exit(1);
});

// Run main function
if (require.main === module) {
    main();
}

module.exports = require('./core/LatexEngine');