import FlaggerCustomConstraint from "../../../src/constraint/FlaggerCustomConstraint";

describe('Custom Constraint works as expected', () => {
    it('Custom contraint passes in async way', async () => {
        // Arrange
        const flaggerCustomConstraint = new FlaggerCustomConstraint({
            checker: async () => true
        });

        // Act
        const result = await flaggerCustomConstraint.checkIfShouldBeActivated();

        // Assert
        expect(result).toBeTruthy();
    });
});