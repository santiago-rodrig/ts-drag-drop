import { ProjectsInput } from './components/project-input.js';
import { ProjectsList } from './components/project-list.js';
import { ProjectStatus } from './enums.js';
new ProjectsInput();
new ProjectsList(ProjectStatus.ACTIVE);
new ProjectsList(ProjectStatus.INACTIVE);
//# sourceMappingURL=app.js.map