import Collection from "./Collection";
import FlaggerRealtimeConstraint from "../constraint/realtime/FlaggerRealtimeConstraint";

export default class FlaggerRealtimeConstraintCollection extends Collection<FlaggerRealtimeConstraint> {
    constructor(realtimeConstraints: FlaggerRealtimeConstraint[]) {
        super(realtimeConstraints);
    }
}