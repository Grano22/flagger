import {ZodType} from "zod";
import FlaggerConstraintInterface from "./FlaggerConstraintInterface";

export default class FlaggerConstraint<FlaggerConstraintConfigType = {}> {
    #config: FlaggerConstraintConfigType | Record<string, any>;

    constructor(config: Record<string, any> = {}, configSchema: ZodType | null = null) {
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

    protected get config(): FlaggerConstraintConfigType | Record<string, any>
    {
        return this.#config;
    }
}