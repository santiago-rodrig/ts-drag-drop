"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
function validate(validation) {
    var value = validation.value;
    if (typeof value === 'string') {
        var _a = validation, minLength = _a.minLength, maxLength = _a.maxLength;
        if (minLength && minLength > value.length)
            return false;
        if (maxLength && maxLength < value.length)
            return false;
    }
    else {
        var _b = validation, min = _b.min, max = _b.max;
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
var Project = /** @class */ (function () {
    function Project(title, description, people, status) {
        this.status = ProjectStatus.ACTIVE;
        this.title = title;
        this.description = description;
        this.people = people;
        this.id = Math.random().toString();
        if (status)
            this.status = status;
    }
    return Project;
}());
var ProjectState = /** @class */ (function () {
    function ProjectState() {
        this._projects = [];
        this._listeners = [];
    }
    ProjectState.getInstance = function () {
        if (this._instance)
            return this._instance;
        this._instance = new ProjectState();
        return this._instance;
    };
    ProjectState.prototype.addProject = function (projectData) {
        this._projects.push(new (Project.bind.apply(Project, __spreadArrays([void 0], projectData)))());
        this.callListeners();
    };
    ProjectState.prototype.getProjects = function (status) {
        switch (status) {
            case ProjectStatus.ACTIVE:
                return __spreadArrays(this._projects).filter(function (project) { return project.status === ProjectStatus.ACTIVE; });
            case ProjectStatus.INACTIVE:
                return __spreadArrays(this._projects).filter(function (project) { return project.status === ProjectStatus.INACTIVE; });
            default:
                return __spreadArrays(this._projects);
        }
    };
    ProjectState.prototype.callListeners = function () {
        this._listeners.forEach(function (listener) { return listener(); });
    };
    ProjectState.prototype.addListener = function (listener) {
        this._listeners.push(listener);
    };
    return ProjectState;
}());
var projectState = ProjectState.getInstance();
function Autobind(_1, _2, descriptor) {
    return {
        configurable: true,
        enumerable: false,
        get: function () {
            return descriptor.value.bind(this);
        },
    };
}
var ProjectsList = /** @class */ (function () {
    function ProjectsList(type) {
        var _this = this;
        this.type = type;
        this.projects = [];
        this.templateEl = document.getElementById('project-list');
        this.targetNode = document.getElementById('app');
        var importedNode = document.importNode(this.templateEl.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = this.type + "-projects";
        this.renderContents();
        projectState.addListener(function () {
            _this.projects = projectState.getProjects(_this.type);
            _this.renderProjects();
        });
        projectState.addListener(function () { }.bind(this));
        this.attach();
    }
    ProjectsList.prototype.renderProjects = function () {
        var list = document.getElementById(this.type + "-projects-list");
        this.projects.forEach(function (project) {
            var listItem = document.createElement('li');
            listItem.textContent = project.title;
            list.append(listItem);
        });
    };
    ProjectsList.prototype.attach = function () {
        this.targetNode.insertAdjacentElement('beforeend', this.element);
    };
    ProjectsList.prototype.renderContents = function () {
        this.element.querySelector('h2').textContent = this.type.toUpperCase() + " PROJECTS";
        this.element.querySelector('ul').id = this.type + "-projects-list";
    };
    return ProjectsList;
}());
var ProjectsInput = /** @class */ (function () {
    function ProjectsInput() {
        this.templateEl = document.getElementById('project-input');
        this.targetNode = document.getElementById('app');
        this._templateContents = document.importNode(this.templateEl.content, true);
        this.formEl = this._templateContents
            .firstElementChild;
        this.formEl.id = 'user-input';
        this.titleInput = this.formEl.querySelector('#title');
        this.descriptionInput = this.formEl.querySelector('#description');
        this.peopleInput = this.formEl.querySelector('#people');
        this.configure();
        this.attach();
    }
    ProjectsInput.prototype.submitHandler = function (event) {
        event.preventDefault();
        var inputValues = this.getInputValues();
        if (inputValues) {
            projectState.addProject(inputValues);
            this.clearInputValues();
        }
    };
    ProjectsInput.prototype.clearInputValues = function () {
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.peopleInput.value = '';
    };
    ProjectsInput.prototype.getInputValues = function () {
        var titleInputValue = this.titleInput.value;
        var descriptionInputValue = this.descriptionInput.value;
        var peopleInputValue = this.peopleInput.value;
        var titleInputValidation = {
            value: titleInputValue,
            minLength: 1,
        };
        var descriptionInputValidation = {
            value: descriptionInputValue,
            minLength: 5,
        };
        var peopleInputValidation = {
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
    };
    ProjectsInput.prototype.configure = function () {
        this.formEl.addEventListener('submit', this.submitHandler);
    };
    ProjectsInput.prototype.attach = function () {
        this.targetNode.insertAdjacentElement('afterbegin', this.formEl);
    };
    __decorate([
        Autobind
    ], ProjectsInput.prototype, "submitHandler", null);
    return ProjectsInput;
}());
new ProjectsInput();
new ProjectsList(ProjectStatus.ACTIVE);
new ProjectsList(ProjectStatus.INACTIVE);
//# sourceMappingURL=app.js.map