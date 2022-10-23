import {ZodError} from "zod";

export default class FailedToValidateConfiguration extends Error {
    public static fromZodError(validationError: ZodError) {
        return new this(validationError.errors.map(error => error.message).join("\n"));
    }
}