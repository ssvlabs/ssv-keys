import { ValidatorConstraintInterface, ValidationOptions } from 'class-validator';
export declare class OwnerAddressValidatorConstraint implements ValidatorConstraintInterface {
    validate(value: any): boolean;
    defaultMessage(): string;
}
export declare function OwnerAddressValidator(validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
