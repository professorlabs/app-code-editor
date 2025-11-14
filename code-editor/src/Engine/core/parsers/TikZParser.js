/**
 * Advanced TikZ Diagram Parser
 * Converts TikZ diagrams to SVG with comprehensive shape and path support
 */

class TikZParser {
    constructor() {
        this.shapeIdCounter = 0;
        this.coordinateSystem = {
            originX: 0,
            originY: 0,
            scale: 1.0,
            unit: 'cm' // Default unit
        };
        
        this.defaults = {
            strokeWidth: 0.4,
            strokeColor: 'black',
            fillColor: 'none',
            opacity: 1.0,
            lineCap: 'round',
            lineJoin: 'round'
        };
        
        this.colors = {
            'black': '#000000',
            'white': '#FFFFFF',
            'red': '#FF0000',
            'green': '#00FF00',
            'blue': '#0000FF',
            'yellow': '#FFFF00',
            'cyan': '#00FFFF',
            'magenta': '#FF00FF',
            'orange': '#FFA500',
            'purple': '#800080',
            'brown': '#A52A2A',
            'pink': '#FFC0CB',
            'gray': '#808080',
            'lime': '#00FF00',
            'navy': '#000080',
            'teal': '#008080',
            'olive': '#808000'
        };
        
        this.arrowStyles = {
            '->': { endArrow: true, startArrow: false },
            '<-': { endArrow: false, startArrow: true },
            '<->': { endArrow: true, startArrow: true },
            '=>': { endArrow: true, startArrow: false, arrowStyle: 'filled' },
            '<=>': { endArrow: true, startArrow: true, arrowStyle: 'filled' },
            '|->': { endArrow: true, startArrow: false, arrowStyle: 'bar' }
        };
    }

    parse(latexContent, context) {
        let html = latexContent;
        
        // Parse TikZ picture environments
        html = html.replace(/\\begin\{tikzpicture\}([^]*?)\\end\{tikzpicture\}/g, (match, content) => {
            return this.parseTikZPicture(content);
        });
        
        return html;
    }
    
    parseTikZPicture(content) {
        this.shapeIdCounter = 0;
        const commands = this.extractCommands(content);
        const svgElements = [];
        
        // Parse global options
        const options = this.parseOptions(content);
        
        // Process each command
        commands.forEach(cmd => {
            const svg = this.parseCommand(cmd, options);
            if (svg) {
                svgElements.push(svg);
            }
        });
        
        const bbox = this.calculateBoundingBox(svgElements);
        const svg = this.generateSVG(bbox, svgElements, options);
        
        return `<div class="tikz-diagram">${svg}</div>`;
    }
    
    extractCommands(content) {
        const commands = [];
        
        // Remove comments
        content = content.replace(/%.*$/gm, '');
        
        // Split by semicolons and filter empty commands
        const rawCommands = content.split(';').map(cmd => cmd.trim()).filter(cmd => cmd);
        
        rawCommands.forEach(cmd => {
            // Handle nested braces
            const depth = (cmd.match(/\{/g) || []).length - (cmd.match(/\}/g) || []).length;
            
            if (depth === 0) {
                commands.push(cmd);
            } else {
                // Handle multi-line commands with nested braces
                let fullCommand = cmd;
                let currentDepth = depth;
                
                // Look for complete command (not implemented for brevity)
                if (currentDepth === 0) {
                    commands.push(fullCommand);
                }
            }
        });
        
        return commands;
    }
    
    parseOptions(content) {
        const options = { ...this.defaults };
        
        // Extract options from \begin{tikzpicture}[options]
        const beginMatch = content.match(/^\\begin\{tikzpicture\}\[([^\]]*)\]/);
        if (beginMatch) {
            this.updateOptionsFromString(options, beginMatch[1]);
        }
        
