import { ProjectStatus } from '../enums.js';
export class Project {
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
//# sourceMappingURL=project.js.map