import {ZodType} from "zod";
import CannotLoadExternalModule from "./deserializers/exception/CannotLoadExternalModule";
import FSPathResolver from "../resolver/FSPathResolver";
import * as process from "process";

/** @internal */
export default class FlaggerExternalModuleLoader<ModuleType> {
    #loadedModule: null | ModuleType = null;
    readonly #pathResolver: FSPathResolver;
    readonly #basePath: string;

    constructor(basePath = '') {
        this.#pathResolver = new FSPathResolver();
        this.#basePath = basePath;
    }

    public async loadJSModule(src: string): Promise<ModuleType>
    {
        const targetPath = this.#pathResolver.resolveRelativeToRootScript(src);

        try {
            if (this.#loadedModule !== null) {
                return this.#loadedModule;
            }

            this.#loadedModule =
                (
                    /*typeof require === 'function' ?
                        require(targetPath) :*/
                        await import(targetPath)
                ) as ModuleType;

            return this.#loadedModule;
        } catch(err) {
            throw new CannotLoadExternalModule(targetPath);
        }
    }
}