export default class AdditionalCharactersAfterClosingBracket extends Error {
    constructor() {
        super('Additional character detected after closing bracket');
    }
}