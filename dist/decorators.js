export function Autobind(_1, _2, descriptor) {
    return {
        configurable: true,
        enumerable: false,
        get() {
            return descriptor.value.bind(this);
        },
    };
}
//# sourceMappingURL=decorators.js.map