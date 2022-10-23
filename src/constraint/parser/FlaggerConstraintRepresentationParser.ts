import AdditionalCharactersAfterClosingBracket from "./exception/AdditionalCharactersAfterClosingBracket";
import NonAlphanumericCharacterInConstraintName from "./exception/NonAlphanumericCharacterInConstraintName";

export interface FlaggerConstraintParsedRepresentation {
    readonly name: string;
    readonly args: string[];
}

export default class FlaggerConstraintRepresentationParser {
    public parse(constraintRepresentation: string): FlaggerConstraintParsedRepresentation {
        let parseLevel = 0, args = [], name: string = '', glue = '';

        for (let i = 0; i < constraintRepresentation.length; i++) {
            const charFromStr = constraintRepresentation.charAt(i);

            if (parseLevel === 0) {
                if (charFromStr === '(') {
                    parseLevel = 1;
                    name = glue;
                    glue = '';

                    continue;
                }

                if (!this.#isOnlyAlphanumericCharacter(charFromStr)) {
                    throw new NonAlphanumericCharacterInConstraintName();
                }
            }

            if (parseLevel === 1) {
                if (charFromStr === ')') {
                    parseLevel = 4;
                    glue = '';

                    continue;
                }

                if (charFromStr === "'") {
                    parseLevel = 2;
                    glue = '';

                    continue;
                }
            }

            if (parseLevel === 2 && charFromStr === "'") {
                parseLevel = 1;
                args.push(glue);
                glue = '';

                continue;
            }

            if (parseLevel === 4) {
                if (!this.#isOnlyAlphanumericCharacter(charFromStr) && charFromStr !== ' ') {
                    throw new AdditionalCharactersAfterClosingBracket();
                }
            }

            glue += charFromStr;

            if ((parseLevel === 0 || parseLevel === 4) && i === constraintRepresentation.length - 1 && !name) {
                name = glue;
            }
        }

        return {
            name,
            args
        };
    }

    #isOnlyAlphanumericCharacter(char: string) {
        return ('a'.charCodeAt(0) <= char.charCodeAt(0) && 'z'.charCodeAt(0) >= char.charCodeAt(0)) ||
            ('A'.charCodeAt(0) <= char.charCodeAt(0) && 'Z'.charCodeAt(0) >= char.charCodeAt(0)) ||
            ('0'.charCodeAt(0) <= char.charCodeAt(0) && '9'.charCodeAt(0) >= char.charCodeAt(0));
    }
}