class ProjectInput {
    templateEl: HTMLTemplateElement
    targetNode: HTMLDivElement
    formEl: HTMLFormElement
    private _templateContents: DocumentFragment

    constructor() {
        this.templateEl = document.getElementById(
            'project-input'
        )! as HTMLTemplateElement

        this.targetNode = document.getElementById('app')! as HTMLDivElement

        this._templateContents = document.importNode(
            this.templateEl.content,
            true
        )

        this.formEl = this._templateContents
            .firstElementChild! as HTMLFormElement

        this.attach()
    }

    attach() {
        this.targetNode.insertAdjacentElement('afterbegin', this.formEl)
    }
}

const projectInput = new ProjectInput()
