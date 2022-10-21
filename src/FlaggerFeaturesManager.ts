import FlaggerConfig from "./FlaggerConfig";
import FlaggerFeatureRegistry from "./registry/FlaggerRegistry";
import FlaggerFeature from "./FlaggerFeature";
import FlaggerFeatureDeclaration from "./FlaggerFeatureDeclaration";
import {z, ZodError} from "zod";
import FlaggerFeatureStatus from "./FlaggerFeatureStatus";
import FailedToValidateConfiguration from "./exception/FailedToValidateConfiguration";
import FlaggerFeatureDetails from "./FlaggerFeatureDetails";
import FlaggerConstraint from "./constraint/FlaggerConstraint";

export default class FlaggerFeaturesManager {
    #featureRegistry: FlaggerFeatureRegistry;
    readonly #configMap: z.infer<typeof FlaggerConfig>;

    constructor(config: z.infer<typeof FlaggerConfig>) {
        this.#featureRegistry = new FlaggerFeatureRegistry();

        this.#configMap = FlaggerConfig.parse(config);
    }

    public async loadFeatures(): Promise<void>
    {
        try {
            const declaredFeatures: z.infer<typeof FlaggerFeatureDeclaration>[] = this.#configMap.features;

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
        } catch(error) {
            if (error instanceof ZodError) {
                console.error(error.message);
                throw new FailedToValidateConfiguration();
            }
        }
    }

    public isActive(featureName: string): boolean
    {
        return this.#featureRegistry.getByName(featureName)?.status === FlaggerFeatureStatus.ACTIVATED;
    }

    public getDetailsRegardingFeatures(): FlaggerFeatureDetails[]
    {
        return Array.from(this.#featureRegistry);
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