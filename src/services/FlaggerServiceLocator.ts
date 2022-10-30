export default class FlaggerServiceLocator {
    [key: string]: object;
    #services: Map<string, object>;

    constructor() {
        const services = new Map();
        this.#services = services;

        this.register = this.register.bind(this);

        return new Proxy(this, {
            get: function(target: FlaggerServiceLocator, prop: string) {
                if (typeof target[prop] !== 'function') {
                    return services.get(prop);
                }

                return target[prop];
            }
        });
    }

    public register(service: object, serviceName?: string) {
        this.#services.set(serviceName || service.constructor.name, service);
    }
}