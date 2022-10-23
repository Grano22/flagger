import FlaggerActivator from "../activator/FlaggerActivator";
import FlaggerConstraintInterface from "./FlaggerConstraintInterface";
import {z} from "zod";
import FlaggerConstraint from "./FlaggerConstraint";
import FlaggerSerializableConstraint from "./FlaggerSerializableConstraint";

const FlaggerDateIntervalConstraintConfig = z.object({
    startDate: z.date(),
    endDate: z.date()
});

type FlaggerDateIntervalConstraintConfigType = z.infer<typeof FlaggerDateIntervalConstraintConfig>;

export default class FlaggerDateIntervalConstraint
    extends FlaggerConstraint<FlaggerDateIntervalConstraintConfigType>
    implements FlaggerConstraintInterface,
    FlaggerSerializableConstraint
{
    static readonly representativeName = 'betweenDate';

    constructor(config: z.infer<typeof FlaggerDateIntervalConstraintConfig>) {
        super(config, FlaggerDateIntervalConstraintConfig);
    }

    public async canBeActivated(): Promise<boolean> {
        const currDate = new Date();

        return currDate > this.config.startDate && currDate < this.config.endDate;
    }

    static deserialize(...args: any[]): FlaggerDateIntervalConstraint {
        return new this({
            startDate: args[0],
            endDate: args[1]
        });
    }

    serialize() {
        return [ this.config.startDate, this.config.endDate ];
    }
}
