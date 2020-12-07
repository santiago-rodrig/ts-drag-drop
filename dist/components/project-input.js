var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from './base.js';
import { Autobind } from '../decorators.js';
import { projectState } from '../state/projects.js';
import { validate } from '../validations.js';
export class ProjectsInput extends Component {
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
    renderContents() {
    }
    configure() {
        this.element.addEventListener('submit', this.submitHandler);
    }
}
__decorate([
    Autobind
], ProjectsInput.prototype, "submitHandler", null);
//# sourceMappingURL=project-input.js.map