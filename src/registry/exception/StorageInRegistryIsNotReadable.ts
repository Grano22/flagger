export default class StorageInRegistryIsNotReadable extends Error {
    constructor() {
        super('Trying to read not readable registry');
    }
}