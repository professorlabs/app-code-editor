#!/usr/bin/env node

/**
 * LaTeX to HTML Engine - Ultra Lightweight Node.js Version
 * Converts LaTeX syntax to modern HTML with CSS and JS
 * Zero dependencies, maximum performance
 */

const fs = require('fs');
const path = require('path');

// Import advanced CSS modules
const MathCSS = require('./Engine/core/styles/MathCSS.js');
const TikZCSS = require('./Engine/core/styles/TikZCSS.js');

class LatexToHtmlEngine {
    constructor() {
        this.css = `
/* ===== BASE LAYOUT ===== */
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Georgia',serif;line-height:1.6;color:#333;max-width:1200px;margin:0 auto;padding:20px;background:linear-gradient(135deg,#f5f7fa 0%,#c3cfe2 100%)}
.title{text-align:center;font-size:2.5em;margin-bottom:10px;color:#2c3e50;text-shadow:2px 2px 4px rgba(0,0,0,0.1)}
.author{text-align:center;font-size:1.2em;color:#7f8c8d;margin-bottom:30px}
.date{text-align:center;color:#95a5a6;margin-bottom:40px}
nav{background:white;padding:15px;border-radius:10px;box-shadow:0 4px 6px rgba(0,0,0,0.1);margin-bottom:30px}
nav ul{list-style:none;display:flex;justify-content:center;flex-wrap:wrap}
nav li{margin:0 15px;padding:8px 15px;background:#3498db;color:white;border-radius:5px;transition:all 0.3s ease;font-weight:bold}
nav li:hover{background:#2980b9;transform:translateY(-2px)}
nav a{color:white;text-decoration:none}
h1{font-size:2em;margin:30px 0 20px 0;color:#2c3e50;border-bottom:3px solid #3498db;padding-bottom:10px}
h2{font-size:1.5em;margin:25px 0 15px 0;color:#34495e}
.box{background:white;border:2px solid #3498db;border-radius:10px;padding:20px;margin:20px 0;box-shadow:0 4px 6px rgba(0,0,0,0.1);position:relative}
.box-title{position:absolute;top:-12px;left:20px;background:white;padding:0 10px;color:#3498db;font-weight:bold}
.center{text-align:center;margin:20px 0}
img{max-width:100%;height:auto;border-radius:10px;box-shadow:0 4px 8px rgba(0,0,0,0.2)}
ul{margin:15px 0 15px 30px}
li{margin:8px 0;color:#2c3e50}
.textbf{font-weight:bold;color:#2c3e50}
.textit{font-style:italic;color:#7f8c8d}
p{margin:15px 0;text-align:justify}

/* ===== CODE BOXES (ENHANCED) ===== */
.code-box{background:#1e1e1e;border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.3);margin:30px 0;overflow:hidden;border:1px solid #333}
.code-tabs{display:flex;background:#2d2d30;padding:0;position:relative}
.code-tab{padding:12px 20px;background:transparent;color:#969696;border:none;cursor:pointer;font-family:'SF Mono','Monaco','Inconsolata','Fira Code',monospace;font-size:14px;transition:all 0.3s ease;position:relative}
.code-tab:hover{color:#fff;background:#383838}
.code-tab.active{color:#fff;background:#1e1e1e}
.code-tab.active::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:#007acc}
.code-content{padding:20px;font-family:'SF Mono','Monaco','Inconsolata','Fira Code',monospace;font-size:14px;line-height:1.5;overflow-x:auto;position:relative;min-height:200px}
.code-pane{display:none;white-space:pre-wrap;word-wrap:break-word}
.code-pane.active{display:block}
.code-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px}
.code-title{color:#569cd6;font-weight:bold;font-size:16px}
.copy-btn{background:#007acc;color:white;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;font-size:12px;font-family:inherit;transition:all 0.3s ease;display:flex;align-items:center;gap:6px}
.copy-btn:hover{background:#005a9e;transform:translateY(-1px)}
.copy-btn.success{background:#4caf50}
.copy-icon{transition:all 0.3s ease}
.copy-btn.success .copy-icon{transform:scale(1.2)}
.syntax-keyword{color:#569cd6;font-weight:bold}
.syntax-string{color:#ce9178}
.syntax-number{color:#b5cea8}
.syntax-comment{color:#6a9955;font-style:italic}
.syntax-function{color:#dcdcaa}
.syntax-variable{color:#9cdcfe}
.syntax-operator{color:#d4d4d4}
.syntax-type{color:#4ec9b0}
.code-box.white-bg{background:#fff;border:1px solid #e1e4e8}
.code-box.white-bg .code-tabs{background:#f6f8fa}
.code-box.white-bg .code-tab{color:#586069}
.code-box.white-bg .code-tab:hover{color:#24292e;background:#e1e4e8}
.code-box.white-bg .code-tab.active{color:#24292e;background:#fff}
.code-box.white-bg .code-content{background:#fff;color:#24292e}
.code-box.white-bg .copy-btn{background:#0366d6}
.code-box.white-bg .copy-btn:hover{background:#0256cc}

/* ===== ENHANCED MATHEMATICAL TYPESETTING ===== */
${MathCSS}

/* ===== TIKZ DIAGRAMS ===== */
${TikZCSS}

/* ===== RESPONSIVE DESIGN ===== */
@media(max-width:768px){body{padding:10px}.title{font-size:2em}nav ul{flex-direction:column;align-items:center}nav li{margin:5px 0}.code-tab{padding:10px 15px;font-size:12px}.code-content{padding:15px;font-size:12px}}
`;
        
        this.js = `
document.addEventListener('DOMContentLoaded',function(){
    document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
        anchor.addEventListener('click',function(e){
            e.preventDefault();
            const target=document.querySelector(this.getAttribute('href'));
            if(target)target.scrollIntoView({behavior:'smooth'})
        })
    });
    const observer=new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                entry.target.style.opacity='0';
                entry.target.style.transform='translateY(20px)';
                setTimeout(()=>{
                    entry.target.style.transition='all 0.6s ease';
                    entry.target.style.opacity='1';
                    entry.target.style.transform='translateY(0)'
                },100)
            }
        })
    });
    document.querySelectorAll('h1,.box,.center,.code-box,.math-display,.figure,.table,.tikz-diagram').forEach(section=>observer.observe(section));
    
    // Code box tab switching
    document.querySelectorAll('.code-tab').forEach(tab=>{
        tab.addEventListener('click',function(){
            const codeBox=this.closest('.code-box');
            const targetId=this.getAttribute('data-tab');
            
            codeBox.querySelectorAll('.code-tab').forEach(t=>t.classList.remove('active'));
            codeBox.querySelectorAll('.code-pane').forEach(p=>p.classList.remove('active'));
            
            this.classList.add('active');
            codeBox.querySelector(\`#\${targetId}\`).classList.add('active');
        })
    });
    
    // Copy functionality with animation
    document.querySelectorAll('.copy-btn').forEach(btn=>{
        btn.addEventListener('click',async function(){
            const codeBox=this.closest('.code-box');
            const activePane=codeBox.querySelector('.code-pane.active');
            const codeText=activePane.textContent;
            
            try{
                await navigator.clipboard.writeText(codeText);
                const icon=this.querySelector('.copy-icon');
                const originalHTML=icon.innerHTML;
                
                icon.innerHTML='✓';
                this.classList.add('success');
                
                setTimeout(()=>{
                    icon.innerHTML=originalHTML;
                    this.classList.remove('success');
                },2000);
            }catch(err){
                console.error('Failed to copy:',err);
            }
        })
    });
    
    // Math equation highlighting
    document.querySelectorAll('.math-equation, .math-align, .math-gather').forEach(eq => {
        eq.addEventListener('mouseenter', function() {
            this.style.background = '#e3f2fd';
            this.style.borderRadius = '8px';
            this.style.padding = '8px';
            this.style.transition = 'all 0.2s ease';
        });
        
        eq.addEventListener('mouseleave', function() {
            this.style.background = '';
            this.style.padding = '';
        });
    });
    
    // TikZ diagram interactions
    document.querySelectorAll('.tikz-diagram').forEach(diagram => {
        diagram.addEventListener('click', function() {
            this.style.transform = 'scale(1.02)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
    
    // Figure and table hover effects
    document.querySelectorAll('.figure, .table').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
            this.style.transition = 'all 0.3s ease';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
});
`;
        
        this.syntaxHighlighters = {
            python: (code) => {
                const keywords = /\b(def|class|if|else|elif|for|while|import|from|as|return|try|except|with|lambda|yield|async|await|global|nonlocal|pass|break|continue|in|is|and|or|not|True|False|None)\b/g;
                const strings = /(["'])((?:\\.|(?!\1)[^\\\r\n])*?)\1/g;
                const comments = /(#.*$)/gm;
                const numbers = /\b\d+\.?\d*\b/g;
                const functions = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g;
                
                return code
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(comments, '<span class="syntax-comment">$1</span>')
                    .replace(strings, '<span class="syntax-string">$1$2$1</span>')
                    .replace(numbers, '<span class="syntax-number">$&</span>')
                    .replace(keywords, '<span class="syntax-keyword">$1</span>')
                    .replace(functions, '<span class="syntax-function">$1</span>');
            },
            
            javascript: (code) => {
                const keywords = /\b(const|let|var|function|if|else|for|while|do|switch|case|default|break|continue|return|try|catch|finally|throw|new|this|typeof|instanceof|in|of|class|extends|import|export|from|as|async|await|yield|debugger|with|delete|void)\b/g;
                const strings = /(["'`])((?:\\.|(?!\1)[^\\\r\n])*?)\1/g;
                const comments = /\/\/.*$|\/\*[\s\S]*?\*\//gm;
                const numbers = /\b\d+\.?\d*\b/g;
                const functions = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g;
                
                return code
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(comments, '<span class="syntax-comment">$&</span>')
                    .replace(strings, '<span class="syntax-string">$1$2$1</span>')
                    .replace(numbers, '<span class="syntax-number">$&</span>')
                    .replace(keywords, '<span class="syntax-keyword">$1</span>')
                    .replace(functions, '<span class="syntax-function">$1</span>');
            },
            
            default: (code) => {
                return code
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
            }
        };
    }

    parseLatex(latex) {
        let html = latex;
        
        // Remove document class and packages
        html = html.replace(/\\documentclass\{[^}]*\}/g, '');
        html = html.replace(/\\usepackage\{[^}]*\}/g, '');
        
        // Extract metadata
        const title = (html.match(/\\title\{([^}]*)\}/) || ['', 'Untitled Document'])[1];
        const author = (html.match(/\\author\{([^}]*)\}/) || ['', 'Anonymous'])[1];
        const date = (html.match(/\\date\{([^}]*)\}/) || ['', 'Unknown Date'])[1];
        
        // Convert sections
        html = html.replace(/\\section\{([^}]*)\}/g, '<h1 id="$1">$1</h1>');
        html = html.replace(/\\subsection\{([^}]*)\}/g, '<h2 id="$1">$1</h2>');
        html = html.replace(/\\subsubsection\{([^}]*)\}/g, '<h3 id="$1">$3</h3>');
        
        // Convert navigation
        html = html.replace(/\\begin\{nav\}([\s\S]*?)\\end\{nav\}/g, (match, content) => {
            const items = content.match(/\\item\[([^\]]*)\]([^\n]*?)(?=\\item\[|\\end\{nav\})/g) || [];
            const navHtml = '<nav><ul>' + items.map(item => {
                const match = item.match(/\\item\[([^\]]*)\]([^\n]*)/);
                return `<li>${match[2].trim()}</li>`;
            }).join('') + '</ul></nav>';
            return navHtml;
        });
        
        // Convert boxes
        html = html.replace(/\\begin\{box\}([\s\S]*?)\\end\{box\}/g, (match, content) => {
            const titleMatch = content.match(/\[title=([^\]]*)\]/);
            const boxTitle = titleMatch ? titleMatch[1] : 'Box';
            const boxContent = content.replace(/\[title=[^\]]*\]/, '');
            return `<div class="box"><div class="box-title">${boxTitle}</div>${boxContent}</div>`;
        });
        
        // Convert lists
        html = html.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (match, content) => {
            const items = content.match(/\\item\s*([^\n]*?)(?=\\item|\\end\{itemize\})/g) || [];
            const listHtml = '<ul>' + items.map(item => 
                `<li>${item.replace(/\\item\s*/, '').trim()}</li>`
            ).join('') + '</ul>';
            return listHtml;
        });
        
        html = html.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, (match, content) => {
            const items = content.match(/\\item\s*([^\n]*?)(?=\\item|\\end\{enumerate\})/g) || [];
            const listHtml = '<ol>' + items.map(item => 
                `<li>${item.replace(/\\item\s*/, '').trim()}</li>`
            ).join('') + '</ol>';
            return listHtml;
        });
        
        // Convert text formatting
        html = html.replace(/\\textbf\{([^}]*)\}/g, '<span class="textbf">$1</span>');
        html = html.replace(/\\textit\{([^}]*)\}/g, '<span class="textit">$1</span>');
        html = html.replace(/\\texttt\{([^}]*)\}/g, '<code>$1</code>');
        html = html.replace(/\\emph\{([^}]*)\}/g, '<em>$1</em>');
        html = html.replace(/\\underline\{([^}]*)\}/g, '<u>$1</u>');
        
        // Convert code blocks
        html = html.replace(/\\begin\{code\}([\s\S]*?)\\end\{code\}/g, (match, content) => {
            return this.parseCodeBlock(content);
        });
        
        // Convert center environment
        html = html.replace(/\\begin\{center\}([\s\S]*?)\\end\{center\}/g, (match, content) => {
            const imgMatch = content.match(/\\includegraphics\[([^\]]*)\]\{([^}]*)\}/);
            if (imgMatch) {
                return `<div class="center"><img src="${imgMatch[2]}" alt="Image"></div>`;
            }
            return `<div class="center">${content}</div>`;
        });
        
        // Convert verbatim environment
        html = html.replace(/\\begin\{verbatim\}([\s\S]*?)\\end\{verbatim\}/g, (match, content) => {
            return `<pre class="verbatim"><code>${content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
        });
        
        // Clean up remaining LaTeX commands
        html = html.replace(/\\maketitle/g, '');
        html = html.replace(/\\tableofcontents/g, '');
        html = html.replace(/\\listoffigures/g, '');
        html = html.replace(/\\listoftables/g, '');
        html = html.replace(/\\newpage/g, '<hr style="page-break-before: always;">');
        html = html.replace(/\\clearpage/g, '<div style="clear: both;"></div>');
        html = html.replace(/\\begin\{document\}/g, '');
        html = html.replace(/\\end\{document\}/g, '');
        
        // Convert paragraphs
        html = html.replace(/\n\n+/g, '</p><p>');
        html = `<p>${html}</p>`;
        
        // Clean up extra tags
        html = html.replace(/<p>\s*<\/p>/g, '');
        html = html.replace(/<p>(<h1>|<h2>|<h3>|<nav>|<div|<pre|<ul|<ol)/g, '$1');
        html = html.replace(/(<\/h1>|<\/h2>|<\/h3>|<\/nav>|<\/div>|<\/pre>|<\/ul>|<\/ol>)<\/p>/g, '$1');
        
        return { title, author, date, content: html };
    }

    parseCodeBlock(content) {
        const lines = content.trim().split('\n');
        
        // Simple parsing - find language blocks
        const codeBlocks = {};
        let currentLang = 'default';
        let currentCode = [];
        let bgStyle = 'black';
        let copyEnabled = true;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Check for styling options
            if (line.includes('bg-white')) {
                bgStyle = 'white';
            }
            if (line.includes('copy-disable')) {
                copyEnabled = false;
            }
            
            // Check for language block
            const langMatch = line.match(/^\{(\w+)\}$/);
            if (langMatch) {
                // Save previous code block
                if (currentCode.length > 0) {
                    codeBlocks[currentLang] = currentCode.join('\n');
                }
                // Start new language block
                currentLang = langMatch[1].toLowerCase();
                currentCode = [];
            } else if (line && !line.includes('{') && !line.includes('bg-') && !line.includes('border-') && !line.includes('copy-')) {
                // Add code line
                currentCode.push(line);
            }
        }
        
        // Save last code block
        if (currentCode.length > 0) {
            codeBlocks[currentLang] = currentCode.join('\n');
        }
        
        // Generate code box HTML
        const languages = Object.keys(codeBlocks);
        if (languages.length === 0) return '';
        
        let html = `<div class="code-box ${bgStyle === 'white' ? 'white-bg' : ''}">`;
        html += '<div class="code-tabs">';
        
        languages.forEach((lang, index) => {
            const isActive = index === 0 ? 'active' : '';
            html += `<button class="code-tab ${isActive}" data-tab="code-${lang}">${lang.charAt(0).toUpperCase() + lang.slice(1)}</button>`;
        });
        
        html += '</div>';
        html += '<div class="code-content">';
        
        languages.forEach((lang, index) => {
            const isActive = index === 0 ? 'active' : '';
            const highlightedCode = this.syntaxHighlighters[lang] 
                ? this.syntaxHighlighters[lang](codeBlocks[lang])
                : this.syntaxHighlighters.default(codeBlocks[lang]);
            
            html += `<div id="code-${lang}" class="code-pane ${isActive}">`;
            html += '<div class="code-header">';
            html += `<span class="code-title">${lang.charAt(0).toUpperCase() + lang.slice(1)}</span>`;
            if (copyEnabled) {
                html += `<button class="copy-btn" title="Copy code"><span class="copy-icon">📋</span> Copy</button>`;
            }
            html += '</div>';
            html += highlightedCode;
            html += '</div>';
        });
        
        html += '</div></div>';
        return html;
    }

    generateHtml(latexPath) {
        try {
            const latex = fs.readFileSync(latexPath, 'utf8');
            const { title, author, date, content } = this.parseLatex(latex);
            
            return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${title}</title>
<style>${this.css}</style>
</head>
<body>
<div class="title">${title}</div>
<div class="author">${author}</div>
<div class="date">${date}</div>
${content}
<script>${this.js}</script>
</body>
</html>`;
        } catch (error) {
            return `<!DOCTYPE html><html><body><h1>Error</h1><p>Failed to process LaTeX file: ${error.message}</p></body></html>`;
        }
    }

    convert(inputFile, outputFile = null) {
        if (!outputFile) {
            const inputPath = path.parse(inputFile);
            outputFile = path.join(inputPath.dir, inputPath.name + '.html');
        }
        
        if (!fs.existsSync(inputFile)) {
            console.error(`❌ Error: File '${inputFile}' not found`);
            process.exit(1);
        }
        
        const html = this.generateHtml(inputFile);
        fs.writeFileSync(outputFile, html);
        
        console.log(`✅ Successfully converted ${inputFile} to ${outputFile}`);
        console.log(`🚀 Open ${outputFile} in your browser to see the result!`);
        return outputFile;
    }
}

// CLI interface
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('Usage: node engine.js <latex_file> [output_file]');
        console.log('Example: node engine.js index.tex');
        process.exit(1);
    }
    
    const inputFile = args[0];
    const outputFile = args[1];
    
    const engine = new LatexToHtmlEngine();
    engine.convert(inputFile, outputFile);
}

if (require.main === module) {
    main();
}

module.exports = LatexToHtmlEngine;