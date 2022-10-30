import {z} from "zod";
import FlaggerFeatureDeclaration from "../feature/FlaggerFeatureDeclaration";
import {FlaggerConstraintDeserializerMap} from "../constraint/deserializer/FlaggerConstraintDeserializer";

const FlaggerConfig = z.object({
    features: z.array(FlaggerFeatureDeclaration),
    constraintDeserializers: z.array(FlaggerConstraintDeserializerMap).optional()
});

export type FlaggerManagerConfig = z.infer<typeof FlaggerConfig>;

export default FlaggerConfig;