import { ValidatorConstraintInterface, ValidationOptions } from 'class-validator';
export declare class OpeatorsListValidatorConstraint implements ValidatorConstraintInterface {
    validate(operatorsList: any): boolean;
    defaultMessage(): string;
}
export declare function OpeatorsListValidator(validationOptions?: ValidationOptions): (object: any, propertyName: string) => void;
