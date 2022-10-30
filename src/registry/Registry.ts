import StorageInRegistryIsNotReadable from "./exception/StorageInRegistryIsNotReadable";
import StorageInRegistryIsNotShrinkable from "./exception/StorageInRegistryIsNotShrinkable";
import StorageInRegistryIsNotIterable from "./exception/StorageInRegistryIsNotIterable";

interface RegistryConfig {
    readonly isReadable?: boolean;
    readonly isExtensible?: boolean;
    readonly isShrinkable?: boolean;
    readonly isIterable?: boolean;
}

export default abstract class Registry<RValue, RKey extends string | number | symbol = string> {
    readonly #registryStorage: Map<RKey, RValue>;
    readonly #registryConfig: RegistryConfig;

    protected constructor(config: RegistryConfig, initialValues: Partial<Record<RKey, RValue>> = {}) {
        this.#registryStorage =
            new Map<RKey, RValue>(Object.entries(initialValues) as Iterable<readonly [RKey, RValue]>);
        this.#registryConfig = Object.freeze(
            Object.seal(
                Object.assign(
                    {
                        isReadable: true,
                        isExtensible: true,
                        isShrinkable: true,
                        isIterable: true
                    },
                    config
                )
            )
        );
    }

    protected getByKey(key: RKey): RValue | null
    {
        if (!this.#registryConfig.isReadable) {
            throw new StorageInRegistryIsNotReadable();
        }

        return this.#registryStorage.get(key) || null;
    }

    protected removeByKey(key: RKey): boolean
    {
        if (!this.#registryConfig.isShrinkable) {
            throw new StorageInRegistryIsNotShrinkable();
        }

        return this.#registryStorage.delete(key);
    }

    protected getValues(): RValue[]
    {
        if (!this.#registryConfig.isIterable) {
            throw new StorageInRegistryIsNotIterable();
        }

        return Array.from(this.#registryStorage.values());
    }

    protected getIterator(): IterableIterator<[RKey,RValue]>
    {
        if (!this.#registryConfig.isIterable) {
            throw new StorageInRegistryIsNotIterable();
        }

        return this.#registryStorage.entries();
    }
}