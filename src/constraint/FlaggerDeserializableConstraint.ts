import FlaggerConstraintType from "./FlaggerConstraintType";

export default interface FlaggerDeserializableConstraint {
    readonly representativeName: string;

    deserialize(...args: any[]): FlaggerConstraintType;
}