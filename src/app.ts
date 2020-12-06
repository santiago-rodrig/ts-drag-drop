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
type ProjectData = [string, string, number]

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
            templateId
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

class Project {
    id: string
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
        this.id = Math.random().toString()
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

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
    private project: Project

    constructor(hostId: string, project: Project) {
        super('single-project', hostId, false)
        this.project = project
        this.configure()
        this.renderContents()
    }

    protected configure() {
        this.element.id = this.project.id
    }

    protected renderContents() {
        this.element.querySelector('h2')!.textContent = this.project.title
        this.element.querySelector('h3')!.textContent = this.project.people.toString()
        this.element.querySelector('p')!.textContent = this.project.description
    }
}

class ProjectsList extends Component<HTMLDivElement, HTMLElement> {
    projects: Project[] = []

    constructor(private type: ProjectStatus) {
        super('project-list', 'app', false, `${type}-projects`)
        this.configure()
        this.renderContents()
    }

    private renderProjects() {
        const list = document
            .getElementById(`${this.type}-projects`)!
            .querySelector('ul')! as HTMLUListElement

        list.innerHTML = ''

        this.projects.forEach((project) => {
            new ProjectItem(`${this.type}-projects-list`, project)
        })
    }

    protected configure() {
        projectState.addListener(() => {
            this.projects = projectState.getProjects(this.type)
            this.renderProjects()
        })

        this.element.querySelector('ul')!.id = `${this.type}-projects-list`
    }

    protected renderContents() {
        this.element.querySelector(
            'h2'
        )!.textContent = `${this.type.toUpperCase()} PROJECTS`
    }
}

class ProjectsInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInput: HTMLInputElement
    descriptionInput: HTMLTextAreaElement
    peopleInput: HTMLInputElement

    constructor() {
        super('project-input', 'app', true, 'user-input')

        this.titleInput = this.element.querySelector(
            '#title'
        )! as HTMLInputElement

        this.descriptionInput = this.element.querySelector(
            '#description'
        )! as HTMLTextAreaElement

        this.peopleInput = this.element.querySelector(
            '#people'
        )! as HTMLInputElement

        this.configure()
        this.renderContents()
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

    protected renderContents() {}

    protected configure() {
        this.element.addEventListener('submit', this.submitHandler)
    }
}

new ProjectsInput()
new ProjectsList(ProjectStatus.ACTIVE)
new ProjectsList(ProjectStatus.INACTIVE)
