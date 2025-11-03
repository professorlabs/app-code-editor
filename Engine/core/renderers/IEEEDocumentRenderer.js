/**
 * IEEE Document Renderer
 * Placeholder renderer for LaTeX IEEE documents
 */

const BaseDocumentRenderer = require('./BaseDocumentRenderer');

class IEEEDocumentRenderer extends BaseDocumentRenderer {
    constructor() {
        super();
        this.name = 'ieeetran';
        this.displayName = 'IEEE Document Renderer';
    }

    parseDocument() {
        return `<div class="ieee">
            <h1>IEEE Document</h1>
            <p>IEEE rendering is not yet fully implemented.</p>
            <pre>${this.content.substring(0, 500)}...</pre>
        </div>`;
    }
}

module.exports = IEEEDocumentRenderer;