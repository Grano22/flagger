import {z} from "zod";
import FlaggerFeatureDeclaration from "../FlaggerFeatureDeclaration";
import FlaggerExternalFeatureDeclaration from "./FlaggerExternalFeatureDeclaration";

const FlaggerExternalConfig = z.object({
    features: z.array(FlaggerExternalFeatureDeclaration)
});

export type FlaggerExternalManagerConfig = z.infer<typeof FlaggerExternalConfig>;

export default FlaggerExternalConfig;