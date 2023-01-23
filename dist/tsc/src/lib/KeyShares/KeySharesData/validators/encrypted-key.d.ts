import { ValidatorConstraintInterface, ValidationOptions } from 'class-validator';
export declare class EncryptedKeyValidatorConstraint implements ValidatorConstraintInterface {
    validate(value: any): boolean;
    defaultMessage(): string;
}
export declare function EncryptedKeyValidator(validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
