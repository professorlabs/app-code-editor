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
        const lines = content.split('\n');
        
        const codeBlocks = {};
        let currentLang = 'default';
        let currentCode = [];
        let bgStyle = 'black';
        let copyEnabled = true;
        let title = '';
        let showLineNumbers = false;
        let foundFirstCode = false;
        let languageOverride = null; // For single language blocks
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();
            
            // Parse styling options (only before code starts)
            if (!foundFirstCode) {
                if (trimmedLine.includes('bg-white')) bgStyle = 'white';
                else if (trimmedLine.includes('bg-gray')) bgStyle = 'gray';
                else if (trimmedLine.includes('bg-black')) bgStyle = 'black';
                if (trimmedLine.includes('copy-disable')) copyEnabled = false;
                if (trimmedLine.includes('numbers')) showLineNumbers = true;
                if (trimmedLine.includes('title=')) {
                    const titleMatch = trimmedLine.match(/title=([^\s]+)/);
                    if (titleMatch) title = titleMatch[1].replace(/[{}"']/g, '');
                }
            }
            
            // Check for language block
            const langMatch = trimmedLine.match(/^\{(\w+)(?::(\w+))?\}$/);
            if (langMatch) {
                foundFirstCode = true;
                // Save previous code block if exists
                if (currentCode.length > 0) {
                    codeBlocks[currentLang] = {
                        code: currentCode.join('\n'),
                        language: currentLang,
                        title: currentLang.charAt(0).toUpperCase() + currentLang.slice(1)
                    };
                }
                currentLang = langMatch[1].toLowerCase();
                // For single language blocks, remember the language
                if (!languageOverride && Object.keys(codeBlocks).length === 0) {
                    languageOverride = currentLang;
                }
                currentCode = [];
            } else if (trimmedLine && !trimmedLine.includes('bg-') && 
                      !trimmedLine.includes('border-') && !trimmedLine.includes('copy-') && 
                      !trimmedLine.includes('title=') && !trimmedLine.includes('numbers') &&
                      !trimmedLine.match(/^\{.*\}$/)) { // Exclude language specifiers
                foundFirstCode = true;
                // Preserve original indentation and whitespace
                currentCode.push(line);
            } else if (foundFirstCode && line === '') {
                // Preserve empty lines within code
                currentCode.push(line);
            }
        }
        
        // Save last code block
        if (currentCode.length > 0) {
            codeBlocks[currentLang] = {
                code: currentCode.join('\n'),
                language: currentLang,
                title: currentLang.charAt(0).toUpperCase() + currentLang.slice(1)
            };
        }
        
        // For single language blocks, override the default language
        if (languageOverride && codeBlocks.default) {
            codeBlocks[languageOverride] = {...codeBlocks.default};
            codeBlocks[languageOverride].language = languageOverride;
            codeBlocks[languageOverride].title = languageOverride.charAt(0).toUpperCase() + languageOverride.slice(1);
            delete codeBlocks.default;
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
            <span class="copy-icon">Copy</span>
        </button>
    </div>
    <div class="code-content"><pre><code class="language-${language}">${highlightedCode}</code></pre></div>
</div>`;
    }

    generateMultiTabCodeBlock(codeBlocks, options) {
        const languages = Object.keys(codeBlocks);
        if (languages.length === 0) return '';
        
        const themeClass = options.bgStyle === 'white' ? 'white-bg' : 
                          options.bgStyle === 'gray' ? 'gray-bg' : '';
        
        let html = `<div class="code-box ${themeClass}">`;
        
        // Title section
        if (options.title) {
            html += `<div class="code-box-title">${options.title}</div>`;
        }
        
        // Tab navigation - only show if multiple languages
        if (languages.length > 1) {
            html += '<div class="code-tabs">';
            languages.forEach((lang, index) => {
                const isActive = index === 0 ? 'active' : '';
                const displayName = codeBlocks[lang].title || lang;
                html += `<button class="code-tab ${isActive}" data-tab="code-${lang}">${displayName}</button>`;
            });
            html += '</div>';
        }
        
        // Code content - simplified structure
        languages.forEach((lang, index) => {
            const isActive = index === 0 ? 'active' : '';
            const highlighter = this.syntaxHighlighters[lang] || this.syntaxHighlighters.default;
            const highlightedCode = highlighter(codeBlocks[lang].code);
            
            html += `<div id="code-${lang}" class="code-pane ${isActive}">`;
            // Show header for single language or when line numbers are enabled
            if (languages.length === 1 || options.showLineNumbers) {
                html += '<div class="code-header">';
                html += `<span class="code-title">${codeBlocks[lang].title || lang}</span>`;
                if (options.copyEnabled) {
                    html += `<button class="copy-btn" title="Copy code"><span class="copy-icon">Copy</span></button>`;
                }
                html += '</div>';
            }
            html += `<pre><code class="language-${lang}">${highlightedCode}</code></pre>`;
            html += '</div>';
        });
        html += '</div>';
        
        return html;
    }

    createPythonHighlighter() {
        return (code) => {
            // Escape HTML entities and preserve indentation
            return code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\n/g, '\n');
        };
    }

    createJavaScriptHighlighter() {
        return (code) => {
            // Escape HTML entities and preserve indentation
            return code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\n/g, '\n');
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
                .replace(/\n/g, '\n')
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
                .replace(/\n/g, '\n')
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
        const entities = /&[a-zA-Z]+;/g;
        
        return (code) => {
            return code
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(comments, '<span class="syntax-comment">$1</span>')
                .replace(entities, '<span class="syntax-entity">$&</span>')
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
                .replace(/\n/g, '\n')
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
                .replace(/\n/g, '\n')
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
                .replace(/\n/g, '\n')
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
                .replace(/\n/g, '\n')
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