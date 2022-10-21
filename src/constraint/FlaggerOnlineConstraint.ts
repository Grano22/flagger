import FlaggerConstraint from "./FlaggerConstraint";
import FlaggerConstraintInterface from "./FlaggerConstraintInterface";
export default class FlaggerOnlineConstraint extends FlaggerConstraint implements FlaggerConstraintInterface {
    async canBeActivated(): Promise<boolean> {
        return navigator.onLine;
    }
}