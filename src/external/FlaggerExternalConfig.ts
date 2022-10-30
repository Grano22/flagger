import {z} from "zod";
import FlaggerExternalFeatureDeclaration from "./FlaggerExternalFeatureDeclaration";

const FlaggerExternalConfig = z.object({
    features: z.array(FlaggerExternalFeatureDeclaration),
    constraintDeserializers: z.array(z.string()).optional()
});

export type FlaggerExternalManagerConfig = z.infer<typeof FlaggerExternalConfig>;

export default FlaggerExternalConfig;