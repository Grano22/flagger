import {z, ZodError, ZodType} from "zod";
import SupportCheckerContainsUnsupportedOption from "./exception/SupportCheckerContainsUnsupportedOption";
import UnhandledFlaggerException from "../../exception/UnhandledFlaggerException";

export default abstract class FlaggerSupportChecker<CheckerOptions extends ZodType> {
    abstract readonly name: string;
    #schema: CheckerOptions;

    protected constructor(checkerOptionsSchema: CheckerOptions) {
        this.#schema = checkerOptionsSchema;
    }

    public async supports(options: z.infer<CheckerOptions>): Promise<boolean>
    {
        try {
            const validatedOptions = this.#schema.parse(options);

            return await this.canSupportFeature(validatedOptions);
        } catch(err) {
            if (!(err instanceof ZodError)) {
                throw new UnhandledFlaggerException(err);
            }

            throw new SupportCheckerContainsUnsupportedOption(this, err.issues.at(-1)!.path.join('.'));
        }
    }

    protected abstract canSupportFeature(options: z.infer<CheckerOptions>): Promise<boolean>;
}