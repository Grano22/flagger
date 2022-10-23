export default class InvalidDateFormatInString extends Error {
    constructor(sample: string) {
        super(`Invalid date format in string${sample ? " '" + sample + "'" : ''}.`);
    }
}