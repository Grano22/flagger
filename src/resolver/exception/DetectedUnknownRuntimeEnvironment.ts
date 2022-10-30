export default class DetectedUnknownRuntimeEnvironment extends Error {
    constructor(when: string) {
        super(`Detected unknown runtime env during: ${when}`);
    }

}