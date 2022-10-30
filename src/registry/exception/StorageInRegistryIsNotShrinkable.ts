export default class StorageInRegistryIsNotShrinkable extends Error {
    constructor() {
        super('Cannot remove entry from registry because is not shrinkable');
    }

}