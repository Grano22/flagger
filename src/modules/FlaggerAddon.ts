import FlaggerConstraint from "../constraint/FlaggerConstraint";
import FlaggerConstraintInterface from "../constraint/FlaggerConstraintInterface";
import FlaggerServiceLocator from "../services/FlaggerServiceLocator";

type FlaggerModuleComponent =
    (FlaggerConstraint & FlaggerConstraintInterface);


export default interface FlaggerAddon extends Object {
    readonly name: string;

    onLoad(serviceLocator: FlaggerServiceLocator): void;
    registerComponents: FlaggerModuleComponent[];
}