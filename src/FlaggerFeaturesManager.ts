import FlaggerConfig, {FlaggerManagerConfig} from "./config/FlaggerConfig";
import FlaggerFeatureRegistry from "./registry/FlaggerRegistry";
import FlaggerFeature from "./FlaggerFeature";
import FlaggerFeatureDeclaration from "./FlaggerFeatureDeclaration";
import {z, ZodError} from "zod";
import FlaggerFeatureStatus from "./FlaggerFeatureStatus";
import FailedToValidateConfiguration from "./exception/FailedToValidateConfiguration";
import FlaggerFeatureDetails from "./FlaggerFeatureDetails";
import FlaggerConstraint from "./constraint/FlaggerConstraint";
import FlaggerExternalConfig, {FlaggerExternalManagerConfig} from "./external/FlaggerExternalConfig";
import FlaggerExternalConfigDeserializer from "./external/FlaggerExternalConfigDeserializer";
import ConfigurationIsNotYetLoaded from "./exception/ConfigurationIsNotYetLoaded";
import FlaggerConfigLoader from "./config/FlaggerConfigLoader";
import FeaturesIsNotYetLoaded from "./exception/FeaturesIsNotYetLoaded";
import FlaggerOnlineConstraint from "./constraint/FlaggerOnlineConstraint";
import FlaggerDateIntervalConstraint from "./constraint/FlaggerDateIntervalConstraint";
import FlaggerConstraintInterface from "./constraint/FlaggerConstraintInterface";
import UnhandledFlaggerException from "./exception/UnhandledFlaggerException";

export default class FlaggerFeaturesManager {
    #featureRegistry: FlaggerFeatureRegistry;
    #configLoader: FlaggerConfigLoader;
    #supportedConstraints: Array<new (...args: any[]) => FlaggerConstraintInterface> = [];

    public static createWithInternalConfig(config: FlaggerManagerConfig) {
        return new this(config);
    }

    public loadExternalConfig(externalConfig: FlaggerExternalManagerConfig) {
        try {
            const deserializer = new FlaggerExternalConfigDeserializer();
            const config = deserializer.deserialize(externalConfig);

            this.loadConfig(config);
        } catch(error) {
            if (error instanceof ZodError) {
                throw FailedToValidateConfiguration.fromZodError(error);
            }

            throw new UnhandledFlaggerException(error);
        }
    }

    constructor(config: FlaggerManagerConfig | null = null) {
        this.#featureRegistry = new FlaggerFeatureRegistry();
        this.#configLoader = new FlaggerConfigLoader();
        this.#supportedConstraints = [
            FlaggerOnlineConstraint,
            FlaggerDateIntervalConstraint
        ];

        if (config !== null) {
            this.loadConfig(config);
        }
    }

    public loadConfig(config: FlaggerManagerConfig) {
        this.#configLoader.setConfigMap(config);
    }

    public async loadFeatures(): Promise<void>
    {
        if (!this.#configLoader.isConfigMapReady) {
            throw new ConfigurationIsNotYetLoaded();
        }

        try {
            const declaredFeatures: z.infer<typeof FlaggerFeatureDeclaration>[] = this.#configLoader.map!.features;

            for (const declaredFeature of declaredFeatures) {
                const declaredFeatureMap = FlaggerFeatureDeclaration.parse(declaredFeature),
                feature = new FlaggerFeature(
                    declaredFeatureMap.name,
                    declaredFeatureMap.description,
                    declaredFeatureMap.version,
                    !!declaredFeatureMap.hidden
                );

                if (!!declaredFeature.default) {
                    feature.activate();
                } else {
                    if (declaredFeature.constraint instanceof FlaggerConstraint) {
                        if (await declaredFeature.constraint.checkIfShouldBeActivated()) {
                            feature.activate();
                        }
                    }
                }

                this.#featureRegistry.register(feature);
            }

            this.#configLoader.markConfigPartAsLoaded('features');
        } catch(error) {
            if (error instanceof ZodError) {
                throw FailedToValidateConfiguration.fromZodError(error);
            }

            throw new UnhandledFlaggerException(error);
        }
    }

    public isActive(featureName: string): boolean
    {
        this.#indicateIfManagerIsNotReady();

        return this.#featureRegistry.getByName(featureName)?.status === FlaggerFeatureStatus.ACTIVATED;
    }

    public getDetailsRegardingFeatures(): FlaggerFeatureDetails[]
    {
        return Array.from(this.#featureRegistry);
    }

    #indicateIfManagerIsNotReady() {
        if (!this.#configLoader.isConfigMapReady) {
            throw new ConfigurationIsNotYetLoaded();
        }

        if (!this.#configLoader.isConfigPartLoaded('features')) {
            throw new FeaturesIsNotYetLoaded();
        }
    }

    #registerActivators() {
        // if (Array.isArray(declaredFeature.activators)) {
        //     for (const activator of declaredFeature.activators) {
        //         if (await activator.checkIfShouldBeActivated()) {
        //             feature.activate();
        //         }
        //     }
        // }
    }
}