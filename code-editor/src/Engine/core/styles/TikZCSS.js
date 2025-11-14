/**
 * TikZ Diagram CSS
 * Comprehensive styling for TikZ diagrams and vector graphics
 */

const TikZCSS = `
/* ===== TIKZ DIAGRAMS ===== */

.tikz-diagram {
    display: inline-block;
    text-align: center;
    margin: 1em auto;
    padding: 1em;
    background: linear-gradient(145deg, #fafafa, #f0f0f0);
    border: 1px solid #ddd;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
    transition: all 0.3s ease;
}

.tikz-diagram:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    border-color: #3498db;
}

/* TikZ SVG container */
.tikz-diagram svg {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* TikZ nodes and shapes */
.tikz-node {
    cursor: pointer;
    transition: all 0.2s ease;
}

.tikz-node:hover {
    filter: brightness(1.1);
    transform: scale(1.05);
}

/* TikZ paths and lines */
.tikz-path {
    stroke-linecap: round;
    stroke-linejoin: round;
    fill: none;
}

.tikz-arrow {
    marker-end: url(#arrowhead);
    marker-start: url(#arrowhead-start);
}

/* Node styles */
.node-circle {
    fill: #3498db;
    stroke: #2980b9;
    stroke-width: 2;
}

.node-circle:hover {
    fill: #2980b9;
    stroke: #21618c;
}

.node-rectangle {
    fill: #e74c3c;
    stroke: #c0392b;
    stroke-width: 2;
    rx: 4;
}

.node-rectangle:hover {
    fill: #c0392b;
    stroke: #a93226;
}

.node-diamond {
    fill: #2ecc71;
    stroke: #27ae60;
    stroke-width: 2;
    transform: rotate(45deg);
}

.node-diamond:hover {
    fill: #27ae60;
    stroke: #229954;
}

.node-ellipse {
    fill: #f39c12;
    stroke: #e67e22;
    stroke-width: 2;
}

.node-ellipse:hover {
    fill: #e67e22;
    stroke: #d35400;
}

/* Node text labels */
.node-text {
    font-family: 'Arial', sans-serif;
    font-size: 14px;
    fill: #2c3e50;
    text-anchor: middle;
    dominant-baseline: middle;
    pointer-events: none;
    font-weight: 500;
}

/* ===== TIKZ ANIMATIONS ===== */
@keyframes tikzNodePulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
}

.tikz-node.animate-pulse {
    animation: tikzNodePulse 2s ease-in-out infinite;
}

@keyframes tikzPathDraw {
    from { stroke-dashoffset: 1000; }
    to { stroke-dashoffset: 0; }
}

.tikz-path.animate-draw {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: tikzPathDraw 3s ease-in-out forwards;
}

/* ===== TIKZ THEMES ===== */

/* Default theme */
.tikz-theme-default {
    --tikz-primary: #3498db;
    --tikz-secondary: #2c3e50;
    --tikz-accent: #e74c3c;
    --tikz-success: #2ecc71;
    --tikz-warning: #f39c12;
    --tikz-info: #9b59b6;
    --tikz-light: #ecf0f1;
    --tikz-dark: #34495e;
}

/* Dark theme */
.tikz-theme-dark {
    --tikz-primary: #4299e1;
    --tikz-secondary: #e2e8f0;
    --tikz-accent: #fc8181;
    --tikz-success: #68d391;
    --tikz-warning: #f6ad55;
    --tikz-info: #b794f4;
    --tikz-light: #2d3748;
    --tikz-dark: #1a202c;
}

.tikz-theme-dark .tikz-diagram {
    background: linear-gradient(145deg, #2d3748, #1a202c);
    border-color: #4a5568;
    color: #e2e8f0;
}

/* Scientific theme */
.tikz-theme-scientific {
    --tikz-primary: #2563eb;
    --tikz-secondary: #1e293b;
    --tikz-accent: #dc2626;
    --tikz-success: #16a34a;
    --tikz-warning: #ea580c;
    --tikz-info: #7c3aed;
    --tikz-light: #f8fafc;
    --tikz-dark: #0f172a;
}

.tikz-theme-scientific .tikz-diagram {
    background: linear-gradient(145deg, #f8fafc, #f1f5f9);
    border-color: #cbd5e1;
    font-family: 'Times New Roman', serif;
}

/* Colorful theme */
.tikz-theme-colorful {
    --tikz-primary: #06b6d4;
    --tikz-secondary: #8b5cf6;
    --tikz-accent: #f43f5e;
    --tikz-success: #10b981;
    --tikz-warning: #f59e0b;
    --tikz-info: #3b82f6;
    --tikz-light: #fef3c7;
    --tikz-dark: #1f2937;
}

.tikz-theme-colorful .tikz-diagram {
    background: linear-gradient(145deg, #fef3c7, #fde68a);
    border-color: #fbbf24;
}

/* ===== TIKZ GRID AND COORDINATES ===== */
.tikz-grid {
    stroke: #e0e0e0;
    stroke-width: 0.5;
    stroke-dasharray: 2,2;
    opacity: 0.5;
}

.tikz-grid-major {
    stroke: #b0b0b0;
    stroke-width: 1;
    opacity: 0.7;
}

.tikz-axis {
    stroke: #333;
    stroke-width: 2;
    stroke-linecap: square;
}

.tikz-axis-arrow {
    marker-end: url(#axis-arrow);
}

.tikz-coordinate-label {
    font-family: 'Arial', sans-serif;
    font-size: 12px;
    fill: #666;
    text-anchor: middle;
}

/* ===== TIKZ ARROWS AND MARKERS ===== */
.tikz-markers {
    display: none;
}

.tikz-arrow-thick {
    stroke-width: 2;
    marker-end: url(#arrowhead-thick);
}

.tikz-arrow-thin {
    stroke-width: 1;
    marker-end: url(#arrowhead-thin);
}

.tikz-arrow-double {
    marker-end: url(#arrowhead-double);
    marker-start: url(#arrowhead-double);
}

.tikz-arrow-stealth {
    marker-end: url(#arrowhead-stealth);
}

/* ===== TIKZ FILL PATTERNS ===== */
.tikz-fill-stripes {
    fill: url(#stripes);
}

.tikz-fill-dots {
    fill: url(#dots);
}

.tikz-fill-crosshatch {
    fill: url(#crosshatch);
}

.tikz-fill-gradient {
    fill: url(#gradient);
}

/* ===== TIKZ SHADOWS ===== */
.tikz-shadow {
    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.2));
}

.tikz-shadow-large {
    filter: drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.3));
}

.tikz-shadow-soft {
    filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.1));
}

/* ===== TIKZ LAYERING ===== */
.tikz-layer-background {
    z-index: 1;
}

.tikz-layer-main {
    z-index: 2;
}

.tikz-layer-foreground {
    z-index: 3;
}

.tikz-layer-annotations {
    z-index: 4;
}

/* ===== TIKZ INTERACTIVE ELEMENTS ===== */
.tikz-interactive {
    cursor: pointer;
    transition: all 0.2s ease;
}

.tikz-interactive:hover {
    filter: brightness(1.2);
    transform: scale(1.05);
}

.tikz-tooltip {
    position: absolute;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.5em;
    border-radius: 4px;
    font-size: 12px;
    pointer-events: none;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.tikz-tooltip.show {
    opacity: 1;
}

/* ===== TIKZ RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
    .tikz-diagram {
        padding: 0.8em;
        margin: 0.8em auto;
    }
    
    .node-text {
        font-size: 12px;
    }
    
    .tikz-coordinate-label {
        font-size: 10px;
    }
}

@media (max-width: 480px) {
    .tikz-diagram {
        padding: 0.6em;
        margin: 0.6em auto;
    }
    
    .node-text {
        font-size: 11px;
    }
    
    .tikz-grid {
        stroke-width: 0.3;
    }
    
    .tikz-axis {
        stroke-width: 1.5;
    }
}

/* ===== TIKZ PRINT STYLES ===== */
@media print {
    .tikz-diagram {
        background: white;
        border: 1px solid #000;
        box-shadow: none;
        page-break-inside: avoid;
    }
    
    .tikz-shadow,
    .tikz-shadow-large,
    .tikz-shadow-soft {
        filter: none;
    }
    
    .tikz-tooltip {
        display: none;
    }
}

/* ===== TIKZ ACCESSIBILITY ===== */
@media (prefers-reduced-motion: reduce) {
    .tikz-diagram,
    .tikz-node,
    .tikz-interactive {
        transition: none;
        transform: none;
    }
    
    .tikz-node.animate-pulse,
    .tikz-path.animate-draw {
        animation: none;
    }
}

.tikz-diagram:focus-within {
    outline: 2px solid #007bff;
    outline-offset: 2px;
}

.tikz-interactive:focus {
    outline: 2px solid #007bff;
    outline-offset: 2px;
}

/* ===== TIKZ DARK MODE ===== */
@media (prefers-color-scheme: dark) {
    .tikz-diagram {
        background: linear-gradient(145deg, #1a202c, #2d3748);
        border-color: #4a5568;
    }
    
    .tikz-diagram svg {
        background: #2d3748;
    }
    
    .tikz-grid {
        stroke: #4a5568;
        opacity: 0.3;
    }
    
    .tikz-grid-major {
        stroke: #718096;
        opacity: 0.5;
    }
    
    .tikz-axis {
        stroke: #e2e8f0;
    }
    
    .node-text,
    .tikz-coordinate-label {
        fill: #e2e8f0;
    }
    
    .node-circle {
        fill: #4299e1;
        stroke: #3182ce;
    }
    
    .node-rectangle {
        fill: #fc8181;
        stroke: #f56565;
    }
    
    .node-diamond {
        fill: #68d391;
        stroke: #48bb78;
    }
    
    .node-ellipse {
        fill: #f6ad55;
        stroke: #ed8936;
    }
}

/* ===== TIKZ ANIMATION KEYFRAMES ===== */
@keyframes tikzFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.tikz-float {
    animation: tikzFloat 3s ease-in-out infinite;
}

@keyframes tikzRotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.tikz-rotate {
    animation: tikzRotate 10s linear infinite;
}

@keyframes tikzBlink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
}

.tikz-blink {
    animation: tikzBlink 2s ease-in-out infinite;
}

/* ===== TIKZ SPECIAL EFFECTS ===== */
.tikz-glow {
    filter: drop-shadow(0 0 8px rgba(52, 152, 219, 0.8));
}

.tikz-neon {
    filter: drop-shadow(0 0 10px currentColor) drop-shadow(0 0 20px currentColor);
}

.tikz-sketch {
    filter: contrast(1.2) brightness(1.1);
    stroke-linecap: round;
    stroke-linejoin: round;
}

.tikz-handdrawn {
    transform: rotate(-0.5deg);
    filter: contrast(1.1);
}

/* ===== TIKZ ZOOM AND PAN ===== */
.tikz-zoom-container {
    position: relative;
    overflow: hidden;
    cursor: grab;
}

.tikz-zoom-container:active {
    cursor: grabbing;
}

.tikz-zoom-content {
    transform-origin: center center;
    transition: transform 0.3s ease;
}

.tikz-zoom-controls {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 5px;
    z-index: 10;
}

.tikz-zoom-btn {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s ease;
}

.tikz-zoom-btn:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.05);
}

/* ===== TIKZ EXPORT QUALITY ===== */
.tikz-export-high {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
}

.tikz-export-vector {
    shape-rendering: geometricPrecision;
    text-rendering: geometricPrecision;
}

.tikz-export-print {
    color-rendering: optimizeQuality;
    image-rendering: optimizeQuality;
}
`;

module.exports = TikZCSS;