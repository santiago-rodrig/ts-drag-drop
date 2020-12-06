"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
class Component {
    constructor(templateId, targetNodeId, insertAtStart, newElementId) {
        this.templateEl = document.getElementById(templateId);
        this.targetNode = document.getElementById(targetNodeId);
        const importedNode = document.importNode(this.templateEl.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId)
            this.element.id = newElementId;
        this.attach(insertAtStart);
    }
    attach(insertAtStart) {
        if (insertAtStart) {
            this.targetNode.insertAdjacentElement('afterbegin', this.element);
        }
        else {
            this.targetNode.insertAdjacentElement('beforeend', this.element);
        }
    }
}
function validate(validation) {
    const { value } = validation;
    if (typeof value === 'string') {
        const { minLength, maxLength } = validation;
        if (minLength && minLength > value.length)
            return false;
        if (maxLength && maxLength < value.length)
            return false;
    }
    else {
        const { min, max } = validation;
        if (min && min > value)
            return false;
        if (max && max < value)
            return false;
    }
    return true;
}
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus["ACTIVE"] = "active";
    ProjectStatus["INACTIVE"] = "finished";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(title, description, people, status) {
        this.status = ProjectStatus.ACTIVE;
        this.title = title;
        this.description = description;
        this.people = people;
        this.id = Math.random().toString();
        if (status)
            this.status = status;
    }
}
class ProjectState {
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
const projectState = ProjectState.getInstance();
function Autobind(_1, _2, descriptor) {
    return {
        configurable: true,
        enumerable: false,
        get() {
            return descriptor.value.bind(this);
        },
    };
}
class ProjectItem extends Component {
    constructor(hostId, project) {
        super('single-project', hostId, false);
        this._project = project;
        this.configure();
        this.renderContents();
    }
    get projectMembers() {
        switch (this._project.people) {
            case 1:
                return '1 member';
            default:
                return `${this._project.people} members`;
        }
    }
    dragStartHandler(event) {
        event.dataTransfer.setData('text/plain', this._project.id);
        event.dataTransfer.effectAllowed = 'move';
    }
    dragEndHandler(_) {
        console.log('drag ended');
    }
    configure() {
        this.element.id = this._project.id;
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }
    renderContents() {
        this.element.querySelector('h2').textContent = this._project.title;
        this.element.querySelector('h3').textContent = this.projectMembers;
        this.element.querySelector('p').textContent = this._project.description;
    }
}
__decorate([
    Autobind
], ProjectItem.prototype, "dragStartHandler", null);
__decorate([
    Autobind
], ProjectItem.prototype, "dragEndHandler", null);
class ProjectsList extends Component {
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
class ProjectsInput extends Component {
    constructor() {
        super('project-input', 'app', true, 'user-input');
        this.titleInput = this.element.querySelector('#title');
        this.descriptionInput = this.element.querySelector('#description');
        this.peopleInput = this.element.querySelector('#people');
        this.configure();
        this.renderContents();
    }
    submitHandler(event) {
        event.preventDefault();
        const inputValues = this.getInputValues();
        if (inputValues) {
            projectState.addProject(inputValues);
            this.clearInputValues();
        }
    }
    clearInputValues() {
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.peopleInput.value = '';
    }
    getInputValues() {
        const titleInputValue = this.titleInput.value;
        const descriptionInputValue = this.descriptionInput.value;
        const peopleInputValue = this.peopleInput.value;
        const titleInputValidation = {
            value: titleInputValue,
            minLength: 1,
        };
        const descriptionInputValidation = {
            value: descriptionInputValue,
            minLength: 5,
        };
        const peopleInputValidation = {
            value: +peopleInputValue,
            min: 1,
            max: 10,
        };
        if (!validate(titleInputValidation) ||
            !validate(descriptionInputValidation) ||
            !validate(peopleInputValidation)) {
            alert('Invalid input values!');
            return;
        }
        return [titleInputValue, descriptionInputValue, +peopleInputValue];
    }
    renderContents() { }
    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }
}
__decorate([
    Autobind
], ProjectsInput.prototype, "submitHandler", null);
new ProjectsInput();
new ProjectsList(ProjectStatus.ACTIVE);
new ProjectsList(ProjectStatus.INACTIVE);
//# sourceMappingURL=app.js.map