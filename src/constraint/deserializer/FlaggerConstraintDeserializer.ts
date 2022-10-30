import {z} from "zod";
import FlaggerConstraint from "../FlaggerConstraint";

export const FlaggerConstraintDeserializerMap = z.object({
    deserialize: z.function(
        z.tuple([z.any(), ...[z.any()]], z.any()),
        z.instanceof(FlaggerConstraint)
    ),
    representativeName: z.string()
});

type FlaggerConstraintDeserializer = z.infer<typeof FlaggerConstraintDeserializerMap>;

export default FlaggerConstraintDeserializer;