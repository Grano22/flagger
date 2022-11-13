export default class StorageInRegistryIsNotExtensible extends Error {
    constructor() {
        super('Trying to add item to not extensible registry');
    }
}