import FlaggerFeaturesManager from "../../src/FlaggerFeaturesManager";
import FlaggerOnlineConstraint from "../../src/constraint/FlaggerOnlineConstraint";

describe('Flagger features manager test', () => {
    it('All features should be loaded successfully', async () => {
        // Arrange
        const featureManagerConfig = {
            features: [
                {
                    name: 'TestFeature1',
                    description: 'Test feature 1',
                    version: '1.0'
                },
                {
                    name: 'TestFeature2',
                    description: 'Test feature 2',
                    version: '1.1',
                    hidden: false
                },
                {
                    name: 'TestFeature3',
                    description: 'Test feature 3',
                    version: '0.4',
                    hidden: true
                }
            ]
        };
        const featureManager = new FlaggerFeaturesManager(featureManagerConfig);

        // Act
        await featureManager.loadFeatures();

        // Assert
        expect(featureManager.getDetailsRegardingFeatures()).toEqual([
            {
                name: 'TestFeature1',
                description: 'Test feature 1',
                version: '1.0',
                status: 'INACTIVE'
            },
            {
                name: 'TestFeature2',
                version: '1.1',
                description: 'Test feature 2',
                status: 'INACTIVE'
            }
        ]);
    });


    it('Check that all features are active which should be', async () => {
        // Arrange
        jest.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true);
        const featureManagerConfig = {
            features: [
                {
                    name: 'TestFeature1',
                    description: 'Test feature 1',
                    version: '1.0',
                    default: true
                },
                {
                    name: 'TestFeature2',
                    description: 'Test feature 2',
                    version: '1.1',
                    hidden: false,
                    constraint: new FlaggerOnlineConstraint()
                },
                {
                    name: 'TestFeature3',
                    description: 'Test feature 3',
                    version: '0.4',
                    hidden: true
                }
            ]
        };
        const featureManager = new FlaggerFeaturesManager(featureManagerConfig);

        // Act
        await featureManager.loadFeatures();

        // Assert
        expect(featureManager.isActive('TestFeature1')).toBeTruthy();
        expect(featureManager.isActive('TestFeature2')).toBeTruthy();
        expect(featureManager.isActive('TestFeature3')).toBeFalsy();
    });
});