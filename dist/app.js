"use strict";
var ProjectInput = /** @class */ (function () {
    function ProjectInput() {
        this.templateEl = document.getElementById('project-input');
        this.targetNode = document.getElementById('app');
        this._templateContents = document.importNode(this.templateEl.content, true);
        this.formEl = this._templateContents
            .firstElementChild;
        this.attach();
    }
    ProjectInput.prototype.attach = function () {
        this.targetNode.insertAdjacentElement('afterbegin', this.formEl);
    };
    return ProjectInput;
}());
var projectInput = new ProjectInput();
