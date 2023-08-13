import Validator from "$src/validation/Validator/Validator.js";
import { ValidationTypes } from "$src/types/types.js";

export default class ObjectValidator<S extends ValidationTypes.Schema> extends Validator {
  public readonly [Validator.errorCheckersSymbol]: ValidationTypes.ErrorChecker[] = [];
  private readonly schema: S;

  constructor(schema: S, invalidTypeError: string) {
    super();
    this[Validator.errorCheckersSymbol].push({
      error: invalidTypeError,
      validateFn: (value) => typeof value === "object" && value !== null,
      continue: false
    });
    this.schema = schema;
  }

  getErrors(source: Record<string, any>) {
    return Object.entries(this.schema).reduce((acc, [key, validator]) => {
      if (validator instanceof ObjectValidator) {
        acc[key as keyof S] = validator.getErrors(source[key]) as any;
        return acc;
      }

      const errors: string[] = [];

      for (const { error, validateFn, continue: c } of validator[Validator.errorCheckersSymbol]) {
        if (!validateFn(source[key])) {
          errors.push(error);
          if (!c) break;
        }
      }

      acc[key as keyof S] = errors as any;
      return acc;
    }, {} as ValidationTypes.ErrorRecord<S>);
  }
}