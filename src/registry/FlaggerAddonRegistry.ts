import FlaggerAddon from "../modules/FlaggerAddon";

export default class FlaggerAddonRegistry {
    #addons: Map<string, FlaggerAddon>;

    constructor() {
        this.#addons = new Map<string, FlaggerAddon>();
    }

    public register(addon: FlaggerAddon) {
        if (this.#addons.has(addon.name)) {
            throw new Error(`Addon ${addon.name} is already registered`);
        }

        this.#addons.set(addon.name, addon);
    }
}