/**
 * Enhanced Code Parser with Premium Features
 * Supports multi-language syntax highlighting and advanced features
 */

class CodeParser {
    constructor() {
        this.syntaxHighlighters = {
            python: this.createPythonHighlighter(),
            javascript: this.createJavaScriptHighlighter(),
            java: this.createJavaHighlighter(),
            cpp: this.createCppHighlighter(),
            html: this.createHtmlHighlighter(),
            css: this.createCssHighlighter(),
            json: this.createJsonHighlighter(),
            sql: this.createSqlHighlighter(),
            bash: this.createBashHighlighter(),
            default: this.createDefaultHighlighter()
        };
    }

    parse(latexContent, context) {
        let html = latexContent;
        
        // Handle minted code blocks (if available)
        html = html.replace(/\\begin\{minted\}\{([^}]+)\}([\s\S]*?)\\end\{minted\}/g, (match, lang, code) => {
            return this.generateCodeBlock(lang.trim(), code.trim(), context);
        });
        
        // Handle lstlisting code blocks
        html = html.replace(/\\begin\{lstlisting\}\[language=([^\]]+)\]([\s\S]*?)\\end\{lstlisting\}/g, (match, lang, code) => {
            return this.generateCodeBlock(lang.trim(), code.trim(), context);
        });
        
        html = html.replace(/\\begin\{lstlisting\}([\s\S]*?)\\end\{lstlisting\}/g, (match, code) => {
            return this.generateCodeBlock('text', code.trim(), context);
        });
        
        // Handle verbatim
        html = html.replace(/\\begin\{verbatim\}([\s\S]*?)\\end\{verbatim\}/g, (match, code) => {
            return this.generateCodeBlock('text', code.trim(), context);
        });
        
        // Handle custom code blocks
        html = html.replace(/\\begin\{code\}([\s\S]*?)\\end\{code\}/g, (match, content) => {
            return this.parseCustomCodeBlock(content, context);
        });
        
        // Handle inline code
        html = html.replace(/\\`([^`]+)`/g, '<code class="inline-code">$1</code>');
        html = html.replace(/\\texttt\{([^}]+)\}/g, '<code class="inline-code">$1</code>');
        
        return html;
    }

    parseCustomCodeBlock(content, context) {
        const lines = content.trim().split('\n');
        
        const codeBlocks = {};
        let currentLang = 'default';
        let currentCode = [];
        let bgStyle = 'black';
        let copyEnabled = true;
        let title = '';
        let showLineNumbers = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Parse styling options
            if (line.includes('bg-white')) bgStyle = 'white';
            if (line.includes('bg-black')) bgStyle = 'black';
            if (line.includes('copy-disable')) copyEnabled = false;
            if (line.includes('numbers')) showLineNumbers = true;
            if (line.includes('title=')) {
                const titleMatch = line.match(/title=([^\s]+)/);
                if (titleMatch) title = titleMatch[1].replace(/[{}"']/g, '');
            }
            
            // Check for language block
            const langMatch = line.match(/^\{(\w+)(?::(\w+))?\}$/);
            if (langMatch) {
                if (currentCode.length > 0) {
                    codeBlocks[currentLang] = {
                        code: currentCode.join('\n'),
                        language: currentLang,
                        title: langMatch[2] || currentLang
                    };
                }
                currentLang = langMatch[1].toLowerCase();
                currentCode = [];
            } else if (line && !line.includes('{') && !line.includes('bg-') && 
                      !line.includes('border-') && !line.includes('copy-') && 
                      !line.includes('title=') && !line.includes('numbers')) {
                currentCode.push(line);
            }
        }
        
        // Save last code block
        if (currentCode.length > 0) {
            codeBlocks[currentLang] = {
                code: currentCode.join('\n'),
                language: currentLang,
                title: currentLang
            };
        }
        
        return this.generateMultiTabCodeBlock(codeBlocks, {
            bgStyle,
            copyEnabled,
            title,
            showLineNumbers,
            theme: context.theme
        });
    }

    generateCodeBlock(language, code, context) {
        const highlighter = this.syntaxHighlighters[language] || this.syntaxHighlighters.default;
        const highlightedCode = highlighter(code);
        
        return `<div class="code-block ${context.theme}">
    <div class="code-header">
        <span class="language-label">${language}</span>
        <button class="copy-btn" onclick="copyCode(this)">
            <span class="copy-icon">📋</span> Copy
        </button>
    </div>
    <pre class="code-content"><code>${highlightedCode}</code></pre>
