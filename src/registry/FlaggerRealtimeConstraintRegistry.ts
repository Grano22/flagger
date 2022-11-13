import Registry from "./Registry";
import FlaggerRealtimeConstraint from "../constraint/realtime/FlaggerRealtimeConstraint";
import FlaggerFeature from "../feature/FlaggerFeature";

export default class FlaggerRealtimeConstraintRegistry extends Registry<FlaggerRealtimeConstraint[]> {
    constructor(initialValues: Record<string, FlaggerRealtimeConstraint[]> = {}) {
        super(
            {},
            initialValues
        );
    }

    public getByFeature(feature: FlaggerFeature): FlaggerRealtimeConstraint[]
    {
        return this.getByKey(feature.name) || [];
    }

    public addConstraint(feature: FlaggerFeature, constraint: FlaggerRealtimeConstraint): void
    {
        this.setValue(feature.name, [...this.getByFeature(feature), constraint]);
    }
}