import FlaggerActivator from "../activator/FlaggerActivator";
import FlaggerConstraintInterface from "./FlaggerConstraintInterface";
import {z} from "zod";
import FlaggerConstraint from "./FlaggerConstraint";

const FlaggerDateIntervalConstraintConfig = z.object({
    startDate: z.date(),
    endDate: z.date()
});

type FlaggerDateIntervalConstraintConfigType = z.infer<typeof FlaggerDateIntervalConstraintConfig>;

export default class FlaggerDateIntervalConstraint extends FlaggerConstraint<FlaggerDateIntervalConstraintConfigType> implements FlaggerConstraintInterface {
    constructor(config: z.infer<typeof FlaggerDateIntervalConstraintConfig>) {
        super(config, FlaggerDateIntervalConstraintConfig);
    }

    public async canBeActivated(): Promise<boolean> {
        const currDate = new Date();

        return currDate > this.config.startDate && currDate < this.config.endDate;
    }
}
