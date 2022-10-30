import {z} from "zod";
import FlaggerFeatureDeclaration from "../feature/FlaggerFeatureDeclaration";

const FlaggerExternalFeatureDeclaration = FlaggerFeatureDeclaration.extend({
    activators: z.array(z.string()).optional(),
    constraint: z.string().optional()
});

export type FlaggerExternalFeatureDeclarationType = z.infer<typeof FlaggerExternalFeatureDeclaration>;

export default FlaggerExternalFeatureDeclaration;