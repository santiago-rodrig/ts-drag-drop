import { Component } from './base.js'
import { Draggable } from '../interfaces.js'
import { Project } from '../models/project.js'
import { Autobind } from '../decorators.js'

export class ProjectItem
    extends Component<HTMLUListElement, HTMLLIElement>
    implements Draggable {
    private _project: Project

    get projectMembers() {
        switch (this._project.people) {
            case 1:
                return '1 member'
            default:
                return `${this._project.people} members`
        }
    }

    constructor(hostId: string, project: Project) {
        super('single-project', hostId, false)
        this._project = project
        this.configure()
        this.renderContents()
    }

    @Autobind
    dragStartHandler(event: DragEvent) {
        event.dataTransfer!.setData('text/plain', this._project.id)
        event.dataTransfer!.effectAllowed = 'move'
    }

    @Autobind
    dragEndHandler(_: DragEvent) {
    }

    protected configure() {
        this.element.id = this._project.id
        this.element.addEventListener('dragstart', this.dragStartHandler)
        this.element.addEventListener('dragend', this.dragEndHandler)
    }

    protected renderContents() {
        this.element.querySelector('h2')!.textContent = this._project.title
        this.element.querySelector('h3')!.textContent = this.projectMembers
        this.element.querySelector('p')!.textContent = this._project.description
    }
}
