var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from './base.js';
import { Autobind } from '../decorators.js';
import { projectState } from '../state/projects.js';
import { ProjectItem } from './project-item.js';
export class ProjectsList extends Component {
    constructor(type) {
        super('project-list', 'app', false, `${type}-projects`);
        this.type = type;
        this.projects = [];
        this.configure();
        this.renderContents();
    }
    dragOverHandler(event) {
        if (event.dataTransfer &&
            event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
            this.element.querySelector('ul').classList.add('droppable');
        }
    }
    dragDropHandler(event) {
        const projectId = event.dataTransfer.getData('text/plain');
        projectState.moveProject(projectId, this.type);
        this.element.querySelector('ul').classList.remove('droppable');
    }
    dragLeaveHandler(event) {
        if (event.dataTransfer &&
            event.dataTransfer.types[0] === 'text/plain') {
            this.element.querySelector('ul').classList.remove('droppable');
        }
    }
    renderProjects() {
        const list = document
            .getElementById(`${this.type}-projects`)
            .querySelector('ul');
        list.innerHTML = '';
        this.projects.forEach((project) => {
            new ProjectItem(`${this.type}-projects-list`, project);
        });
    }
    configure() {
        projectState.addListener(() => {
            this.projects = projectState.getProjects(this.type);
            this.renderProjects();
        });
        this.element.querySelector('ul').id = `${this.type}-projects-list`;
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dragDropHandler);
    }
    renderContents() {
        this.element.querySelector('h2').textContent = `${this.type.toUpperCase()} PROJECTS`;
    }
}
__decorate([
    Autobind
], ProjectsList.prototype, "dragOverHandler", null);
__decorate([
    Autobind
], ProjectsList.prototype, "dragDropHandler", null);
__decorate([
    Autobind
], ProjectsList.prototype, "dragLeaveHandler", null);
//# sourceMappingURL=project-list.js.map