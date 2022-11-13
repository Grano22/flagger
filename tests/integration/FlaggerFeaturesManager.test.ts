import FlaggerFeaturesManager from "../../src/FlaggerFeaturesManager";
import FlaggerOnlineConstraint from "../../src/constraint/FlaggerOnlineConstraint";
const fs = require('fs');
//import fs from 'fs';
import util from 'util';
import { dirname } from 'path';
//import path, { fileURLToPath } from 'url';
const path = require('path');
import {FlaggerManagerConfig} from "../../src/config/FlaggerConfig";
import FlaggerConstraintDeserializer from "../../src/constraint/deserializer/FlaggerConstraintDeserializer";
import FlaggerCustomConstraint from "../../src/constraint/FlaggerCustomConstraint";
import FlaggerWhenOnlineConstraint from "../../src/constraint/realtime/FlaggerWhenOnlineConstraint";
import FlaggerRealtimeConstraintCollection from "../../src/collection/FlaggerRealtimeConstraintCollection";

//const __dirname = dirname(fileURLToPath(import.meta.url));

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
        const customConstraintDeserializer = new class implements FlaggerConstraintDeserializer {
            representativeName = 'exampleDeserializer';

            deserialize(prefix: string, sm: string): FlaggerCustomConstraint {
                return new FlaggerCustomConstraint({
                    checker: async () => prefix === 'lmp'
                });
            }
        };

        jest.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true);
        const featureManagerConfig: FlaggerManagerConfig = {
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
                },
                {
                    name: 'TestFeature4',
                    description: 'Test feature with realtime constraint',
                    version: '0.128',
                    realtimeConstraint: new FlaggerRealtimeConstraintCollection([
                        new FlaggerWhenOnlineConstraint()
                    ])
                }
            ],
            constraintDeserializers: [
                customConstraintDeserializer
            ]
        };
        const featureManager = new FlaggerFeaturesManager(featureManagerConfig);

        // Act
        await featureManager.loadFeatures();

        // Assert
        expect(featureManager.isActive('TestFeature1')).toBeTruthy();
        expect(featureManager.isActive('TestFeature2')).toBeTruthy();
        expect(featureManager.isActive('TestFeature3')).toBeFalsy();
        expect(featureManager.isActive('TestFeature4')).toBeTruthy();
    });

    it('Managers works as expected with external config', async () => {
        // Arrange
        (global as any).FlaggerCustomConstraint = FlaggerCustomConstraint;
        jest.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true);
        const featureManager = new FlaggerFeaturesManager();
        await featureManager.loadExternalConfig(
            JSON.parse(
                await fs.promises.readFile(
                    path.resolve(__dirname, 'files', 'externalFlaggerConfig.json'),
                    'utf8'
                )
            )
        );

        // Act
        await featureManager.loadFeatures();

        // Assert
        expect(featureManager.isActive('TestFeature1')).toBeTruthy();
        expect(featureManager.isActive('TestFeature2')).toBeTruthy();
        expect(featureManager.isActive('TestFeature3')).toBeFalsy();
        expect(featureManager.isActive('TestFeature4')).toBeTruthy();
        expect(featureManager.isActive('TestFeature5')).toBeTruthy();
    });
});