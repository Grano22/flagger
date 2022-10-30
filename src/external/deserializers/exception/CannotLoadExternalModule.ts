export default class CannotLoadExternalModule extends Error {
    constructor(moduleSrc: string) {
        super(`Cannot load external module from source: ${moduleSrc}`);
    }

}