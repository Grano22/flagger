import FlaggerConfig, {FlaggerManagerConfig} from "./FlaggerConfig";

interface FlaggerLoadedPartDetails {
    readonly loadedAt: Date;
    readonly partName: string;
}

export default class FlaggerConfigLoader {
    #configMap: FlaggerManagerConfig | null;
    #loadedParts: Map<string, FlaggerLoadedPartDetails>;

    get map() {
        return this.#configMap;
    }

    get isConfigMapReady() {
        return this.#configMap !== null;
    }

    constructor() {
        this.#configMap = null;
        this.#loadedParts = new Map();
    }

    public setConfigMap(config: FlaggerManagerConfig) {
        this.#configMap = Object.freeze(Object.seal(FlaggerConfig.parse(config)));
    }

    public isConfigPartLoaded(partName: string) {
        return this.#loadedParts.has(partName);
    }

    public markConfigPartAsLoaded(partName: string) {
        this.#loadedParts.set(partName, {
            partName,
            loadedAt: new Date()
        });
    }
}