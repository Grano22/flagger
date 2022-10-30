import Registry from "./Registry";
import FlaggerConstraintDeserializer from "../constraint/deserializer/FlaggerConstraintDeserializer";

export default class DeclaredConstraintDeserializersRegistry extends Registry<FlaggerConstraintDeserializer> {
    constructor(initialValues: FlaggerConstraintDeserializer[]) {
        super(
            {},
            Object.fromEntries(
                initialValues.map(
                    (deserializer: FlaggerConstraintDeserializer) => [ deserializer.representativeName, deserializer ]
                )
            )
        );
    }

    public getAll(): FlaggerConstraintDeserializer[]
    {
        return this.getValues();
    }
}