import { ProjectStatus } from '../enums'

export class Project {
    id: string
    title: string
    description: string
    people: number
    status: ProjectStatus = ProjectStatus.ACTIVE

    constructor(
        title: string,
        description: string,
        people: number,
        status?: ProjectStatus,
    ) {
        this.title = title
        this.description = description
        this.people = people
        this.id = Math.random().toString()
        if (status) this.status = status
    }
}
