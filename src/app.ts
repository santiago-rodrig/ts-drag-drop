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

        const inputValues = this.getInputValues()

        if (inputValues) {
            const [title, description, people] = inputValues

            console.log(title, description, people)
            this.clearInputValues()
        }
    }

    private clearInputValues() {
        this.titleInput.value = ''
        this.descriptionInput.value = ''
        this.peopleInput.value = ''
    }

    private getInputValues(): [string, string, number] | void {
        const titleInputValue = this.titleInput.value
        const descriptionInputValue = this.descriptionInput.value
        const peopleInputValue = this.peopleInput.value

        if (
            titleInputValue.trim() === '' ||
            descriptionInputValue.trim() === '' ||
            peopleInputValue.trim() === ''
        ) {
            alert('All fields are required!')

            return
        }

        return [titleInputValue, descriptionInputValue, +peopleInputValue]
    }

    private configure() {
        this.formEl.addEventListener('submit', this.submitHandler)
    }

    private attach() {
        this.targetNode.insertAdjacentElement('afterbegin', this.formEl)
    }
}

const projectInput = new ProjectInput()
