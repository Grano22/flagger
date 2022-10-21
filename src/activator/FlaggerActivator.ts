import {ZodType} from "zod";
import FlaggerConstraintInterface from "../constraint/FlaggerConstraintInterface";

export default class FlaggerActivator<FlaggerActivatorConfigType> {
    #config: FlaggerActivatorConfigType | Record<string, any>;

    constructor(config: Record<string, any>, configSchema: ZodType | null) {
        if (config instanceof ZodType) {
            this.#config = configSchema!.parse(config);
        }

        this.#config = config;
    }

    public async checkIfShouldBeActivated(): Promise<boolean> {
        if (typeof (this as typeof this & FlaggerConstraintInterface).canBeActivated !== 'function') {
            throw new Error('Flagger activator must implement FlaggerConstraintInterface');
        }

        return (this as typeof this & FlaggerConstraintInterface).canBeActivated();
    }

    protected get config(): FlaggerActivatorConfigType | Record<string, any>
    {
        return this.#config;
    }
}