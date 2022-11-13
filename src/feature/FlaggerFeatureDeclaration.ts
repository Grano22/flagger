import {z} from 'zod';
import FlaggerActivator from "../activator/FlaggerActivator";
import FlaggerConstraint from "../constraint/FlaggerConstraint";
import FlaggerRealtimeConstraint from "../constraint/realtime/FlaggerRealtimeConstraint";
import FlaggerRealtimeConstraintCollection from "../collection/FlaggerRealtimeConstraintCollection";

const FlaggerFeatureDeclaration = z.object({
    name: z.string().min(4).max(25),
    default: z.boolean().default(false).optional(),
    version: z.string().min(1).max(10),
    hidden: z.boolean().default(false).optional(),
    description: z.string().min(5).max(250),
    tags: z.array(z.string()).optional(),
    activators: z.array(z.instanceof(FlaggerActivator)).optional(),
    constraint: z.instanceof(FlaggerConstraint).optional(),
    realtimeConstraint: z.instanceof(FlaggerRealtimeConstraintCollection).optional(),
    changeable: z.boolean().default(false).optional()
});

export type FlaggerFeatureDeclarationType = z.infer<typeof FlaggerFeatureDeclaration>;

/** @internal */
export default FlaggerFeatureDeclaration;