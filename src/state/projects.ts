import { Project } from '../models/project.js'
import { ProjectStatus } from '../enums.js'

type ProjectData = [string, string, number]

export class ProjectState {
    private _projects: Project[] = []
    private _listeners: Function[] = []
    private static _instance: ProjectState

    static getInstance() {
        if (this._instance) return this._instance

        this._instance = new ProjectState()
        return this._instance
    }

    private constructor() {
    }

    moveProject(projectId: string, listType: ProjectStatus) {
        const projectInstance = this._projects.find(
            (project) => project.id === projectId,
        )
        if (projectInstance) projectInstance.status = listType
        this.callListeners()
    }

    addProject(projectData: ProjectData): void {
        this._projects.push(new Project(...projectData))
        this.callListeners()
    }

    getProjects(status?: ProjectStatus) {
        switch (status) {
            case ProjectStatus.ACTIVE:
                return [...this._projects].filter(
                    (project) => project.status === ProjectStatus.ACTIVE,
                )
            case ProjectStatus.INACTIVE:
                return [...this._projects].filter(
                    (project) => project.status === ProjectStatus.INACTIVE,
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

export const projectState = ProjectState.getInstance()
