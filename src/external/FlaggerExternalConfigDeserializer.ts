import FlaggerExternalConfig, {FlaggerExternalManagerConfig} from "./FlaggerExternalConfig";
import {FlaggerManagerConfig} from "../config/FlaggerConfig";
import {FlaggerExternalFeatureDeclarationType} from "./FlaggerExternalFeatureDeclaration";
import {FlaggerFeatureDeclarationType} from "../feature/FlaggerFeatureDeclaration";
import FlaggerChainConstraint, {ChainLogicOperator} from "../constraint/FlaggerChainConstraint";
import FlaggerConstraintRepresentationParser from "../constraint/parser/FlaggerConstraintRepresentationParser";
import FlaggerConstraintDeserializer, {
    FlaggerConstraintDeserializerMap
} from "../constraint/deserializer/FlaggerConstraintDeserializer";
import FlaggerConstraintType from "../constraint/FlaggerConstraintType";
import CannotResolveConstraintDeserializableType from "../exception/CannotResolveConstraintDeserializableType";
import FlaggerExternalModuleLoader from "./FlaggerExternalModuleLoader";
import ExternalModuleIsNotAValidConstraintDeserializer
    from "./deserializers/exception/ExternalModuleIsNotAValidConstraintDeserializer";
import FSPathResolver from "../resolver/FSPathResolver";

/**
 * @todo Refactor to ChainFLoggerExternalConfigDeserializer in future
 */
export default class FlaggerExternalConfigDeserializer {
    readonly #supportedConstraintDeserializers: FlaggerConstraintDeserializer[];

    constructor(supportedConstraints: FlaggerConstraintDeserializer[] = []) {
        this.#supportedConstraintDeserializers = supportedConstraints;
    }

    public async deserialize(externalConfig: FlaggerExternalManagerConfig): Promise<FlaggerManagerConfig> {
        const internalConfig: FlaggerManagerConfig =
            Object.assign(
                { ...externalConfig },
                {
                    features: [],
                    constraintDeserializers: await this.#deserializeConstraintDeclaredDeserializers(
                        externalConfig.constraintDeserializers
                    )
                }
            );

        for (const featureInd in externalConfig.features) {
            internalConfig.features[featureInd] = Object.assign(externalConfig.features[featureInd], {
                constraint: this.deserializeConstraint(externalConfig.features[featureInd].constraint),
                activators: [],
            });
        }

        return internalConfig;
    }

    async #deserializeConstraintDeclaredDeserializers(
        externalDeclaredConstraintDeserializers: FlaggerExternalManagerConfig['constraintDeserializers']
    ): Promise<FlaggerManagerConfig['constraintDeserializers']> {
        if (!externalDeclaredConstraintDeserializers) {
            return [];
        }

        const deserializers: FlaggerManagerConfig['constraintDeserializers'] = [];

        for (const externalDeclaredConstraintDeserializer of externalDeclaredConstraintDeserializers) {
            const externalModuleLoader = new FlaggerExternalModuleLoader(),
                externalModule = await externalModuleLoader.loadJSModule(externalDeclaredConstraintDeserializer);

            if (!FlaggerConstraintDeserializerMap.safeParse(externalModule).success) {
                throw new ExternalModuleIsNotAValidConstraintDeserializer(externalDeclaredConstraintDeserializer);
            }

            this.#supportedConstraintDeserializers.push(externalModule as FlaggerConstraintDeserializer);
            deserializers.push(externalModule as FlaggerConstraintDeserializer);
        }

        return deserializers;
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

        console.log(this.#supportedConstraintDeserializers);
        console.log(name);

        for (const supportedConstraint of this.#supportedConstraintDeserializers) {
            if (supportedConstraint.representativeName === name) {
                const [ firstArg, ...nextArgs ] = args;
                constraint = supportedConstraint.deserialize(firstArg, ...nextArgs) as FlaggerConstraintType;
            }
        }

        return constraint;
    }

    #tokenizeConstraintStringForm(constraintConfig: string): [ string, [ string, string ][] ] {
        const [ firstConstraint, ...parts ] = constraintConfig.split(/\s(and|or)\s/g)
            .map(delimiter => delimiter.trimEnd().trimStart());

        const partPairs: [string, string][] = [];

        for (let partInd = 0; partInd < parts.length; partInd+=2) {
            partPairs.push([ parts[partInd], parts[partInd + 1] ]);
        }

        return [ firstConstraint, partPairs ];
    }
}