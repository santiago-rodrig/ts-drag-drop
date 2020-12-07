/// <reference path="interfaces.ts" />
/// <reference path="models/project.ts" />
/// <reference path="components/project-input.ts" />
/// <reference path="components/project-item.ts" />
/// <reference path="components/project-list.ts" />

namespace App {
    new ProjectsInput()
    new ProjectsList(ProjectStatus.ACTIVE)
    new ProjectsList(ProjectStatus.INACTIVE)
}