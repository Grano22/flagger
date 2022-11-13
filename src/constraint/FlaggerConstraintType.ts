import FlaggerConstraint from "./FlaggerConstraint";
import FlaggerConstraintInterface from "./FlaggerConstraintInterface";

type FlaggerConstraintType = FlaggerConstraint<{} | Record<string, any>> & FlaggerConstraintInterface;

export default FlaggerConstraintType;