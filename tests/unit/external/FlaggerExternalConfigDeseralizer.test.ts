import FlaggerExternalConfigDeserializer from "../../../src/external/FlaggerExternalConfigDeserializer";
import FlaggerChainConstraint from "../../../src/constraint/FlaggerChainConstraint";
import FlaggerDateIntervalConstraint from "../../../src/constraint/FlaggerDateIntervalConstraint";
import FlaggerOnlineConstraint from "../../../src/constraint/FlaggerOnlineConstraint";

describe('External serializer should process config in correct way', () => {
    it('When config is valid', async () => {
        // Arrange
        const
            externalConfigObj = await import('./files/flaggerConfig.json'),
            deserializer = new FlaggerExternalConfigDeserializer([
                FlaggerDateIntervalConstraint,
                FlaggerOnlineConstraint
            ]),
            expectedInternalConfig = {
                features: [
                    {
                        name: "SomeFeature",
                        description: "Some existing feature",
                        version: '0.0.1',
                        /* "betweenDate('2022-09-01', '2022-10-14') and isOnline" */
                        constraint: new FlaggerChainConstraint(
                            new FlaggerDateIntervalConstraint({
                                startDate: new Date(2022, 9, 1),
                                endDate: new Date(2022, 10, 14)
                            })
                        ).and(new FlaggerOnlineConstraint()),
                        activators:[]
                    }
                ]
            };

        // Act
        // @ts-ignore
        const internalConfig = deserializer.deserialize(externalConfigObj);

        // Assert
        expect(internalConfig).toEqual(expectedInternalConfig);
    });
});