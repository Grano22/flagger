export default abstract class Collection<T> {
    #items: Set<T>;

    get length(): number
    {
        return this.#items.size;
    }

    protected constructor(initialItems: T[]) {
        this.#items = new Set(initialItems);
    }

    public add(item: T): this {
        // @ts-ignore
        return new this.constructor([...this.#items.values(), item]);
    }

    public getIterator(): Iterable<T>
    {
        return this.#items.values();
    }

    public getFirst(): T | null
    {
        return Array.from(this.#items.values())[0];
    }

    public getLast(): T | null
    {
        return Array.from(this.#items.values())[this.#items.size];
    }

    *[Symbol.iterator](): Iterator<T> {
        for (const item of this.getIterator()) {
            yield item;
        }
    }
}