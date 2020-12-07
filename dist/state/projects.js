import { Project } from '../models/project.js';
import { ProjectStatus } from '../enums.js';
export class ProjectState {
    constructor() {
        this._projects = [];
        this._listeners = [];
    }
    static getInstance() {
        if (this._instance)
            return this._instance;
        this._instance = new ProjectState();
        return this._instance;
    }
    moveProject(projectId, listType) {
        const projectInstance = this._projects.find((project) => project.id === projectId);
        if (projectInstance)
            projectInstance.status = listType;
        this.callListeners();
    }
    addProject(projectData) {
        this._projects.push(new Project(...projectData));
        this.callListeners();
    }
    getProjects(status) {
        switch (status) {
            case ProjectStatus.ACTIVE:
                return [...this._projects].filter((project) => project.status === ProjectStatus.ACTIVE);
            case ProjectStatus.INACTIVE:
                return [...this._projects].filter((project) => project.status === ProjectStatus.INACTIVE);
            default:
                return [...this._projects];
        }
    }
    callListeners() {
        this._listeners.forEach((listener) => listener());
    }
    addListener(listener) {
        this._listeners.push(listener);
    }
}
export const projectState = ProjectState.getInstance();
//# sourceMappingURL=projects.js.map