import {z} from "zod";
import FlaggerFeatureDeclaration from "../FlaggerFeatureDeclaration";

const FlaggerConfig = z.object({
    features: z.array(FlaggerFeatureDeclaration)
});

export type FlaggerManagerConfig = z.infer<typeof FlaggerConfig>;

export default FlaggerConfig;