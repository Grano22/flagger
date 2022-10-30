import FlaggerServiceLocator from "../../../src/services/FlaggerServiceLocator";

class SampleService {
    example = 'sm';

    callService() {

    }
}

describe('Test basic service locator', () => {
    it('registers and returns same service correctly', () => {
        // Arrange
        const serviceLocator = new FlaggerServiceLocator(),
            sampleService = new SampleService();

        // Act
        serviceLocator.register(sampleService);

        // Assert
        expect(serviceLocator[SampleService.name]).toEqual(sampleService);
    });

    it('registers and returns destructured services', () => {
        // Arrange
        const serviceLocator = new FlaggerServiceLocator(),
            sampleServiceInstance = new SampleService();

        // Act
        serviceLocator.register(sampleServiceInstance, 'sampleService');
        const { sampleService } = serviceLocator;

        // Assert
        expect(sampleService).toEqual(sampleServiceInstance);
    });
});