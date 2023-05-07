import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { OperatorsCountsMismatchError } from '../../../exceptions/operator';

@ValidatorConstraint({ name: 'matchLength', async: false })
export class MatchLengthValidatorConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName, customError] = args.constraints;
    const relatedLength = (args.object as any)[relatedPropertyName].length;
    if (!Array.isArray(value)) {
      Object.values(value).forEach((arr: any) => {
        if (relatedLength !== arr.length) {
          throw new OperatorsCountsMismatchError((args.object as any)[relatedPropertyName], value, customError.message);
        }
      })
    } else {
      if (relatedLength !== value.length) {
        throw new OperatorsCountsMismatchError((args.object as any)[relatedPropertyName], value, customError.message);
      }
    }
    return true;
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
      constraints: [property, validationOptions],
      validator: MatchLengthValidatorConstraint,
    });
  };
}
