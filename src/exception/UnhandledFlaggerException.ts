export default class UnhandledFlaggerException extends Error {
    constructor(unhandledException: unknown) {
        const previousError: Error = unhandledException instanceof Error ?
            unhandledException :
            new Error(String(unhandledException));

        super(
            `Unhandled flagger exception occurred, message of type ${previousError.name}: ${previousError.message}, check cause for more details`,
            { cause: previousError }
        );
    }
}