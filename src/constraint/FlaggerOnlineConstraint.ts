import FlaggerConstraint from "./FlaggerConstraint";
import FlaggerConstraintInterface from "./FlaggerConstraintInterface";
import FlaggerSerializableConstraint from "./FlaggerSerializableConstraint";
export default class FlaggerOnlineConstraint
    extends FlaggerConstraint
    implements FlaggerConstraintInterface,
    FlaggerSerializableConstraint
{
    async canBeActivated(): Promise<boolean> {
        return navigator.onLine;
    }

    serialize(): any[] {
        return [];
    }
}