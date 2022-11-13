import SnapshotPersistence from "./SnapshotPersistence";
import FlaggerFeatureStatus from "../FlaggerFeatureStatus";

export interface ActivitySnapshot {
    readonly occurredAt: Date;
    readonly previousState: FlaggerFeatureStatus;
    readonly nextState: FlaggerFeatureStatus;
}

/** @internal */
export default class FeatureActivityPersistence extends SnapshotPersistence<ActivitySnapshot> {

}