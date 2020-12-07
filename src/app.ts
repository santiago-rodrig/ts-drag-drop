import { ProjectsInput } from './components/project-input'
import { ProjectsList } from './components/project-list'
import { ProjectStatus } from './enums'

new ProjectsInput()
new ProjectsList(ProjectStatus.ACTIVE)
new ProjectsList(ProjectStatus.INACTIVE)