export function validate(validation) {
    const { value } = validation;
    if (typeof value === 'string') {
        const { minLength, maxLength } = validation;
        if (minLength && minLength > value.length)
            return false;
        if (maxLength && maxLength < value.length)
            return false;
    }
    else {
        const { min, max } = validation;
        if (min && min > value)
            return false;
        if (max && max < value)
            return false;
    }
    return true;
}
//# sourceMappingURL=validations.js.map