function Autobind(_1: any, _2: string, descriptor: PropertyDescriptor) {
    return {
        configurable: true,
        enumerable: false,
        get() {
            return descriptor.value.bind(this)
        },
    } as PropertyDescriptor
}

class ProjectInput {
    templateEl: HTMLTemplateElement
    targetNode: HTMLDivElement
    formEl: HTMLFormElement
    titleInput: HTMLInputElement
    descriptionInput: HTMLTextAreaElement
    peopleInput: HTMLInputElement
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

        this.formEl.id = 'user-input'

        this.titleInput = this.formEl.querySelector(
            '#title'
        )! as HTMLInputElement

        this.descriptionInput = this.formEl.querySelector(
            '#description'
        )! as HTMLTextAreaElement

        this.peopleInput = this.formEl.querySelector(
            '#people'
        )! as HTMLInputElement

        this.configure()
        this.attach()
    }

    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault()
        console.log(this.titleInput.value)
    }

    private configure() {
        this.formEl.addEventListener('submit', this.submitHandler)
    }

    private attach() {
        this.targetNode.insertAdjacentElement('afterbegin', this.formEl)
    }
}

const projectInput = new ProjectInput()
