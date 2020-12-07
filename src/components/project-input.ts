import Component from './base'
import { Autobind } from '../decorators'
import { projectState } from '../state/projects'
import * as Validation from '../validations'

export class ProjectsInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInput: HTMLInputElement
    descriptionInput: HTMLTextAreaElement
    peopleInput: HTMLInputElement

    constructor() {
        super('project-input', 'app', true, 'user-input')

        this.titleInput = this.element.querySelector(
            '#title',
        )! as HTMLInputElement

        this.descriptionInput = this.element.querySelector(
            '#description',
        )! as HTMLTextAreaElement

        this.peopleInput = this.element.querySelector(
            '#people',
        )! as HTMLInputElement

        this.configure()
        this.renderContents()
    }

    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault()
        const inputValues = this.getInputValues()

        if (inputValues) {
            projectState.addProject(inputValues)
            this.clearInputValues()
        }
    }

    private clearInputValues() {
        this.titleInput.value = ''
        this.descriptionInput.value = ''
        this.peopleInput.value = ''
    }

    private getInputValues(): [string, string, number] | void {
        const titleInputValue = this.titleInput.value
        const descriptionInputValue = this.descriptionInput.value
        const peopleInputValue = this.peopleInput.value

        const titleInputValidation: Validation.ValidatableString = {
            value: titleInputValue,
            minLength: 1,
        }

        const descriptionInputValidation: Validation.ValidatableString = {
            value: descriptionInputValue,
            minLength: 5,
        }

        const peopleInputValidation: Validation.ValidatableNumber = {
            value: +peopleInputValue,
            min: 1,
            max: 10,
        }

        if (
            !Validation.validate(titleInputValidation) ||
            !Validation.validate(descriptionInputValidation) ||
            !Validation.validate(peopleInputValidation)
        ) {
            alert('Invalid input values!')
            return
        }

        return [titleInputValue, descriptionInputValue, +peopleInputValue]
    }

    protected renderContents() {
    }

    protected configure() {
        this.element.addEventListener('submit', this.submitHandler)
    }
}
