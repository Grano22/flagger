import {FlaggerExternalManagerConfig} from "./FlaggerExternalConfig";
import {FlaggerManagerConfig} from "../config/FlaggerConfig";
import {FlaggerExternalFeatureDeclarationType} from "./FlaggerExternalFeatureDeclaration";
import {FlaggerFeatureDeclarationType} from "../FlaggerFeatureDeclaration";
import FlaggerChainConstraint, {ChainLogicOperator} from "../constraint/FlaggerChainConstraint";
import FlaggerConstraintRepresentationParser from "../constraint/parser/FlaggerConstraintRepresentationParser";
import FlaggerDeserializableConstraint from "../constraint/FlaggerDeserializableConstraint";
import FlaggerConstraintType from "../constraint/FlaggerConstraintType";
import CannotResolveConstraintDeserializableType from "../exception/CannotResolveConstraintDeserializableType";

export default class FlaggerExternalConfigDeserializer {
    readonly #supportedConstraints: FlaggerDeserializableConstraint[];

    constructor(supportedConstraints: FlaggerDeserializableConstraint[] = []) {
        this.#supportedConstraints = supportedConstraints;
    }

    public deserialize(externalConfig: FlaggerExternalManagerConfig): FlaggerManagerConfig {
        const internalConfig: FlaggerManagerConfig =
            Object.assign({ ...externalConfig }, { features:[] });

        for (const featureInd in externalConfig.features) {
            internalConfig.features[featureInd] = Object.assign(externalConfig.features[featureInd], {
                constraint: this.deserializeConstraint(externalConfig.features[featureInd].constraint),
                activators: []
            });
        }

        return internalConfig;
    }

    private deserializeConstraint(
        externalConstraintConfig: FlaggerExternalFeatureDeclarationType['constraint']
    ): FlaggerFeatureDeclarationType['constraint'] {
        if (typeof externalConstraintConfig !== 'string') {
            return undefined;
        }

        let constraintChain: FlaggerChainConstraint;

        const [ initialConstraintRepresentation, nextConstraintsRepresentations ] =
            this.#tokenizeConstraintStringForm(externalConstraintConfig);

        const initialConstraint = this.#resolveConstraintType(initialConstraintRepresentation);

        if (!initialConstraint) {
            throw new CannotResolveConstraintDeserializableType(initialConstraintRepresentation);
        }

        constraintChain = new FlaggerChainConstraint(initialConstraint);
        for (const [ nextConstraintOperator, nextConstraintDef ] of nextConstraintsRepresentations) {
            const nextConstraint = this.#resolveConstraintType(nextConstraintDef);

            if (!nextConstraint) {
                throw new CannotResolveConstraintDeserializableType(nextConstraintDef);
            }

            switch (nextConstraintOperator.toUpperCase()) {
                case ChainLogicOperator.AND:
                    constraintChain.and(nextConstraint);
                    break;
                case ChainLogicOperator.OR:
                    constraintChain.or(nextConstraint);
                    break;
            }
        }

        return constraintChain;
    }

    #resolveConstraintType(constraintRepresentation: string): FlaggerConstraintType | null {
        const
            parser = new FlaggerConstraintRepresentationParser(),
            { name, args } = parser.parse(constraintRepresentation);

        let constraint: FlaggerConstraintType | null = null;

        for (const supportedConstraint of this.#supportedConstraints) {
            if (supportedConstraint.representativeName === name) {
                constraint = supportedConstraint.deserialize(...args);
            }
        }

        return constraint;
    }

    #tokenizeConstraintStringForm(constraintConfig: string): [ string, [ string, string ][] ] {
        const [ firstConstraint, ...parts ] = constraintConfig.split(/(and|or)/g)
            .map(delimiter => delimiter.trimEnd().trimStart());

        const partPairs: [string, string][] = [];

        for (let partInd = 0; partInd < parts.length; partInd+=2) {
            partPairs.push([ parts[partInd], parts[partInd + 1] ]);
        }

        return [ firstConstraint, partPairs ];
    }
}