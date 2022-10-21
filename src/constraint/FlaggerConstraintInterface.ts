export default interface FlaggerConstraintInterface extends Object {
    canBeActivated(): Promise<boolean>;
}