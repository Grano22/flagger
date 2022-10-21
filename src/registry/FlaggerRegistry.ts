import FlaggerFeature from "../FlaggerFeature";
import FlaggerFeatureDetails from "../FlaggerFeatureDetails";

export default class FlaggerRegistry {
    #flags: Map<string, FlaggerFeature>;

    constructor() {
        this.#flags = new Map<string, FlaggerFeature>();
    }

    register(feature: FlaggerFeature) {
        if (this.#flags.has(feature.name)) {
            throw new Error(`Feature ${feature.name} already registered`);
        }

        this.#flags.set(feature.name, feature);
    }

    getByName(featureName: string): FlaggerFeature | null {
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