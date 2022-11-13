import FlaggerConstraintDeserializer from "./FlaggerConstraintDeserializer";
import FlaggerConstraintType from "../FlaggerConstraintType";
import FlaggerRealtimeConstraint from "../realtime/FlaggerRealtimeConstraint";

export default class FlaggerConstraintGenericDeserializer<FlaggerConstraintDeserializerType extends FlaggerConstraintType | FlaggerRealtimeConstraint> implements FlaggerConstraintDeserializer {
    readonly representativeName: string;
    #targetConstraintClass: new (...args: any[]) => FlaggerConstraintDeserializerType;

    constructor(representativeName: string, representativeClass: new (...args: any[]) => FlaggerConstraintDeserializerType) {
        this.representativeName = representativeName;
        this.#targetConstraintClass = representativeClass;
    }

    public deserialize(): FlaggerConstraintDeserializerType {
        return new this.#targetConstraintClass();
    }
}