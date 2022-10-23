import FlaggerConstraint from "./FlaggerConstraint";
import FlaggerConstraintInterface from "./FlaggerConstraintInterface";
import FlaggerSerializableConstraint from "./FlaggerSerializableConstraint";
export default class FlaggerOnlineConstraint
    extends FlaggerConstraint
    implements FlaggerConstraintInterface,
    FlaggerSerializableConstraint
{
    static readonly representativeName = 'isOnline';

    async canBeActivated(): Promise<boolean> {
        return navigator.onLine;
    }

    serialize(): any[] {
        return [];
    }

    static deserialize(): FlaggerOnlineConstraint {
        return new this();
    }
}