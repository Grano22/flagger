export default class StorageInRegistryIsNotIterable extends Error {
    constructor() {
        super('Trying to iterate not iterable registry');
    }
}