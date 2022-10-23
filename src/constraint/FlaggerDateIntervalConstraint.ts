import FlaggerActivator from "../activator/FlaggerActivator";
import FlaggerConstraintInterface from "./FlaggerConstraintInterface";
import {z} from "zod";
import FlaggerConstraint from "./FlaggerConstraint";
import FlaggerSerializableConstraint from "./FlaggerSerializableConstraint";
import InvalidDateFormatInString from "../external/deserializers/exception/InvalidDateFormatInString";

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
        let startDate = Date.parse(args[0]), endDate = Date.parse(args[1]);

        if (isNaN(startDate)) {
            throw new InvalidDateFormatInString(args[0]);
        }

        if (isNaN(endDate)) {
            throw new InvalidDateFormatInString(args[1]);
        }

        return new this({
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        });
    }

    serialize() {
        return [ this.config.startDate, this.config.endDate ];
    }
}
