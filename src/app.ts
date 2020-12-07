/// <reference path="components/project-input.ts" />
/// <reference path="components/project-list.ts" />
/// <reference path="enums.ts" />

namespace App {
    new ProjectsInput()
    new ProjectsList(ProjectStatus.ACTIVE)
    new ProjectsList(ProjectStatus.INACTIVE)
}