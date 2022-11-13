import FlaggerConstraint from "../FlaggerConstraint";
import FlaggerConstraintInterface from "../FlaggerConstraintInterface";
import FlaggerLogicalChain from "./FlaggerLogicalChain";

export default class FlaggerChainConstraint extends FlaggerConstraint implements FlaggerConstraintInterface {
    #logicalChain: FlaggerLogicalChain<FlaggerConstraint>;

    constructor(constraint: FlaggerConstraint) {
        super({});

        this.#logicalChain = new FlaggerLogicalChain<FlaggerConstraint>(constraint);
    }

    public and(constraint: FlaggerConstraint) {
        this.#logicalChain.and(constraint);

        return this;
    }

    public or(constraint: FlaggerConstraint) {
        this.#logicalChain.or(constraint);

        return this;
    }

    async canBeActivated(): Promise<boolean> {
        return await this.#logicalChain.accumulateAwaited(
            async (constraint: FlaggerConstraint) => await constraint.checkIfShouldBeActivated()
        );
    }
}