</div>`;
    }

    generateMultiTabCodeBlock(codeBlocks, options) {
        const languages = Object.keys(codeBlocks);
        if (languages.length === 0) return '';
        
        const firstLang = languages[0];
        const themeClass = options.bgStyle === 'white' ? 'white-bg' : '';
        
        let html = `<div class="code-box ${themeClass}">`;
        
        // Title section
        if (options.title) {
            html += `<div class="code-box-title">${options.title}</div>`;
        }
        
        // Tab navigation
        html += '<div class="code-tabs">';
        languages.forEach((lang, index) => {
            const isActive = index === 0 ? 'active' : '';
            const displayName = codeBlocks[lang].title || lang;
            html += `<button class="code-tab ${isActive}" data-tab="code-${lang}">${displayName}</button>`;
        });
        html += '</div>';
        
        // Code content
        html += '<div class="code-content">';
        languages.forEach((lang, index) => {
            const isActive = index === 0 ? 'active' : '';
            const highlighter = this.syntaxHighlighters[lang] || this.syntaxHighlighters.default;
            const highlightedCode = highlighter(codeBlocks[lang].code);
            
            html += `<div id="code-${lang}" class="code-pane ${isActive}">`;
            html += '<div class="code-header">';
            html += `<span class="code-title">${codeBlocks[lang].title}</span>`;
            if (options.copyEnabled) {
                html += `<button class="copy-btn" title="Copy code"><span class="copy-icon">📋</span> Copy</button>`;
            }
            html += '</div>';
            html += `<div class="code-text">${highlightedCode}</div>`;
            html += '</div>';
        });
        html += '</div>';
        html += '</div>';
        
        return html;
    }

    createPythonHighlighter() {
        const keywords = /\b(def|class|if|else|elif|for|while|import|from|as|return|try|except|with|lambda|yield|async|await|global|nonlocal|pass|break|continue|in|is|and|or|not|True|False|None|self|cls|finally|raise|assert|del)\b/g;
        const strings = /(["'])((?:\\.|(?!\1)[^\\\r\n])*?)\1/g;
        const comments = /(#.*$)/gm;
        const numbers = /\b\d+\.?\d*\b/g;
        const functions = /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*(?=\()/g;
        const decorators = /@([a-zA-Z_][a-zA-Z0-9_]*)/g;
        
        return (code) => {
            return code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(decorators, '<span class="syntax-decorator">@$1</span>')
                .replace(comments, '<span class="syntax-comment">$1</span>')
                .replace(strings, '<span class="syntax-string">$1$2$1</span>')
                .replace(numbers, '<span class="syntax-number">$&</span>')
                .replace(keywords, '<span class="syntax-keyword">$1</span>')
                .replace(functions, '<span class="syntax-function">$1</span>');
        };
    }

    createJavaScriptHighlighter() {
        const keywords = /\b(const|let|var|function|if|else|for|while|do|switch|case|default|break|continue|return|try|catch|finally|throw|new|this|typeof|instanceof|in|of|class|extends|import|export|from|as|async|await|yield|debugger|with|delete|void|super|static|get|set)\b/g;
        const strings = /(["'`])((?:\\.|(?!\1)[^\\\r\n])*?)\1/g;
        const templateStrings = /`((?:\\.|[^`\\\r\n])*)`/g;
        const comments = /\/\/.*$|\/\*[\s\S]*?\*\//gm;
        const numbers = /\b\d+\.?\d*\b/g;
        const functions = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g;
        const arrowFunctions = /([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>/g;
        
        return (code) => {
            return code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(comments, '<span class="syntax-comment">$&</span>')
                .replace(strings, '<span class="syntax-string">$1$2$1</span>')
                .replace(templateStrings, '<span class="syntax-template">`$1`</span>')
                .replace(numbers, '<span class="syntax-number">$&</span>')
                .replace(keywords, '<span class="syntax-keyword">$1</span>')
                .replace(arrowFunctions, '<span class="syntax-function">$1</span> =>')
                .replace(functions, '<span class="syntax-function">$1</span>');
        };
    }

    createJavaHighlighter() {
        const keywords = /\b(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while)\b/g;
        const annotations = /@\w+/g;
        const strings = /"((?:\\.|[^"\\\r\n])*?)"/g;
        const comments = /\/\/.*$|\/\*[\s\S]*?\*\//gm;
        const numbers = /\b\d+\.?\d*[lLfFdD]?\b/g;
        
        return (code) => {
            return code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(annotations, '<span class="syntax-annotation">$&</span>')
                .replace(comments, '<span class="syntax-comment">$&</span>')
                .replace(strings, '<span class="syntax-string">"$1"</span>')
                .replace(numbers, '<span class="syntax-number">$&</span>')
                .replace(keywords, '<span class="syntax-keyword">$1</span>');
        };
    }

    createCppHighlighter() {
        const keywords = /\b(alignas|alignof|and|and_eq|asm|auto|bitand|bitor|bool|break|case|catch|char|char8_t|char16_t|char32_t|class|compl|concept|const|consteval|constexpr|const_cast|continue|co_await|co_return|co_yield|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|false|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|not|not_eq|nullptr|operator|or|or_eq|private|protected|public|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|true|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while|xor|xor_eq)\b/g;
        const preprocessor = /#\s*\w+/g;
        const strings = /"((?:\\.|[^"\\\r\n])*?)"/g;
        const comments = /\/\/.*$|\/\*[\s\S]*?\*\//gm;
        const numbers = /\b\d+\.?\d*[fFlL]?\b/g;
        
        return (code) => {
            return code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(preprocessor, '<span class="syntax-preprocessor">$&</span>')
                .replace(comments, '<span class="syntax-comment">$&</span>')
                .replace(strings, '<span class="syntax-string">"$1"</span>')
                .replace(numbers, '<span class="syntax-number">$&</span>')
                .replace(keywords, '<span class="syntax-keyword">$1</span>');
        };
    }

    createHtmlHighlighter() {
        const tags = /(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)(.*?)(&gt;)/g;
        const attributes = /([a-zA-Z-]+)(=)(["'])(.*?)\3/g;
        const comments = /(&lt;!--[\s\S]*?--&gt;)/g;
        
        return (code) => {
            return code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(comments, '<span class="syntax-comment">$1</span>')
                .replace(tags, (match, lt, tag, attrs, gt) => {
                    const attrHighlighted = attrs.replace(attributes, '<span class="syntax-attribute">$1</span>=<span class="syntax-string">"$4"</span>');
                    return `${lt}<span class="syntax-tag">${tag}</span>${attrHighlighted}${gt}`;
                });
        };
    }

    createCssHighlighter() {
        const selectors = /([.#]?[a-zA-Z][a-zA-Z0-9-]*)\s*(\{)/g;
        const properties = /([a-zA-Z-]+)(\s*:\s*)([^;]+)(;)/g;
        const comments = /\/\*[\s\S]*?\*\//g;
        
        return (code) => {
            return code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(comments, '<span class="syntax-comment">$&</span>')
                .replace(selectors, '<span class="syntax-selector">$1</span>$2')
                .replace(properties, '<span class="syntax-property">$1</span>$2<span class="syntax-value">$3</span>$4');
        };
    }

    createJsonHighlighter() {
        const strings = /"((?:\\.|[^"\\\r\n])*?)"/g;
        const numbers = /\b-?\d+\.?\d*\b/g;
        const booleans = /\b(true|false|null)\b/g;
        
        return (code) => {
            return code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(strings, '<span class="syntax-string">"$1"</span>')
                .replace(numbers, '<span class="syntax-number">$&</span>')
                .replace(booleans, '<span class="syntax-keyword">$1</span>');
        };
    }

    createSqlHighlighter() {
        const keywords = /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|TABLE|INDEX|VIEW|DATABASE|SCHEMA|PRIMARY|KEY|FOREIGN|REFERENCES|NOT|NULL|UNIQUE|DEFAULT|AUTO_INCREMENT|INT|VARCHAR|TEXT|BOOLEAN|DATE|TIME|TIMESTAMP|JOIN|INNER|LEFT|RIGHT|FULL|OUTER|ON|AS|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|UNION|ALL|DISTINCT|COUNT|SUM|AVG|MIN|MAX|AND|OR|NOT|IN|EXISTS|BETWEEN|LIKE|IS|CASE|WHEN|THEN|ELSE|END)\b/gi;
        const strings = /'((?:\\.|[^'\\\r\n])*?)'/g;
        const comments = /(--.*$|\/\*[\s\S]*?\*\/)/gm;
        const numbers = /\b\d+\.?\d*\b/g;
        
        return (code) => {
            return code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(comments, '<span class="syntax-comment">$&</span>')
                .replace(strings, '<span class="syntax-string">\'$1\'</span>')
                .replace(numbers, '<span class="syntax-number">$&</span>')
                .replace(keywords, '<span class="syntax-keyword">$1</span>');
        };
    }

    createBashHighlighter() {
        const keywords = /\b(if|then|else|elif|fi|for|while|do|done|case|esac|function|return|exit|break|continue|read|echo|printf|cd|pwd|ls|mkdir|rmdir|rm|cp|mv|grep|sed|awk|sort|uniq|wc|head|tail|cat|less|more|chmod|chown|chgrp|find|locate|which|whereis|man|info|help|alias|unalias|export|env|set|unset|source|exec|test|true|false)\b/g;
        const strings = /"((?:\\.|[^"\\\r\n])*?)"/g;
        const strings2 = /'((?:\\.|[^'\\\r\n])*?)'/g;
        const comments = /#.*$/gm;
        const variables = /\$\{?\w+\}?/g;
        const commands = /^\s*\w+/gm;
        
        return (code) => {
            return code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(comments, '<span class="syntax-comment">$&</span>')
                .replace(strings, '<span class="syntax-string">"$1"</span>')
                .replace(strings2, '<span class="syntax-string">\'$1\'</span>')
                .replace(variables, '<span class="syntax-variable">$&</span>')
                .replace(keywords, '<span class="syntax-keyword">$1</span>')
                .replace(commands, '<span class="syntax-command">$&</span>');
        };
    }

    createDefaultHighlighter() {
        return (code) => {
            return code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        };
    }
}

module.exports = CodeParser;