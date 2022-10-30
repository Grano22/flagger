import FlaggerConstraintDeserializer from "./FlaggerConstraintDeserializer";
import InvalidDateFormatInString from "../../external/deserializers/exception/InvalidDateFormatInString";
import FlaggerDateIntervalConstraint from "../FlaggerDateIntervalConstraint";

export default class FlaggerDateIntervalConstraintDeserializer implements FlaggerConstraintDeserializer {
    readonly representativeName = 'betweenDate';

    deserialize(...args: any[]): FlaggerDateIntervalConstraint {
        let startDate = Date.parse(args[0]), endDate = Date.parse(args[1]);

        if (isNaN(startDate)) {
            throw new InvalidDateFormatInString(args[0]);
        }

        if (isNaN(endDate)) {
            throw new InvalidDateFormatInString(args[1]);
        }

        return new FlaggerDateIntervalConstraint({
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        });
    }
}