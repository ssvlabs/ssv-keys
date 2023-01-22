import { ValidatorConstraintInterface, ValidationOptions } from 'class-validator';
export declare class OpeatorPublicKeyValidatorConstraint implements ValidatorConstraintInterface {
    validate(value: any): boolean;
    defaultMessage(): string;
}
export declare function OpeatorPublicKeyValidator(validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
