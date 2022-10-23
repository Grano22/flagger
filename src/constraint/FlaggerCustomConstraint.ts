import FlaggerConstraint from "./FlaggerConstraint";
import FlaggerConstraintInterface from "./FlaggerConstraintInterface";
import {boolean, promise, z} from "zod";

const FlaggerCustomConstraintConfig = z.object({
    checker: z.function().returns(promise(boolean()))
});

type FlaggerCustomConstraintConfigType = z.infer<typeof FlaggerCustomConstraintConfig>;

export default class FlaggerCustomConstraint extends FlaggerConstraint<FlaggerCustomConstraintConfigType> implements FlaggerConstraintInterface {
    constructor(config: FlaggerCustomConstraintConfigType) {
        super(config, FlaggerCustomConstraintConfig);
    }

    async canBeActivated(): Promise<boolean> {
        return await this.config.checker();
    }
}