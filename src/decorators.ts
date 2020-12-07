namespace App {
    export function Autobind(
        _1: any,
        _2: string,
        descriptor: PropertyDescriptor,
    ): PropertyDescriptor {
        return {
            configurable: true,
            enumerable: false,
            get() {
                return descriptor.value.bind(this)
            },
        } as PropertyDescriptor
    }
}