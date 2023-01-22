import { ValidatorConstraintInterface, ValidationOptions, ValidationArguments } from 'class-validator';
export declare class MatchLengthValidatorConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean;
    defaultMessage(): string;
}
export declare function MatchLengthValidator(property: string, validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
