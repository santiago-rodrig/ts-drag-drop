"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function Autobind(_1, _2, descriptor) {
    return {
        configurable: true,
        enumerable: false,
        get: function () {
            return descriptor.value.bind(this);
        },
    };
}
var ProjectInput = /** @class */ (function () {
    function ProjectInput() {
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
    ProjectInput.prototype.submitHandler = function (event) {
        event.preventDefault();
        var inputValues = this.getInputValues();
        if (inputValues) {
            var title = inputValues[0], description = inputValues[1], people = inputValues[2];
            console.log(title, description, people);
            this.clearInputValues();
        }
    };
    ProjectInput.prototype.clearInputValues = function () {
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.peopleInput.value = '';
    };
    ProjectInput.prototype.getInputValues = function () {
        var titleInputValue = this.titleInput.value;
        var descriptionInputValue = this.descriptionInput.value;
        var peopleInputValue = this.peopleInput.value;
        if (titleInputValue.trim() === '' || descriptionInputValue.trim() === '' || peopleInputValue.trim() === '') {
            alert('All fields are required!');
            return;
        }
        return [titleInputValue, descriptionInputValue, +peopleInputValue];
    };
    ProjectInput.prototype.configure = function () {
        this.formEl.addEventListener('submit', this.submitHandler);
    };
    ProjectInput.prototype.attach = function () {
        this.targetNode.insertAdjacentElement('afterbegin', this.formEl);
    };
    __decorate([
        Autobind
    ], ProjectInput.prototype, "submitHandler", null);
    return ProjectInput;
}());
var projectInput = new ProjectInput();
