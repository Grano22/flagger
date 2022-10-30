import FlaggerFeatureRegistry from "../registry/FlaggerFeatureRegistry";
import FlaggerFeature from "../feature/FlaggerFeature";

export default class InMemoryFlaggerFeatureRepository {
    readonly #registry: FlaggerFeatureRegistry;

    constructor(registry: FlaggerFeatureRegistry) {
        this.#registry = registry;
    }

    public getByName(featureName: string): FlaggerFeature | null
    {
        return this.#registry.getByName(featureName);
    }
}