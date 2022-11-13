import {z} from "zod";
import FlaggerConstraint from "../FlaggerConstraint";
import FlaggerRealtimeConstraint from "../realtime/FlaggerRealtimeConstraint";

export const FlaggerConstraintDeserializerMap = z.object({
    deserialize: z.function(
        z.tuple([z.any(), ...[z.any()]], z.any()),
        z.instanceof(FlaggerConstraint).or(z.instanceof(FlaggerRealtimeConstraint))
    ),
    representativeName: z.string()
});

type FlaggerConstraintDeserializer = z.infer<typeof FlaggerConstraintDeserializerMap>;

export default FlaggerConstraintDeserializer;