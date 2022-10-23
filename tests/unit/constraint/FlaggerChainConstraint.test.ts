import FlaggerChainConstraint from "../../../src/constraint/FlaggerChainConstraint";
import FlaggerOnlineConstraint from "../../../src/constraint/FlaggerOnlineConstraint";
import FlaggerDateIntervalConstraint from "../../../src/constraint/FlaggerDateIntervalConstraint";

describe('Test flagger constraints with chain', () => {
    it('Check complex chain will be true', async () => {
        // Arrange
        jest.spyOn(window.navigator, 'onLine', 'get').mockReturnValue(true);
        jest
            .useFakeTimers()
            .setSystemTime(new Date('2012-01-01'));
        const date1 = new Date(2010, 6, 17),
            date2 = new Date(2013, 12, 18);
        const flagChainConstraint = new FlaggerChainConstraint(new FlaggerOnlineConstraint())
            .and(new FlaggerDateIntervalConstraint(
                {
                    startDate: date1,
                    endDate: date2
                }
            ));

        // Act && Assert
        expect(await flagChainConstraint.checkIfShouldBeActivated()).toBeTruthy();
    });
});