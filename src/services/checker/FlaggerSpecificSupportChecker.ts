import FlaggerSupportChecker from "./FlaggerSupportChecker";
import {z} from "zod";

const FlaggerSpecificSupportCheckerOptions = z.object({
    supportName: z.string()
});

export default class FlaggerSpecificSupportChecker extends FlaggerSupportChecker<typeof FlaggerSpecificSupportCheckerOptions> {
    readonly name = 'specific';
    readonly #specificFeatureChecker: Map<string, FlaggerSupportChecker<any>>;

    constructor(checkers: FlaggerSupportChecker<any>[]) {
        super(FlaggerSpecificSupportCheckerOptions);
        
        this.#specificFeatureChecker = new Map(
            checkers.map(checker => [checker.name, checker])
        );
    }

    protected async canSupportFeature(options: z.infer<typeof FlaggerSpecificSupportCheckerOptions>): Promise<boolean>
    {
        const specificFeatureChecker = this.#specificFeatureChecker.get(options.supportName);

        return typeof specificFeatureChecker?.supports === 'function' ?
            await specificFeatureChecker.supports(options) :
            false;
    }
}