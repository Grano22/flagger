import {FlaggerManagerConfig} from "./config/FlaggerConfig";
import FlaggerFeatureRegistry from "./registry/FlaggerFeatureRegistry";
import FlaggerFeature from "./feature/FlaggerFeature";
import FlaggerFeatureDeclaration from "./feature/FlaggerFeatureDeclaration";
import {z, ZodError} from "zod";
import FlaggerFeatureStatus from "./FlaggerFeatureStatus";
import FailedToValidateConfiguration from "./exception/FailedToValidateConfiguration";
import FlaggerFeatureDetails from "./feature/FlaggerFeatureDetails";
import {FlaggerExternalManagerConfig} from "./external/FlaggerExternalConfig";
import FlaggerExternalConfigDeserializer from "./external/FlaggerExternalConfigDeserializer";
import ConfigurationIsNotYetLoaded from "./exception/ConfigurationIsNotYetLoaded";
import FlaggerConfigLoader from "./config/FlaggerConfigLoader";
import FeaturesIsNotYetLoaded from "./exception/FeaturesIsNotYetLoaded";
import FlaggerOnlineConstraint from "./constraint/FlaggerOnlineConstraint";
import UnhandledFlaggerException from "./exception/UnhandledFlaggerException";
import FlaggerAddon from "./modules/FlaggerAddon";
import FlaggerServiceLocator from "./services/FlaggerServiceLocator";
import InMemoryFlaggerFeatureRepository from "./repository/InMemoryFlaggerFeatureRepository";
import FlaggerAddonRegistry from "./registry/FlaggerAddonRegistry";
import DeclaredConstraintDeserializersRegistry from "./registry/DeclaredConstraintDeserializersRegistry";
import FlaggerConstraintGenericDeserializer from "./constraint/deserializer/FlaggerConstraintGenericDeserializer";
import FlaggerConstraintDeserializer from "./constraint/deserializer/FlaggerConstraintDeserializer";
import FlaggerDateIntervalConstraintDeserializer
    from "./constraint/deserializer/FlaggerDateIntervalConstraintDeserializer";
import FlaggerRealtimeConstraintRegistry from "./registry/FlaggerRealtimeConstraintRegistry";
import FlaggerSupportsConstraintDeserializer from "./constraint/deserializer/FlaggerSupportsConstraintDeserializer";
import FlaggerWhenOnlineConstraint from "./constraint/realtime/FlaggerWhenOnlineConstraint";

export default class FlaggerFeaturesManager {
    readonly #featureRegistry: FlaggerFeatureRegistry;
    readonly #realtimeConstraintRegistry: FlaggerRealtimeConstraintRegistry;
    readonly #configLoader: FlaggerConfigLoader;
    readonly #serviceLocator: FlaggerServiceLocator;
    readonly #addons: FlaggerAddonRegistry;
    readonly #registeredConstraintDeserializers: DeclaredConstraintDeserializersRegistry;

    public static createWithInternalConfig(config: FlaggerManagerConfig) {
        return new this(config);
    }

    public async loadExternalConfig(externalConfig: FlaggerExternalManagerConfig) {
        try {
            const deserializer =
                new FlaggerExternalConfigDeserializer(this.#registeredConstraintDeserializers.getAll());
            const config = await deserializer.deserialize(externalConfig);

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
        this.#realtimeConstraintRegistry = new FlaggerRealtimeConstraintRegistry();
        this.#configLoader = new FlaggerConfigLoader();
        this.#serviceLocator = new FlaggerServiceLocator();
        this.#addons = new FlaggerAddonRegistry();

        this.#serviceLocator.register(new InMemoryFlaggerFeatureRepository(this.#featureRegistry));

        if (config !== null) {
            this.loadConfig(config);
        }

        this.#registeredConstraintDeserializers =
            new DeclaredConstraintDeserializersRegistry(this.#prepareConstraintDeserializers());
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
                    !!declaredFeatureMap.hidden,
                    !!declaredFeatureMap.changeable
                );

                if (!!declaredFeature.default) {
                    feature.activate();
                } else if (declaredFeature.constraint) {
                    if (await declaredFeature.constraint.checkIfShouldBeActivated()) {
                        feature.activate();
                    }
                }

                this.#featureRegistry.register(feature);

                for (const realtimeConstraint of declaredFeature.realtimeConstraint || []) {
                    this.#realtimeConstraintRegistry.addConstraint(feature, realtimeConstraint);
                    await realtimeConstraint.start(feature);
                }
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

    public useAddon(addon: FlaggerAddon) {
        this.#addons.register(addon);
        addon.onLoad(this.#serviceLocator);
    }

    #indicateIfManagerIsNotReady() {
        if (!this.#configLoader.isConfigMapReady) {
            throw new ConfigurationIsNotYetLoaded();
        }

        if (!this.#configLoader.isConfigPartLoaded('features')) {
            throw new FeaturesIsNotYetLoaded();
        }
    }

    #prepareConstraintDeserializers() {
        const builtIn: FlaggerConstraintDeserializer[] = [
            new FlaggerConstraintGenericDeserializer('isOnline', FlaggerOnlineConstraint),
            new FlaggerDateIntervalConstraintDeserializer(),
            new FlaggerSupportsConstraintDeserializer(),
            new FlaggerConstraintGenericDeserializer('whenOnline', FlaggerWhenOnlineConstraint)
        ];

        for (const constraintDeserializer of this.#configLoader.map?.constraintDeserializers ?? []) {
            builtIn.push(constraintDeserializer);
        }

        return builtIn;
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