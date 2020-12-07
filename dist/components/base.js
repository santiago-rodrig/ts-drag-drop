export class Component {
    constructor(templateId, targetNodeId, insertAtStart, newElementId) {
        this.templateEl = document.getElementById(templateId);
        this.targetNode = document.getElementById(targetNodeId);
        const importedNode = document.importNode(this.templateEl.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId)
            this.element.id = newElementId;
        this.attach(insertAtStart);
    }
    attach(insertAtStart) {
        if (insertAtStart) {
            this.targetNode.insertAdjacentElement('afterbegin', this.element);
        }
        else {
            this.targetNode.insertAdjacentElement('beforeend', this.element);
        }
    }
}
//# sourceMappingURL=base.js.map