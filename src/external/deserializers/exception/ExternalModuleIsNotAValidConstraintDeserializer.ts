export default class ExternalModuleIsNotAValidConstraintDeserializer extends Error {
    constructor(externalModuleSrc: string) {
        super(`External module ${externalModuleSrc} is not a valid constraint deserializer`);
    }
}