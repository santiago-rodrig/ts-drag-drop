"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var Component = /** @class */ (function () {
    function Component(templateId, targetNodeId, insertAtStart, newElementId) {
        this.templateEl = document.getElementById(templateId);
        this.targetNode = document.getElementById(targetNodeId);
        var importedNode = document.importNode(this.templateEl.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId)
            this.element.id = newElementId;
        this.attach(insertAtStart);
    }
    Component.prototype.attach = function (insertAtStart) {
        if (insertAtStart) {
            this.targetNode.insertAdjacentElement('afterbegin', this.element);
        }
        else {
            this.targetNode.insertAdjacentElement('beforeend', this.element);
        }
    };
    return Component;
}());
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
var ProjectItem = /** @class */ (function (_super) {
    __extends(ProjectItem, _super);
    function ProjectItem(hostId, project) {
        var _this = _super.call(this, 'single-project', hostId, false) || this;
        _this.project = project;
        _this.configure();
        _this.renderContents();
        return _this;
    }
    ProjectItem.prototype.configure = function () {
        this.element.id = this.project.id;
    };
    ProjectItem.prototype.renderContents = function () {
        this.element.querySelector('h2').textContent = this.project.title;
        this.element.querySelector('h3').textContent = this.project.people.toString();
        this.element.querySelector('p').textContent = this.project.description;
    };
    return ProjectItem;
}(Component));
var ProjectsList = /** @class */ (function (_super) {
    __extends(ProjectsList, _super);
    function ProjectsList(type) {
        var _this = _super.call(this, 'project-list', 'app', false, type + "-projects") || this;
        _this.type = type;
        _this.projects = [];
        _this.configure();
        _this.renderContents();
        return _this;
    }
    ProjectsList.prototype.renderProjects = function () {
        var _this = this;
        var list = document
            .getElementById(this.type + "-projects")
            .querySelector('ul');
        list.innerHTML = '';
        this.projects.forEach(function (project) {
            new ProjectItem(_this.type + "-projects-list", project);
        });
    };
    ProjectsList.prototype.configure = function () {
        var _this = this;
        projectState.addListener(function () {
            _this.projects = projectState.getProjects(_this.type);
            _this.renderProjects();
        });
        this.element.querySelector('ul').id = this.type + "-projects-list";
    };
    ProjectsList.prototype.renderContents = function () {
        this.element.querySelector('h2').textContent = this.type.toUpperCase() + " PROJECTS";
    };
    return ProjectsList;
}(Component));
var ProjectsInput = /** @class */ (function (_super) {
    __extends(ProjectsInput, _super);
    function ProjectsInput() {
        var _this = _super.call(this, 'project-input', 'app', true, 'user-input') || this;
        _this.titleInput = _this.element.querySelector('#title');
        _this.descriptionInput = _this.element.querySelector('#description');
        _this.peopleInput = _this.element.querySelector('#people');
        _this.configure();
        _this.renderContents();
        return _this;
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
    ProjectsInput.prototype.renderContents = function () { };
    ProjectsInput.prototype.configure = function () {
        this.element.addEventListener('submit', this.submitHandler);
    };
    __decorate([
        Autobind
    ], ProjectsInput.prototype, "submitHandler", null);
    return ProjectsInput;
}(Component));
new ProjectsInput();
new ProjectsList(ProjectStatus.ACTIVE);
new ProjectsList(ProjectStatus.INACTIVE);
//# sourceMappingURL=app.js.map