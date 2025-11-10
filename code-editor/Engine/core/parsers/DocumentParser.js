/**
 * Document Structure Parser
 * Handles document class, packages, and basic structure
 */

class DocumentParser {
    parse(latexContent, context) {
        let html = latexContent;
        
        // Parse title, author, date before removing them
        const titleData = this.extractTitle(html);
        const authorData = this.extractAuthors(html);
        const dateData = this.extractDate(html);
        
        // Store parsed data in context for later use
        context.titleData = titleData;
        context.authorData = authorData;
        context.dateData = dateData;
        
        // Remove document class and packages - they're handled in context
        html = html.replace(/\\documentclass\[[^\]]*\]\{[^}]*\}/g, '');
        html = html.replace(/\\documentclass\{[^}]*\}/g, '');
        html = html.replace(/\\usepackage\[[^\]]*\]\{[^}]*\}/g, '');
        html = html.replace(/\\usepackage\{[^}]*\}/g, '');
        
        // Remove bibliography and other external references
        html = html.replace(/\\bibliography\{[^}]*\}/g, '');
        html = html.replace(/\\bibliographystyle\{[^}]*\}/g, '');
        
        // Aggressive cleanup of all LaTeX author/date content
        const beginDocMatch = html.match(/\\begin\{document\}/);
        if (beginDocMatch) {
            const beginDocIndex = beginDocMatch.index;
            const beforeDocument = html.substring(0, beginDocIndex);
            
            // Find title and remove everything after it until begin document
            const titleMatch = beforeDocument.match(/\\title\{[^}]*\}/);
            if (titleMatch) {
                const titleStart = beforeDocument.indexOf(titleMatch[0]);
                // Remove ALL content after title until document begins
                html = beforeDocument.substring(0, titleStart + titleMatch[0].length) + html.substring(beginDocIndex);
            }
        }
        
        // Remove any remaining LaTeX commands that might be stray
        html = html.replace(/\\author\{[^}]*\}[^}]*}/g, ''); // Remove malformed author blocks
        html = html.replace(/\\\\textsuperscript\{[^}]*\}[^\\\\]*/g, ''); // Remove stray superscripts
        html = html.replace(/\\\\[a-zA-Z]+\{[^}]*\}/g, ''); // Remove double backslash commands
        
        // Handle document environment
        html = html.replace(/\\begin\{document\}/g, '<div class="document-body">');
        html = html.replace(/\\end\{document\}/g, '</div>');
        
        // Handle maketitle - replace with generated title section
        html = html.replace(/\\maketitle/g, this.generateTitleSection(titleData, authorData, dateData));
        
        // Handle newpage
        html = html.replace(/\\newpage/g, '<div class="page-break"></div>');
        html = html.replace(/\\clearpage/g, '<div class="page-break"></div>');
        
        // Handle table of contents
        html = html.replace(/\\tableofcontents/g, '<div class="table-of-contents"><h2>Table of Contents</h2><div class="toc-content"></div></div>');
        
        // Handle list of figures
        html = html.replace(/\\listoffigures/g, '<div class="list-of-figures"><h2>List of Figures</h2></div>');
        
        // Handle list of tables
        html = html.replace(/\\listoftables/g, '<div class="list-of-tables"><h2>List of Tables</h2></div>');
        
        return html;
    }

    extractTitle(latexContent) {
        const titleMatch = latexContent.match(/\\title\{([^}]*)\}/);
        return titleMatch ? titleMatch[1].trim() : '';
    }

    extractAuthors(latexContent) {
        const result = {
            main: [],
            affiliations: [],
            emails: []
        };
        
        // First try to get the standard author block
        const authorMatch = latexContent.match(/\\author\{((?:[^{}]|{[^{}]*})*)\}/);
        let authorText = '';
        let additionalInfo = '';
        
        if (authorMatch) {
            authorText = authorMatch[1];
            // Look for additional author info after the closing brace
            const afterAuthor = latexContent.substring(latexContent.indexOf(authorMatch[0]) + authorMatch[0].length);
            const tillDate = afterAuthor.split(/\\date\{/)[0];
            additionalInfo = tillDate;
        } else {
            // Try to extract authors from malformed LaTeX
            const titleMatch = latexContent.match(/\\title\{[^}]*\}/);
            const dateMatch = latexContent.match(/\\date\{/);
            
            if (titleMatch && dateMatch) {
                const start = latexContent.indexOf(titleMatch[0]) + titleMatch[0].length;
                const end = latexContent.indexOf(dateMatch[0]);
                authorText = latexContent.substring(start, end).replace(/\\author\{?/, '').replace(/^\s*/, '');
                
                // Extract lines that look like they belong to author info
                const lines = authorText.split('\\\\');
                if (lines.length > 1) {
                    authorText = lines[0];
                    additionalInfo = lines.slice(1).join('\\\\');
                }
            }
        }
        
        // Extract main authors
        if (authorText) {
            result.main = this.parseAuthorNames(authorText);
        }
        
        // Process additional info (affiliations and emails)
        if (additionalInfo) {
            const lines = additionalInfo.split('\\\\');
            lines.forEach(line => {
                const cleanLine = line.trim();
                if (cleanLine.includes('@')) {
                    result.emails = this.parseEmails(cleanLine);
                } else if (cleanLine.includes('Department') || cleanLine.includes('University') || cleanLine.includes('Institute') || cleanLine.includes('\\textsuperscript')) {
                    // Extract the affiliation text with its superscript number
                    const superscriptMatch = cleanLine.match(/\\textsuperscript\{(\d+)\}\s*(.+)/);
                    if (superscriptMatch) {
                        const [, num, affiliation] = superscriptMatch;
                        result.affiliations.push(`${num}: ${affiliation}`);
                    } else {
                        result.affiliations.push(cleanLine);
                    }
                }
            });
        }
        
        return result;
    }

    parseAuthorNames(authorText) {
        return authorText
            .replace(/\\textsuperscript\{([^}]*)\}/g, '<sup>$1</sup>') // Convert superscripts
            .replace(/\\texttt\{([^}]*)\}/g, '<code>$1</code>') // Handle texttt
            .replace(/\\textbf\{([^}]*)\}/g, '<strong>$1</strong>') // Handle bold
            .replace(/\\textit\{([^}]*)\}/g, '<em>$1</em>') // Handle italic
            .split(',')
            .map(name => name.trim())
            .filter(name => name);
    }

    parseAffiliations(affiliationText) {
        return affiliationText
            .replace(/\\textsuperscript\{(\d+)\}/g, (match, num) => `<sup>${num}</sup>`)
            .split('\\\\')
            .map(affiliation => affiliation.trim())
            .filter(affiliation => affiliation && affiliation.length > 0);
    }

    parseEmails(emailText) {
        return emailText
            .replace(/\\texttt\{([^}]*)\}/g, '$1') // Remove texttt wrapper
            .replace(/[{}]/g, '') // Remove any remaining braces
            .split(/[,;]\s*/)
            .map(email => email.trim())
            .filter(email => email.includes('@'));
    }

    extractDate(latexContent) {
        const dateMatch = latexContent.match(/\\date\{([^}]*)\}/);
        if (!dateMatch) return '';
        
        let date = dateMatch[1];
        
        // Handle special LaTeX date commands
        if (date.includes('\\today')) {
            const today = new Date();
            date = date.replace(/\\\\today/g, today.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }));
        }
        
        // Clean up any remaining LaTeX commands and backslashes
        date = date.replace(/\\\\[a-zA-Z]+/g, '').replace(/^[^a-zA-Z]*/, '');
        
        return date.trim();
    }

    generateTitleSection(titleData, authorData, dateData) {
        let html = '<div class="title-section">';
        
        if (titleData) {
            html += `<h1 class="title">${this.formatTextCommands(titleData)}</h1>`;
        }
        
        if (authorData.main && authorData.main.length > 0) {
            html += '<div class="author">';
            
            // Main authors - they already have superscripts from parseAuthorNames
            const authorHtml = authorData.main.map(author => 
                `<span class="author-name">${author}</span>`
            ).join(', ');
            
            html += authorHtml;
            html += '</div>';
            
            // Affiliations
            if (authorData.affiliations.length > 0) {
                html += '<div class="affiliations">';
                authorData.affiliations.forEach((affiliation, index) => {
                    // If affiliation already has number format, use it as-is
                    if (affiliation.match(/^\d+:/)) {
                        const [num, text] = affiliation.split(':');
                        html += `<div class="affiliation"><sup>${num}</sup> ${this.formatTextCommands(text)}</div>`;
                    } else {
                        html += `<div class="affiliation"><sup>${index + 1}</sup> ${this.formatTextCommands(affiliation)}</div>`;
                    }
                });
                html += '</div>';
            }
            
            // Emails
            if (authorData.emails.length > 0) {
                html += '<div class="emails">';
                html += authorData.emails.map(email => 
                    `<span class="email"><code>${email}</code></span>`
                ).join(', ');
                html += '</div>';
            }
        }
        
        if (dateData) {
            html += `<div class="date">${dateData}</div>`;
        }
        
        html += '</div>';
        return html;
    }

    formatTextCommands(text) {
        return text
            .replace(/\\textsuperscript\{([^}]*)\}/g, '<sup>$1</sup>')
            .replace(/\\texttt\{([^}]*)\}/g, '<code>$1</code>')
            .replace(/\\textbf\{([^}]*)\}/g, '<strong>$1</strong>')
            .replace(/\\textit\{([^}]*)\}/g, '<em>$1</em>')
            .replace(/\\textsc\{([^}]*)\}/g, '<span class="small-caps">$1</span>')
            .replace(/\\textrm\{([^}]*)\}/g, '<span class="roman">$1</span>')
            .replace(/\\textsf\{([^}]*)\}/g, '<span class="sans-serif">$1</span>');
    }
}

module.exports = DocumentParser;