import {z} from 'zod';
import FlaggerActivator from "./activator/FlaggerActivator";
import FlaggerConstraint from "./constraint/FlaggerConstraint";

const FlaggerFeatureDeclaration = z.object({
    name: z.string().min(4).max(25),
    default: z.boolean().default(false).optional(),
    version: z.string().min(1).max(10),
    hidden: z.boolean().default(false).optional(),
    description: z.string().min(5).max(250),
    tags: z.array(z.string()).optional(),
    activators: z.array(z.instanceof(FlaggerActivator)).optional(),
    constraint: z.instanceof(FlaggerConstraint).optional()
});

export default FlaggerFeatureDeclaration;