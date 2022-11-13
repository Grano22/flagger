/** @internal */
export default abstract class SnapshotPersistence<SnapshotType> {
    #snapshots: Set<SnapshotType>;

    constructor() {
        this.#snapshots = new Set();
    }

    public persistSnapshot(snap: SnapshotType): void {
        this.#snapshots.add(Object.assign({}, snap));
    }

    public queryByParams(params: Partial<SnapshotType>): SnapshotType[] {
        const queried: SnapshotType[] = [];

        for (const snap of this.#snapshots.values()) {
            let isMatched = true;

            for (const paramName in params) {
                if (params[paramName] !== snap[paramName]) {
                    isMatched = false;
                    break;
                }
            }

            if (isMatched) {
                queried.push({ ...snap });
            }
        }

        return queried;
    }
}