#!/usr/bin/env node

/**
 * LaTeX to HTML Engine CLI
 * Professional command-line interface for document conversion
 */

const fs = require('fs');
const path = require('path');
const LatexEngine = require('./LatexEngine');

class CLI {
    constructor() {
        this.engine = new LatexEngine();
        this.version = '1.0.0';
    }

    /**
     * Main entry point
     */
    async run(args) {
        try {
            // Parse command line arguments
            const { command, options, filePaths } = this.parseArguments(args);
            
            // Handle different commands
            switch (command) {
                case 'convert':
                case 'c':
                    await this.handleConvert(filePaths, options);
                    break;
                    
                case 'validate':
                case 'v':
                    await this.handleValidate(filePaths, options);
                    break;
                    
                case 'preview':
                case 'p':
                    await this.handlePreview(filePaths, options);
                    break;
                    
                case 'info':
                case 'i':
                    this.handleInfo(options);
                    break;
                    
                case 'batch':
                case 'b':
                    await this.handleBatch(filePaths, options);
                    break;
                    
                case 'help':
                case 'h':
                case '--help':
                case '-h':
                    this.showHelp();
                    break;
                    
                case 'version':
                case '--version':
                    this.showVersion();
                    break;
                    
                default:
                    if (filePaths.length > 0) {
                        // Default to convert if files are provided but no explicit command
                        await this.handleConvert(filePaths, options);
                    } else {
                        console.error('Unknown command:', command);
                        console.error('Use --help for usage information');
                        process.exit(1);
                    }
            }
            
        } catch (error) {
            console.error('Error:', error.message);
            process.exit(1);
        }
    }

    /**
     * Parse command line arguments
     */
    parseArguments(args) {
        const parsed = {
            command: 'convert',
            options: {},
            filePaths: []
        };

        let i = 2; // Skip node and script path

        // Check for command
        if (args[i] && !args[i].startsWith('-')) {
            parsed.command = args[i];
            i++;
        }

        // Parse options
        while (i < args.length && args[i].startsWith('-')) {
            const option = args[i];
            
            switch (option) {
                case '-o':
                case '--output':
                    parsed.options.outputPath = args[++i];
                    break;
                    
                case '-d':
                case '--output-dir':
                    parsed.options.outputDirectory = args[++i];
                    break;
                    
                case '-t':
                case '--theme':
                    parsed.options.theme = args[++i];
                    break;
                    
                case '--minify':
                    parsed.options.minify = true;
                    break;
                    
                case '--no-validate':
                    parsed.options.validate = false;
                    break;
                    
                case '--preserve-comments':
                    parsed.options.preserveComments = true;
                    break;
                    
                case '-v':
                case '--verbose':
                    parsed.options.verbose = true;
                    break;
                    
                case '-q':
                case '--quiet':
                    parsed.options.quiet = true;
                    break;
                    
                default:
                    console.error('Unknown option:', option);
                    process.exit(1);
            }
            
            i++;
        }

        // Remaining arguments are file paths
        while (i < args.length) {
            parsed.filePaths.push(args[i]);
            i++;
        }

        return parsed;
    }

    /**
     * Handle convert command
     */
    async handleConvert(filePaths, options) {
        if (filePaths.length === 0) {
            throw new Error('No input files specified');
        }

        // Configure engine based on options
        this.configureEngine(options);

        if (filePaths.length === 1) {
            // Single file conversion
            const filePath = filePaths[0];
            const outputPath = options.outputPath;
            
            if (options.verbose) {
                console.log(`Converting ${filePath}...`);
            }
            
            const result = await this.engine.convertFile(filePath, outputPath);
            
            if (!options.quiet) {
                console.log(`✓ Successfully converted ${path.basename(result.inputPath)}`);
                console.log(`  Output: ${result.outputPath}`);
                console.log(`  Document Class: ${result.documentClass}`);
            }
            
        } else {
            // Multiple files
            if (options.verbose) {
                console.log(`Converting ${filePaths.length} files...`);
            }
            
            const outputDirectory = options.outputDirectory;
            const results = await this.engine.convertBatch(filePaths, outputDirectory);
            
            const successful = results.filter(r => r.status === 'success');
            const failed = results.filter(r => r.status === 'error');
            
            if (!options.quiet) {
                console.log(`Conversion complete:`);
                console.log(`  ✓ Successful: ${successful.length}`);
                console.log(`  ✗ Failed: ${failed.length}`);
                
                if (failed.length > 0) {
                    console.log('\nFailed conversions:');
                    failed.forEach(result => {
                        console.log(`  ✗ ${path.basename(result.inputPath)}: ${result.error}`);
                    });
                }
                
                if (successful.length > 0) {
                    console.log('\nSuccessfully converted:');
                    successful.forEach(result => {
                        console.log(`  ✓ ${path.basename(result.outputPath)}`);
                    });
                }
            }
            
            if (failed.length > 0) {
                process.exit(1);
            }
        }
    }

