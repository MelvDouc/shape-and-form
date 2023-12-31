import { Schema } from "$src/validation/schema.js";
import { strictEqual } from "node:assert";
import { describe, it } from "node:test";

const testObject = {
  isVerified: false,
  age: 35,
  bigInteger: BigInt(1e15),
  email: "invalid@email@com",
  birthDate: new Date("2100-01-01"),
  nested: {
    property: null
  }
};

describe("primitives", () => {
  it("boolean", () => {
    const schema = Schema.object({
      isVerified: Schema.boolean("err1"),
      isVerified2: Schema.boolean("err2")
    }, "");
    const errors = schema.getErrors(testObject);

    strictEqual(errors.length, 1);
    strictEqual(errors[0], "err2");
  });

  it("number", () => {
    const schema = Schema.object({
      age: Schema.number().min(0, "").max(testObject.age - 1, "err1")
    }, "");
    const errors = schema.getErrors(testObject);

    strictEqual(errors[0], "err1");
  });

  it("bigint", () => {
    const schema = Schema.object({
      bigInteger: Schema.bigint().divisibleBy(BigInt(1e15 - 1), "err1")
    }, "");
    const errors = schema.getErrors(testObject);

    strictEqual(errors[0], "err1");
  });

  it("date", () => {
    const schema = Schema.object({
      birthDate: Schema.date().before(new Date(), "err1")
    }, "");
    const errors = schema.getErrors(testObject);

    strictEqual(errors[0], "err1");
  });

  it("string", () => {
    const schema = Schema.object({
      email: Schema.string().email("err1")
    }, "");
    const errors = schema.getErrors(testObject);

    strictEqual(errors[0], "err1");
  });
});

describe("object", () => {
  it("nesting", () => {
    const schema = Schema.object({
      nested: Schema.object({
        property: Schema.null()
      }, "")
    }, "");
    const errors = schema.getErrors(testObject);

    strictEqual(errors[0], void 0);
  });

  it("partial", () => {
    const schema = Schema
      .object({
        isVerified: Schema.boolean("err1"),
        isVerified2: Schema.boolean("err2")
      }, "")
      .partial();
    const errors = schema.getErrors({});
    strictEqual(errors.length, 0);
  });
});