export default abstract class<T extends HTMLElement, U extends HTMLElement> {
    templateEl: HTMLTemplateElement
    targetNode: T
    element: U

    protected constructor(
        templateId: string,
        targetNodeId: string,
        insertAtStart: boolean,
        newElementId?: string,
    ) {
        this.templateEl = document.getElementById(
            templateId,
        )! as HTMLTemplateElement

        this.targetNode = document.getElementById(targetNodeId)! as T
        const importedNode = document.importNode(this.templateEl.content, true)
        this.element = importedNode.firstElementChild! as U
        if (newElementId) this.element.id = newElementId
        this.attach(insertAtStart)
    }

    private attach(insertAtStart: boolean) {
        if (insertAtStart) {
            this.targetNode.insertAdjacentElement('afterbegin', this.element)
        } else {
            this.targetNode.insertAdjacentElement('beforeend', this.element)
        }
    }

    protected abstract configure(): void

    protected abstract renderContents(): void
}
