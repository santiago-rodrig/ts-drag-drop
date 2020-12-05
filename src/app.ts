interface ValidatableNumber {
    value: number
    min?: number
    max?: number
}

interface ValidatableString {
    value: string
    minLength?: number
    maxLength?: number
}

type Validatable = ValidatableNumber | ValidatableString

function validate(validation: Validatable): boolean {
    const { value } = validation

    if (typeof value === 'string') {
        const { minLength, maxLength } = validation as ValidatableString

        if (minLength && minLength > value.length) return false

        if (maxLength && maxLength < value.length) return false
    } else {
        const { min, max } = validation as ValidatableNumber

        if (min && min > value) return false

        if (max && max < value) return false
    }

    return true
}

enum ProjectStatus {
    ACTIVE = 'active',
    INACTIVE = 'finished',
}

type ProjectData = [string, string, number]

class Project {
    title: string
    description: string
    people: number
    status: ProjectStatus = ProjectStatus.ACTIVE

    constructor(
        title: string,
        description: string,
        people: number,
        status?: ProjectStatus
    ) {
        this.title = title
        this.description = description
        this.people = people

        if (status) this.status = status
    }
}

class ProjectState {
    private _projects: Project[] = []
    private _listeners: Function[] = []
    private static _instance: ProjectState

    static getInstance() {
        if (this._instance) return this._instance

        this._instance = new ProjectState()
        return this._instance
    }

    private constructor() {}

    addProject(projectData: ProjectData): void {
        this._projects.push(new Project(...projectData))
        this.callListeners()
    }

    getProjects(status?: ProjectStatus) {
        switch (status) {
            case ProjectStatus.ACTIVE:
                return [...this._projects].filter(
                    (project) => project.status === ProjectStatus.ACTIVE
                )
            case ProjectStatus.INACTIVE:
                return [...this._projects].filter(
                    (project) => project.status === ProjectStatus.INACTIVE
                )
            default:
                return [...this._projects]
        }
    }

    private callListeners(): void {
        this._listeners.forEach((listener) => listener())
    }

    addListener(listener: Function): void {
        this._listeners.push(listener)
    }
}

const projectState = ProjectState.getInstance()

function Autobind(
    _1: any,
    _2: string,
    descriptor: PropertyDescriptor
): PropertyDescriptor {
    return {
        configurable: true,
        enumerable: false,
        get() {
            return descriptor.value.bind(this)
        },
    } as PropertyDescriptor
}

class ProjectsList {
    templateEl: HTMLTemplateElement
    targetNode: HTMLDivElement
    element: HTMLElement
    projects: Project[] = []

    constructor(private type: ProjectStatus) {
        this.templateEl = document.getElementById(
            'project-list'
        )! as HTMLTemplateElement

        this.targetNode = document.getElementById('app')! as HTMLDivElement

        const importedNode = document.importNode(this.templateEl.content, true)

        this.element = importedNode.firstElementChild! as HTMLElement
        this.element.id = `${this.type}-projects`

        this.renderContents()

        projectState.addListener(() => {
            this.projects = projectState.getProjects(this.type)
            this.renderProjects()
        })

        projectState.addListener(function () {}.bind(this))

        this.attach()
    }

    private renderProjects() {
        const list = document.getElementById(
            `${this.type}-projects-list`
        )! as HTMLUListElement

        this.projects.forEach((project) => (list.textContent += project.title))
    }

    private attach() {
        this.targetNode.insertAdjacentElement('beforeend', this.element)
    }

    private renderContents() {
        this.element.querySelector(
            'h2'
        )!.textContent = `${this.type.toUpperCase()} PROJECTS`

        this.element.querySelector('ul')!.id = `${this.type}-projects-list`
    }
}

class ProjectsInput {
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
            projectState.addProject(inputValues)
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

        const titleInputValidation: ValidatableString = {
            value: titleInputValue,
            minLength: 1,
        }

        const descriptionInputValidation: ValidatableString = {
            value: descriptionInputValue,
            minLength: 5,
        }

        const peopleInputValidation: ValidatableNumber = {
            value: +peopleInputValue,
            min: 1,
            max: 10,
        }

        if (
            !validate(titleInputValidation) ||
            !validate(descriptionInputValidation) ||
            !validate(peopleInputValidation)
        ) {
            alert('Invalid input values!')

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

const projectInput = new ProjectsInput()
const activeProjectsList = new ProjectsList(ProjectStatus.ACTIVE)
const inactiveProjectsList = new ProjectsList(ProjectStatus.INACTIVE)
