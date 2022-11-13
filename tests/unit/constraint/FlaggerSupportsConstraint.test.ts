import FlaggerSupportsConstraint from "../../../src/constraint/FlaggerSupportsConstraint";

let windowSpy: jest.SpyInstance<Partial<any>>;

beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get');
});

afterEach(() => {
    windowSpy.mockClear();
    jest.clearAllMocks();
});

describe('Test supports constraint', () => {
    it.each([
        [ 'webAuth', () => windowSpy.mockImplementationOnce(() => ({ PublicKeyCredential: {} })) ]
    ])('when several features are supported by browser', async (featureName: string, mockFeature: () => void) => {
        // Arrange
        mockFeature();
        const supportsConstraint = new FlaggerSupportsConstraint({ featureName });

        // Act
        const shouldBeActivated = await supportsConstraint.checkIfShouldBeActivated();

        // Assert
        expect(shouldBeActivated).toBeTruthy();
    });

    it.each([
        [ 'webAuth', () => windowSpy.mockImplementationOnce(() => ({ PublicKeyCredential: undefined })) ]
    ])('when several features are not supported by browser', async (featureName: string, removeFeature: () => void) => {
        // Arrange
        removeFeature();
        const supportsConstraint = new FlaggerSupportsConstraint({ featureName });

        // Act
        const shouldBeActivated = await supportsConstraint.checkIfShouldBeActivated();

        // Assert
        expect(shouldBeActivated).toBeFalsy();
    });
});