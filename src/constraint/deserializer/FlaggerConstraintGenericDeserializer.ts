import FlaggerConstraintDeserializer from "./FlaggerConstraintDeserializer";
import FlaggerConstraintType from "../FlaggerConstraintType";

export default class FlaggerConstraintGenericDeserializer<FlaggerConstraintDeserializerType extends FlaggerConstraintType> implements FlaggerConstraintDeserializer {
    readonly representativeName: string;
    #targetConstraintClass: new (...args: any[]) => FlaggerConstraintDeserializerType;

    constructor(representativeName: string, representativeClass: new (...args: any[]) => FlaggerConstraintDeserializerType) {
        this.representativeName = representativeName;
        this.#targetConstraintClass = representativeClass;
    }

    deserialize(): FlaggerConstraintDeserializerType {
        return new this.#targetConstraintClass();
    }
}