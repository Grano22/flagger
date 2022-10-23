import FlaggerConstraint from "../constraint/FlaggerConstraint";
import FlaggerConstraintInterface from "../constraint/FlaggerConstraintInterface";

type FlaggerModuleComponent =
    (FlaggerConstraint & FlaggerConstraintInterface);

export default interface FlaggerAddon extends Object {
    registerComponents: FlaggerModuleComponent[];
}