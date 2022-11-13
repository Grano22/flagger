import FlaggerFeatureStatus from "../FlaggerFeatureStatus";
import FlaggerFeatureDetails from "./FlaggerFeatureDetails";
import FeatureActivityPersistence from "../persistence/FeatureActivityPersistence";

/** @internal */
export default class FlaggerFeature {
    #state: FlaggerFeatureStatus;
    readonly #hidden: boolean;
    readonly #changeable: boolean;
    #activitySnapshots: FeatureActivityPersistence;

    constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly version: string,
        hidden: boolean,
        changeable: boolean
    ) {
        this.#state = FlaggerFeatureStatus.INACTIVE;
        this.#hidden = hidden;
        this.#changeable = changeable;
        this.#activitySnapshots = new FeatureActivityPersistence();
    }

    get status() {
        return this.#state;
    }

    get isChangeable(): boolean
    {
        return this.#changeable;
    }

    get isHidden(): boolean
    {
        return this.#hidden;
    }

    public activate() {
        if (
            this.#state !== FlaggerFeatureStatus.INACTIVE &&
            this.#state !== FlaggerFeatureStatus.DEACTIVATED
        ) {
            throw new Error(`Feature status cannot be changed`);
        }

        this.#activitySnapshots.persistSnapshot({
            occurredAt: new Date(),
            previousState: this.#state,
            nextState: FlaggerFeatureStatus.ACTIVATED
        });
        this.#state = FlaggerFeatureStatus.ACTIVATED;
    }

    public deactivate() {
        if (!this.#changeable) {
            throw new Error('Feature is not changeable so it cannot be deactivated');
        }

        this.#activitySnapshots.persistSnapshot({
            occurredAt: new Date(),
            previousState: this.#state,
            nextState: FlaggerFeatureStatus.DEACTIVATED
        });
        this.#state = FlaggerFeatureStatus.DEACTIVATED;
    }

    public getDetails(): FlaggerFeatureDetails {
        return {
            name: this.name,
            description: this.description,
            version: this.version,
            status: this.status
        };
    }
}