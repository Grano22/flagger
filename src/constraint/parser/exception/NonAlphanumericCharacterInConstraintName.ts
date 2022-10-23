export default class NonAlphanumericCharacterInConstraintName extends Error {
    constructor() {
        super('Constraint name contains invalid character');
    }

}