    /**
     * Handle validate command
     */
    async handleValidate(filePaths, options) {
        if (filePaths.length === 0) {
            throw new Error('No input files specified');
        }

        let hasErrors = false;

        for (const filePath of filePaths) {
            if (!fs.existsSync(filePath)) {
                console.error(`File not found: ${filePath}`);
                hasErrors = true;
                continue;
            }

            const content = fs.readFileSync(filePath, 'utf8');
            const validation = this.engine.validateDocument(content);
            
            console.log(`\nValidating ${path.basename(filePath)}:`);
            
            if (validation.isValid) {
                console.log('  ✓ Document structure is valid');
            } else {
                console.log('  ✗ Document has errors:');
                validation.errors.forEach(error => {
                    console.log(`    - ${error}`);
                });
                hasErrors = true;
            }
        }

        if (hasErrors) {
            process.exit(1);
        }
    }

    /**
     * Handle preview command
     */
    async handlePreview(filePaths, options) {
        if (filePaths.length === 0) {
            throw new Error('No input files specified');
        }

        const filePath = filePaths[0];
        
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const preview = this.engine.previewStructure(content);
        
        console.log(`\nDocument Preview: ${path.basename(filePath)}`);
        console.log('='.repeat(50));
        console.log(`Document Class: ${preview.documentClass}`);
        console.log(`Options: ${JSON.stringify(preview.options, null, 2)}`);
        
        console.log('\nStructure:');
        preview.structure.sections.forEach(section => {
            const indent = '  '.repeat(section.level);
            console.log(`${indent}${section.type}: ${section.title}`);
        });
        
        console.log(`\nContent:`);
        console.log(`  Figures: ${preview.structure.figures}`);
        console.log(`  Tables: ${preview.structure.tables}`);
        console.log(`  Abstract: ${preview.structure.hasAbstract ? 'Yes' : 'No'}`);
        console.log(`  Bibliography: ${preview.structure.hasBibliography ? 'Yes' : 'No'}`);
        console.log(`  Table of Contents: ${preview.structure.hasTableOfContents ? 'Yes' : 'No'}`);
    }

    /**
     * Handle info command
     */
    handleInfo(options) {
        const stats = this.engine.getStatistics();
        
        console.log('\nLaTeX to HTML Engine Information');
        console.log('='.repeat(40));
        console.log(`Version: ${this.version}`);
        console.log(`\nSupported Document Classes: ${stats.rendererStats.totalRenderers}`);
        
        console.log('\nAvailable Renderers:');
        for (const [docClass, info] of Object.entries(stats.rendererStats.rendererDetails)) {
            console.log(`  ${docClass}: ${info.displayName} (${info.supportedCommands.length} commands)`);
        }
        
        console.log(`\nCurrent Theme: ${stats.themeInfo.displayName}`);
        console.log(`\nCurrent Options:`);
        Object.entries(stats.options).forEach(([key, value]) => {
            console.log(`  ${key}: ${value}`);
        });
    }

    /**
     * Handle batch command
     */
    async handleBatch(filePaths, options) {
        // Alias for convert with multiple files
        await this.handleConvert(filePaths, { ...options, batch: true });
    }

    /**
     * Configure engine based on CLI options
     */
    configureEngine(options) {
        if (options.minify) {
            this.engine.setMinification(true);
        }
        
        if (options.validate !== false) {
            this.engine.setValidation(true);
        }
        
        if (options.outputDirectory) {
            this.engine.setOutputDirectory(options.outputDirectory);
        }
        
        // Note: Theme customization would require implementing theme loading
        if (options.theme) {
            console.warn(`Warning: Theme '${options.theme}' not implemented. Using default theme.`);
        }
    }

    /**
     * Show help information
     */
    showHelp() {
        console.log(`
LaTeX to HTML Engine - Professional Document Converter

USAGE:
    node engine.js [command] [options] <files...>

COMMANDS:
    convert, c      Convert LaTeX files to HTML (default)
    validate, v    Validate LaTeX document structure
    preview, p     Preview document structure without conversion
    info, i        Show engine and renderer information
    batch, b       Convert multiple files
    help, h        Show this help message
    version        Show version information

OPTIONS:
    -o, --output <path>          Output file path (for single file)
    -d, --output-dir <path>      Output directory (for multiple files)
    -t, --theme <name>           Theme to use (not yet implemented)
    --minify                     Minify HTML output
    --no-validate                Skip document validation
    --preserve-comments          Preserve LaTeX comments
    -v, --verbose                Verbose output
    -q, --quiet                  Quiet mode
    --format <format>            Output format (html only for now)

EXAMPLES:
    # Convert single file
    node engine.js document.tex
    
    # Convert with custom output
    node engine.js -o output.html document.tex
    
    # Convert multiple files to directory
    node engine.js -d ./output/ *.tex
    
    # Validate document structure
    node engine.js validate document.tex
    
    # Preview document without conversion
    node engine.js preview document.tex
    
    # Show engine information
    node engine.js info
    
    # Batch convert with verbose output
    node engine.js convert -v --minify *.tex

SUPPORTED DOCUMENT CLASSES:
    article     Standard article format
    report      Technical reports with chapters
    book        Book format with parts and chapters
    IEEEtran    IEEE transaction papers
    memoir      Extended book format
    portfolio   Custom portfolio website format

For more information, see the documentation.
        `);
    }

    /**
     * Show version information
     */
    showVersion() {
        console.log(`LaTeX to HTML Engine v${this.version}`);
        console.log('Professional modular document converter');
    }
}

// Entry point
if (require.main === module) {
    const cli = new CLI();
    cli.run(process.argv).catch(error => {
        console.error('Fatal error:', error.message);
        process.exit(1);
    });
}

module.exports = CLI;