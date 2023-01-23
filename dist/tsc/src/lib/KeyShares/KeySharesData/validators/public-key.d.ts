import { ValidatorConstraintInterface, ValidationOptions } from 'class-validator';
export declare class PublicKeyValidatorConstraint implements ValidatorConstraintInterface {
    validate(value: any): Promise<boolean>;
    defaultMessage(): string;
}
export declare function PublicKeyValidator(validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
