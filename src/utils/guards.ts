import type { Primitive } from "../types/data.js";

export function isString(value: unknown): value is string {
	return typeof value === "string";
}

export function isNumber(value: unknown): value is number {
	return typeof value === "number";
}

export function isBoolean(value: unknown): value is boolean {
	return typeof value === "boolean";
}

export function isPrimitive(value: unknown): value is Primitive {
	return isString(value) || isNumber(value) || isBoolean(value);
}
