import FlaggerFeatureStatus from "./FlaggerFeatureStatus";
import FlaggerFeatureDetails from "./FlaggerFeatureDetails";

export default class FlaggerFeature {
    #state: FlaggerFeatureStatus;
    #hidden: boolean;
    #activatedAt: Date | null;

    constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly version: string,
        hidden: boolean
    ) {
        this.#state = FlaggerFeatureStatus.INACTIVE;
        this.#hidden = hidden;
        this.#activatedAt = null;
    }

    get status() {
        return this.#state;
    }

    get isHidden(): boolean
    {
        return this.#hidden;
    }

    public activate() {
        if (this.#state === FlaggerFeatureStatus.ACTIVATED) {
            throw new Error(`Feature status cannot be changed`);
        }

        this.#state = FlaggerFeatureStatus.ACTIVATED;
        this.#activatedAt = new Date();
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