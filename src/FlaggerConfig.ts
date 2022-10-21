import {z} from "zod";
import FlaggerFeatureDeclaration from "./FlaggerFeatureDeclaration";

const FlaggerConfig = z.object({
    features: z.array(FlaggerFeatureDeclaration)
});

export default FlaggerConfig;