export type ErrorChecker = {
  validateFn: (str: any) => boolean;
  error: string;
  continue: boolean;
};

export type Validator = import("$src/validation/Validator.js").default;
type ObjectValidator<S extends Schema> = import("$src/validation/validators/nullable/ObjectValidator.js").default<S>;
export type Schema = Record<string, Validator>;
export type ErrorRecord<S extends Schema> = {
  [K in keyof S]?: S[K] extends ObjectValidator<infer S2> ? ErrorRecord<S2> : string[]
};