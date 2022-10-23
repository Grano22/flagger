export default class CannotResolveConstraintDeserializableType extends Error {
    constructor(constraintRepresentation: string) {
        super(`Cannot detect constraint of type: ${constraintRepresentation}`);
    }
}