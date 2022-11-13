import FlaggerExternalConfigDeserializer from "../../../src/external/FlaggerExternalConfigDeserializer";
import FlaggerChainConstraint from "../../../src/constraint/chain/FlaggerChainConstraint";
import FlaggerDateIntervalConstraint from "../../../src/constraint/FlaggerDateIntervalConstraint";
import FlaggerOnlineConstraint from "../../../src/constraint/FlaggerOnlineConstraint";
import FlaggerConstraintGenericDeserializer
    from "../../../src/constraint/deserializer/FlaggerConstraintGenericDeserializer";
import FlaggerDateIntervalConstraintDeserializer
    from "../../../src/constraint/deserializer/FlaggerDateIntervalConstraintDeserializer";
import FlaggerRealtimeConstraintCollection from "../../../src/collection/FlaggerRealtimeConstraintCollection";
import FlaggerWhenOnlineConstraint from "../../../src/constraint/realtime/FlaggerWhenOnlineConstraint";

describe('External serializer should process config in correct way', () => {
    it('When config is valid', async () => {
        // Arrange
        const
            externalConfigObj = await import('./files/flaggerConfig.json'),
            deserializer = new FlaggerExternalConfigDeserializer([
                new FlaggerDateIntervalConstraintDeserializer(),
                new FlaggerConstraintGenericDeserializer('isOnline', FlaggerOnlineConstraint),
                new FlaggerConstraintGenericDeserializer('whenOnline', FlaggerWhenOnlineConstraint)
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
                        realtimeConstraint: new FlaggerRealtimeConstraintCollection([]),
                        activators:[]
                    },
                    {
                        name: "SomeRealtimeFeature",
                        version: "0.2",
                        description: "Some realtime existing feature",
                        constraint: undefined,
                        /* "whenOnline()" */
                        realtimeConstraint: new FlaggerRealtimeConstraintCollection([
                            new FlaggerWhenOnlineConstraint()
                        ]),
                        activators: []
                    }
                ],
                constraintDeserializers: []
            };

        // Act
        const internalConfig = await deserializer.deserialize(externalConfigObj);

        // Assert
        expect(internalConfig).toEqual(expectedInternalConfig);
    });

    // @todo finish this test
    // it('When config is valid and we want to use custom deserializer which contains or, and name', async () => {
    //     // Arrange
    //     const
    //         externalConfigObj = await import('./files/flaggerConfig.json'),
    //         deserializer = new FlaggerExternalConfigDeserializer([
    //             new FlaggerDateIntervalConstraintDeserializer(),
    //             new FlaggerConstraintGenericDeserializer('isOnline', FlaggerOnlineConstraint)
    //         ]),
    //         expectedInternalConfig = {
    //             features: [
    //                 {
    //                     name: "SomeFeature",
    //                     description: "Some existing feature",
    //                     version: '0.0.1',
    //                     /* "betweenDate('2022-09-01', '2022-10-14') and isOnline" */
    //                     constraint: new FlaggerChainConstraint(
    //                         new FlaggerDateIntervalConstraint({
    //                             startDate: new Date(2022, 9, 1),
    //                             endDate: new Date(2022, 10, 14)
    //                         })
    //                     ).and(new FlaggerOnlineConstraint()),
    //                     activators:[]
    //                 }
    //             ],
    //             constraintDeserializers: []
    //         };
    //
    //     // Act
    //     const internalConfig = await deserializer.deserialize(externalConfigObj);
    //
    //     // Assert
    //     expect(internalConfig).toEqual(expectedInternalConfig);
    // });
});