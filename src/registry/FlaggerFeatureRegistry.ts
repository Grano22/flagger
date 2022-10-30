import FlaggerFeature from "../feature/FlaggerFeature";
import FlaggerFeatureDetails from "../feature/FlaggerFeatureDetails";

export default class FlaggerFeatureRegistry {
    #flags: Map<string, FlaggerFeature>;

    constructor() {
        this.#flags = new Map<string, FlaggerFeature>();
    }

    public register(feature: FlaggerFeature) {
        if (this.#flags.has(feature.name)) {
            throw new Error(`Feature ${feature.name} is already registered`);
        }

        this.#flags.set(feature.name, feature);
    }

    public getByName(featureName: string): FlaggerFeature | null {
        return this.#flags.get(featureName) || null;
    }

    *[Symbol.iterator](): Generator<FlaggerFeatureDetails> {
        for (const feature of this.#flags.values()) {
            if (!feature.isHidden) {
                yield feature.getDetails();
            }
        }
    }
}