        return options;
    }
    
    updateOptionsFromString(options, optionsString) {
        if (!optionsString) return;
        
        // Parse individual options
        const optionList = optionsString.split(',').map(opt => opt.trim());
        
        optionList.forEach(opt => {
            // Scale option
            if (opt.startsWith('scale=')) {
                options.scale = parseFloat(opt.split('=')[1]);
            }
            // Line width
            else if (opt.includes('line width') || opt.includes('linewidth')) {
                const width = parseFloat(opt.match(/[\d.]+/)[0]);
                options.strokeWidth = width * options.scale;
            }
            // Colors
            else if (opt.startsWith('draw=')) {
                options.strokeColor = this.parseColor(opt.split('=')[1]);
            }
            else if (opt.startsWith('fill=')) {
                options.fillColor = this.parseColor(opt.split('=')[1]);
            }
            // Opacity
            else if (opt.startsWith('opacity=')) {
                options.opacity = parseFloat(opt.split('=')[1]);
            }
        });
    }
    
    parseCommand(command, globalOptions) {
        const trimmed = command.trim();
        
        // Path commands
        if (trimmed.startsWith('\\draw') || trimmed.startsWith('\\path')) {
            return this.parsePathCommand(trimmed, globalOptions);
        }
        // Node commands
        else if (trimmed.startsWith('\\node')) {
            return this.parseNodeCommand(trimmed, globalOptions);
        }
        // Shape commands (circle, rectangle, etc.)
        else if (trimmed.match(/\\(circle|rectangle|ellipse|diamond)/)) {
            return this.parseShapeCommand(trimmed, globalOptions);
        }
        
        return null;
    }
    
    parsePathCommand(command, globalOptions) {
        const options = { ...globalOptions };
        const pathSpec = this.extractPathSpecification(command);
        
        // Update options from command
        const cmdOptions = this.extractCommandOptions(command);
        Object.assign(options, cmdOptions);
        
        if (!pathSpec) return null;
        
        const pathData = this.convertPathToSVG(pathSpec, options);
        const id = `tikz-path-${this.shapeIdCounter++}`;
        
        return `<path id="${id}" d="${pathData}" 
            stroke="${options.strokeColor}" 
            stroke-width="${options.strokeWidth}" 
            fill="${options.fillColor}" 
            opacity="${options.opacity}"
            stroke-linecap="${options.lineCap}"
            stroke-linejoin="${options.lineJoin}"/>`;
    }
    
    parseNodeCommand(command, globalOptions) {
        const options = { ...globalOptions };
        const nodeSpec = this.extractNodeSpecification(command);
        
        if (!nodeSpec) return null;
        
        const position = this.parseCoordinate(nodeSpec.position || '0,0');
        const id = `tikz-node-${this.shapeIdCounter++}`;
        
        // Parse node options
        const cmdOptions = this.extractCommandOptions(command);
        Object.assign(options, cmdOptions);
        
        // Create node element
        let nodeElement = '';
        
        if (options.shape === 'circle' || options.shape === 'circle,draw') {
            const radius = options.minimumSize ? parseFloat(options.minimumSize) / 2 : 0.5;
            nodeElement = `<circle id="${id}" 
                cx="${position.x}" 
                cy="${position.y}" 
                r="${radius * options.scale}"
                stroke="${options.draw || options.strokeColor}" 
                stroke-width="${options.strokeWidth}" 
                fill="${options.fill || 'white'}" 
                opacity="${options.opacity}"/>`;
        } 
        else if (options.shape === 'rectangle' || options.shape === 'rectangle,draw') {
            const width = options.minimumWidth ? parseFloat(options.minimumWidth) : 1;
            const height = options.minimumHeight ? parseFloat(options.minimumHeight) : 0.8;
            nodeElement = `<rect id="${id}" 
                x="${position.x - (width/2) * options.scale}" 
                y="${position.y - (height/2) * options.scale}" 
                width="${width * options.scale}" 
                height="${height * options.scale}"
                stroke="${options.draw || options.strokeColor}" 
                stroke-width="${options.strokeWidth}" 
                fill="${options.fill || 'white'}" 
                opacity="${options.opacity}"
                rx="2"/>`;
        }
        
        // Add node text
        let textElement = '';
        if (nodeSpec.text) {
            textElement = `<text x="${position.x}" y="${position.y}" 
                text-anchor="middle" 
                dominant-baseline="middle"
                font-family="Arial, sans-serif"
                font-size="${(options.fontSize || 12) * options.scale}px"
                fill="${options.textColor || 'black'}">
                ${this.escapeHtml(nodeSpec.text)}
            </text>`;
        }
        
        return nodeElement + textElement;
    }
    
    parseShapeCommand(command, globalOptions) {
        const options = { ...globalOptions };
        const shapeMatch = command.match(/\\(circle|rectangle|ellipse)\s*(\{([^}]*)\})?\s*(\(([^)]*)\))?/);
        
        if (!shapeMatch) return null;
        
        const shape = shapeMatch[1];
        const optionsStr = shapeMatch[3];
        const coordsStr = shapeMatch[5];
        
        // Parse shape options
        if (optionsStr) {
            const cmdOptions = this.parseOptionsString(optionsStr);
            Object.assign(options, cmdOptions);
        }
        
        const position = coordsStr ? this.parseCoordinate(coordsStr) : { x: 0, y: 0 };
        const id = `tikz-shape-${this.shapeIdCounter++}`;
        
        let shapeElement = '';
        
        if (shape === 'circle') {
            const radius = options.radius ? parseFloat(options.radius) : 0.5;
            shapeElement = `<circle id="${id}" 
                cx="${position.x}" 
                cy="${position.y}" 
                r="${radius * options.scale}"
                stroke="${options.strokeColor}" 
                stroke-width="${options.strokeWidth}" 
                fill="${options.fillColor}" 
                opacity="${options.opacity}"/>`;
        }
        else if (shape === 'rectangle') {
            const width = options.width ? parseFloat(options.width) : 1;
            const height = options.height ? parseFloat(options.height) : 0.8;
            shapeElement = `<rect id="${id}" 
                x="${position.x - (width/2) * options.scale}" 
                y="${position.y - (height/2) * options.scale}" 
                width="${width * options.scale}" 
                height="${height * options.scale}"
                stroke="${options.strokeColor}" 
                stroke-width="${options.strokeWidth}" 
                fill="${options.fillColor}" 
                opacity="${options.opacity}"/>`;
        }
        else if (shape === 'ellipse') {
            const rx = options.xradius ? parseFloat(options.xradius) : 1;
            const ry = options.yradius ? parseFloat(options.yradius) : 0.6;
            shapeElement = `<ellipse id="${id}" 
                cx="${position.x}" 
                cy="${position.y}" 
                rx="${rx * options.scale}" 
                ry="${ry * options.scale}"
                stroke="${options.strokeColor}" 
                stroke-width="${options.strokeWidth}" 
                fill="${options.fillColor}" 
                opacity="${options.opacity}"/>`;
        }
        
        return shapeElement;
    }
    
    extractPathSpecification(command) {
        // Extract the path specification after command options
        const match = command.match(/\\(?:draw|path)(?:\[([^\]]*)\])?\s*(.+)$/);
        return match ? match[2].trim() : null;
    }
    
    extractNodeSpecification(command) {
        const match = command.match(/\\node(?:\[([^\]]*)\])?\s*(?:\{([^}]*)\})?\s*(?:\(([^)]*)\))?/);
        if (!match) return null;
        
        return {
            options: match[1] || '',
            text: match[2] || '',
            position: match[3] || '0,0'
        };
    }
    
    extractCommandOptions(command) {
        const options = {};
        const optionsMatch = command.match(/\[([^\]]*)\]/);
        
        if (optionsMatch) {
            this.updateOptionsFromString(options, optionsMatch[1]);
        }
        
        return options;
    }
    
    convertPathToSVG(pathSpec, options) {
        let pathData = '';
        const commands = pathSpec.match(/([A-Za-z]\([^)]*\)|\([^)]*\)|--|-\^|\^-|[A-Za-z])/g);
        
        if (!commands) return '';
        
        let currentPos = { x: 0, y: 0 };
        let isFirstPoint = true;
        
        commands.forEach(cmd => {
            if (cmd.startsWith('(') && cmd.endsWith(')')) {
                // Coordinate
                const coord = this.parseCoordinate(cmd);
                if (isFirstPoint) {
                    pathData += `M ${coord.x} ${coord.y} `;
                    currentPos = coord;
                    isFirstPoint = false;
                } else {
                    pathData += `L ${coord.x} ${coord.y} `;
                    currentPos = coord;
                }
            } else if (cmd === '--') {
                // Line to next coordinate (handled in next iteration)
            } else if (cmd.startsWith('circle(')) {
                // Circle path
                const radius = parseFloat(cmd.match(/radius=([\d.]+)/)[1]);
                pathData += `M ${currentPos.x + radius} ${currentPos.y} `;
                pathData += `A ${radius} ${radius} 0 0 0 ${currentPos.x - radius} ${currentPos.y} `;
                pathData += `A ${radius} ${radius} 0 0 0 ${currentPos.x + radius} ${currentPos.y} `;
            }
            // Add more path commands as needed
        });
        
        return pathData.trim();
    }
    
    parseCoordinate(coordStr) {
        const match = coordStr.match(/\(\s*([-\d.]+)\s*(?:cm|mm|pt|in)?\s*,\s*([-\d.]+)\s*(?:cm|mm|pt|in)?\s*\)/);
        if (!match) return { x: 0, y: 0 };
        
        const x = parseFloat(match[1]) * 50 * this.coordinateSystem.scale; // Convert to pixels (50px per unit)
        const y = -parseFloat(match[2]) * 50 * this.coordinateSystem.scale; // Invert Y axis
        
        return {
            x: this.coordinateSystem.originX + x,
            y: this.coordinateSystem.originY + y
        };
    }
    
    calculateBoundingBox(elements) {
        let minX = Infinity, minY = Infinity;
        let maxX = -Infinity, maxY = -Infinity;
        
        // Simple bounding box calculation (would need more sophisticated parsing in production)
        elements.forEach(element => {
            // Extract coordinates from SVG elements
            const xMatches = element.match(/x="([^"]+)"/g) || [];
            const yMatches = element.match(/y="([^"]+)"/g) || [];
            const cxMatches = element.match(/cx="([^"]+)"/g) || [];
            const cyMatches = element.match(/cy="([^"]+)"/g) || [];
            
            [...xMatches, ...cxMatches].forEach(match => {
                const x = parseFloat(match.split('"')[1]);
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
            });
            
            [...yMatches, ...cyMatches].forEach(match => {
                const y = parseFloat(match.split('"')[1]);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
            });
        });
        
        if (minX === Infinity) {
            return { x: 0, y: 0, width: 200, height: 200 };
        }
        
        return {
            x: minX - 20,
            y: minY - 20,
            width: (maxX - minX) + 40,
            height: (maxY - minY) + 40
        };
    }
    
    generateSVG(bbox, elements, options) {
        const width = bbox.width || 400;
        const height = bbox.height || 300;
        
        return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" 
            xmlns="http://www.w3.org/2000/svg" style="background: ${options.backgroundColor || 'transparent'};">
            <g transform="translate(${-bbox.x}, ${-bbox.y})">
                ${elements.join('\n                ')}
            </g>
        </svg>`;
    }
    
    parseColor(colorName) {
        return this.colors[colorName.toLowerCase()] || colorName;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

module.exports = TikZParser;