import { ValidatorConstraintInterface, ValidationOptions } from 'class-validator';
export declare class OwnerNonceValidatorConstraint implements ValidatorConstraintInterface {
    validate(value: any): boolean;
    defaultMessage(): string;
}
export declare function OwnerNonceValidator(validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
