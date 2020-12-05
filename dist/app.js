"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
function Autobind(_1, _2, descriptor) {
    return {
        configurable: true,
        enumerable: false,
        get: function () {
            return descriptor.value.bind(this);
        },
    };
}
var ProjectListType;
(function (ProjectListType) {
    ProjectListType["ACTIVE"] = "active";
    ProjectListType["INACTIVE"] = "finished";
})(ProjectListType || (ProjectListType = {}));
var ProjectsList = /** @class */ (function () {
    function ProjectsList(type) {
        this.type = type;
        this.templateEl = document.getElementById('project-list');
        this.targetNode = document.getElementById('app');
        var importedNode = document.importNode(this.templateEl.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = this.type + "-projects";
        this.renderContents();
        this.attach();
    }
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
            var title = inputValues[0], description = inputValues[1], people = inputValues[2];
            console.log(title, description, people);
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
var projectInput = new ProjectsInput();
var activeProjectsList = new ProjectsList(ProjectListType.ACTIVE);
var inactiveProjectsList = new ProjectsList(ProjectListType.INACTIVE);
