import FlaggerConstraint from "./FlaggerConstraint";
import FlaggerConstraintInterface from "./FlaggerConstraintInterface";

export enum ChainLogicOperator {
    AND = 'AND',
    OR = 'OR'
}

export default class FlaggerChainConstraint extends FlaggerConstraint implements FlaggerConstraintInterface {
    #baseConstraint: FlaggerConstraint;
    #nextConstraints: [ChainLogicOperator, FlaggerConstraint][];

    constructor(constraint: FlaggerConstraint) {
        super({});
        this.#baseConstraint = constraint;
        this.#nextConstraints = [];
    }

    public and(constraint: FlaggerConstraint) {
        this.#nextConstraints.push([ChainLogicOperator.AND, constraint]);

        return this;
    }

    public or(constraint: FlaggerConstraint) {
        this.#nextConstraints.push([ChainLogicOperator.OR, constraint]);

        return this;
    }

    async canBeActivated(): Promise<boolean> {
        let accumulation = await this.#baseConstraint.checkIfShouldBeActivated();

        for (const [ logicalOperator, constraint ] of this.#nextConstraints) {
            if (logicalOperator === ChainLogicOperator.AND) {
                accumulation = accumulation && await constraint.checkIfShouldBeActivated();
            }

            if (logicalOperator === ChainLogicOperator.OR) {
                accumulation = accumulation || await constraint.checkIfShouldBeActivated();
            }
        }

        return accumulation;
    }
}