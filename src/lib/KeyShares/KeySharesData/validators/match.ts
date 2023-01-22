import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'MatchLength', async: false })
export class MatchLengthValidatorConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedLength = (args.object as any)[relatedPropertyName].length;
    return relatedLength === value.length;
  }

  defaultMessage() {
    return 'The length of the entries lists are not equal';
  }
}

export function MatchLengthValidator(property: string, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchLengthValidatorConstraint,
    });
  };
}
