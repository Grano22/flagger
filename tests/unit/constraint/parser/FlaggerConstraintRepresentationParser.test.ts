import FlaggerConstraintRepresentationParser
    from "../../../../src/constraint/parser/FlaggerConstraintRepresentationParser";
import AdditionalCharactersAfterClosingBracket
    from "../../../../src/constraint/parser/exception/AdditionalCharactersAfterClosingBracket";
import NonAlphanumericCharacterInConstraintName
    from "../../../../src/constraint/parser/exception/NonAlphanumericCharacterInConstraintName";

describe('Flagger constraint parser works as expected', () => {
    // Global arrange
    const flaggerConstraintRepresentationParser = new FlaggerConstraintRepresentationParser();

    it('and returns valid name only', () => {
        // Act
        const result = flaggerConstraintRepresentationParser.parse('isOnline');

        // Assert
        expect(result).toEqual({ name: 'isOnline', args: [] });
    });

    it('and returns valid name only when name contains brackets', () => {
        // Act
        const result = flaggerConstraintRepresentationParser.parse('isOnline()');

        // Assert
        expect(result).toEqual({ name: 'isOnline', args: [] });
    });

    it('and returns valid name with valid arguments list', () => {
        // Act
        const result =
            flaggerConstraintRepresentationParser.parse("isDateBetween('testArg1', '2019-08-12')");

        // Assert
        expect(result).toEqual({ name: 'isDateBetween', args: [ 'testArg1', '2019-08-12' ] });
    });

    it('and returns valid name with valid arguments list also ignores resetting name', () => {
        // Act
        const result =
            flaggerConstraintRepresentationParser.parse("isDateBetween('someDay') ");

        // Assert
        expect(result).toEqual({ name: 'isDateBetween', args: [ 'someDay' ] });
    });

    it('and throws error when constraint name contains not alphanumeric character', () => {
        // Act && Assert
        expect(() => flaggerConstraintRepresentationParser.parse("invalid#('cos')"))
            .toThrow(new NonAlphanumericCharacterInConstraintName());
    });

    it('and throws error when code is ended with text after closing bracket', () => {
       // Act && Assert
        expect(() => flaggerConstraintRepresentationParser.parse("isDateBetween('cos'))"))
            .toThrow(new AdditionalCharactersAfterClosingBracket());
    });
});