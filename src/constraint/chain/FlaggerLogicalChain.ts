import FlaggerConstraint from "../FlaggerConstraint";

export enum ChainLogicOperator {
    AND = 'AND',
    OR = 'OR'
}

/** @internal */
export default class FlaggerLogicalChain<Item> {
    readonly #baseItem: Item;
    readonly #nextItems: [ChainLogicOperator, Item][];

    constructor(baseItem: Item) {
        this.#baseItem = baseItem;
        this.#nextItems = [];
    }

    public and(item: Item) {
        this.#nextItems.push([ChainLogicOperator.AND, item]);

        return this;
    }

    public or(item: Item) {
        this.#nextItems.push([ChainLogicOperator.OR, item]);

        return this;
    }

    public accumulate(accumulator: (item: Item) => boolean): boolean {
        let accumulation = accumulator(this.#baseItem);

        for (const [ logicalOperator, constraint ] of this.#nextItems) {
            if (logicalOperator === ChainLogicOperator.AND) {
                accumulation = accumulation && accumulator(constraint);
            }

            if (logicalOperator === ChainLogicOperator.OR) {
                accumulation = accumulation || accumulator(constraint);
            }
        }

        return accumulation;
    }

    public async accumulateAwaited(accumulator: (item: Item) => Promise<boolean>): Promise<boolean> {
        let accumulation = await accumulator(this.#baseItem);

        for (const [ logicalOperator, constraint ] of this.#nextItems) {
            if (logicalOperator === ChainLogicOperator.AND) {
                accumulation = accumulation && await accumulator(constraint);
            }

            if (logicalOperator === ChainLogicOperator.OR) {
                accumulation = accumulation || await accumulator(constraint);
            }
        }

        return accumulation;
    }
}