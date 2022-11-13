import FlaggerConstraintDeserializer from "./FlaggerConstraintDeserializer";
import FlaggerSupportsConstraint from "../FlaggerSupportsConstraint";

export default class FlaggerSupportsConstraintDeserializer implements FlaggerConstraintDeserializer {
    readonly representativeName = 'supports';

    deserialize(...args: any[]): FlaggerSupportsConstraint {
        const featureName = String(args[0]);

        return new FlaggerSupportsConstraint({ featureName });
    }
}