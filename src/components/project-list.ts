import { Component} from './base.js'
import { DragTarget} from '../interfaces.js'
import { Project } from '../models/project.js'
import { ProjectStatus } from '../enums.js'
import { Autobind } from '../decorators.js'
import { projectState } from '../state/projects.js'
import { ProjectItem } from './project-item.js'

export class ProjectsList
    extends Component<HTMLDivElement, HTMLElement>
    implements DragTarget {
    projects: Project[] = []

    constructor(private type: ProjectStatus) {
        super('project-list', 'app', false, `${type}-projects`)
        this.configure()
        this.renderContents()
    }

    @Autobind
    dragOverHandler(event: DragEvent) {
        if (
            event.dataTransfer &&
            event.dataTransfer.types[0] === 'text/plain'
        ) {
            event.preventDefault()
            this.element.querySelector('ul')!.classList.add('droppable')
        }
    }

    @Autobind
    dragDropHandler(event: DragEvent) {
        const projectId = event.dataTransfer!.getData('text/plain')
        projectState.moveProject(projectId, this.type)
        this.element.querySelector('ul')!.classList.remove('droppable')
    }

    @Autobind
    dragLeaveHandler(event: DragEvent) {
        if (
            event.dataTransfer &&
            event.dataTransfer.types[0] === 'text/plain'
        ) {
            this.element.querySelector('ul')!.classList.remove('droppable')
        }
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
        this.element.addEventListener('dragover', this.dragOverHandler)
        this.element.addEventListener('dragleave', this.dragLeaveHandler)
        this.element.addEventListener('drop', this.dragDropHandler)
    }

    protected renderContents() {
        this.element.querySelector(
            'h2',
        )!.textContent = `${this.type.toUpperCase()} PROJECTS`
    }
}
