export interface ValidatableNumber {
    value: number
    min?: number
    max?: number
}

export interface ValidatableString {
    value: string
    minLength?: number
    maxLength?: number
}

export type Validatable = ValidatableNumber | ValidatableString

export function validate(validation: Validatable): boolean {
    const { value } = validation

    if (typeof value === 'string') {
        const { minLength, maxLength } = validation as ValidatableString
        if (minLength && minLength > value.length) return false
        if (maxLength && maxLength < value.length) return false
    } else {
        const { min, max } = validation as ValidatableNumber
        if (min && min > value) return false
        if (max && max < value) return false
    }

    return true
}