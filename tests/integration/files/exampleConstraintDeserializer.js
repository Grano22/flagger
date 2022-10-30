'use strict'

module.exports = {
    representativeName: 'importedDeserializer',

    deserialize(sm) {
        return new global.FlaggerCustomConstraint({
            checker: async () => sm === 'aw'
        });
    }
};