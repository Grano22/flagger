import FlaggerWhenOnlineConstraint from "../../../../src/constraint/realtime/FlaggerWhenOnlineConstraint";
import FlaggerFeature from "../../../../src/feature/FlaggerFeature";
import FlaggerFeatureStatus from "../../../../src/FlaggerFeatureStatus";
import {act} from "react-dom/test-utils";

describe('Test constraint when online changes feature state correctly', () => {
    it('when feature needs to be changed one time', async () => {
        // Arrange
        jest.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(false);
        const realtimeConstraint = new FlaggerWhenOnlineConstraint();
        const exampleFeature = new FlaggerFeature(
            'test',
            '',
            '0.01',
            false,
            false
        );
        await realtimeConstraint.start(exampleFeature);
        expect(exampleFeature.status).toEqual(FlaggerFeatureStatus.INACTIVE);

        // Act
        await act(async () => {
            jest.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true);
            window.dispatchEvent(new Event('online'));
        });

        // Assert
        expect(exampleFeature.status).toEqual(FlaggerFeatureStatus.ACTIVATED);
    });
});