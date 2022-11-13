import FlaggerConstraint from "./FlaggerConstraint";
import FlaggerConstraintInterface from "./FlaggerConstraintInterface";
import FlaggerSpecificSupportChecker from "../services/checker/FlaggerSpecificSupportChecker";
import {z} from "zod";
import FlaggerWebAuthSupportChecker from "../services/checker/FlaggerWebAuthSupportChecker";
import FlaggerSerializableConstraint from "./FlaggerSerializableConstraint";

const FlaggerSupportsConstraintConfig = z.object({
    featureName: z.string()
});

type FlaggerSupportsConstraintConfigType = z.infer<typeof FlaggerSupportsConstraintConfig>;

export default class FlaggerSupportsConstraint extends
    FlaggerConstraint<FlaggerSupportsConstraintConfigType>
    implements FlaggerConstraintInterface,
    FlaggerSerializableConstraint
{
    #supportChecker: FlaggerSpecificSupportChecker;

    constructor(config: FlaggerSupportsConstraintConfigType) {
        super(config, FlaggerSupportsConstraintConfig);

        this.#supportChecker = new FlaggerSpecificSupportChecker([
            new FlaggerWebAuthSupportChecker()
        ]);
    }

    public async canBeActivated(): Promise<boolean> {
        return await this.#supportChecker.supports({
            supportName: this.config.featureName
        });
    }

    serialize(): any[] {
        return [];
    }
}