/**
 * Portfolio Document Renderer
 * Placeholder renderer for LaTeX portfolio documents
 */

const BaseDocumentRenderer = require('./BaseDocumentRenderer');

class PortfolioDocumentRenderer extends BaseDocumentRenderer {
    constructor() {
        super();
        this.name = 'portfolio';
        this.displayName = 'Portfolio Document Renderer';
    }

    parseDocument() {
        return `<div class="portfolio">
            <h1>Portfolio Document</h1>
            <p>Portfolio rendering is not yet fully implemented.</p>
            <pre>${this.content.substring(0, 500)}...</pre>
        </div>`;
    }
}

module.exports = PortfolioDocumentRenderer;