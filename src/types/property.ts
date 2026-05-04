import type { IdentifierIndexedObject, Primitive } from "./data.js";
import type { Describable } from "./shared.js";

// Union types
// -------------------------------------------------------

export type PrimitiveName = "boolean" | "number" | "string";
export type ScaleOfMeasure = "nominal" | "ordinal" | "interval";
export type NominalOrOrdinalScaleOfMeasure = "ordinal" | "nominal";

type PrimitiveNameMap<T extends Primitive> = T extends number
	? "number"
	: T extends boolean
		? "boolean"
		: "string";

interface PropertyBase<T extends Primitive> extends Describable {
	id: string;
	type: PrimitiveNameMap<T>;
	scaleOfMeasure?: ScaleOfMeasure;
}

// Nominal or ordinal properties
// -------------------------------------------------------

export interface ValueDescription<T extends Primitive = Primitive>
	extends Partial<Describable> {
	value: T;
	/** Indicates if this is a nominal value not ordered within a  */
	extraOrdinal?: boolean;
}

export interface NominalOrOrdinalProperty<
	T extends Primitive,
	S extends NominalOrOrdinalScaleOfMeasure,
> extends PropertyBase<T> {
	scaleOfMeasure: S;
	/** (Ordered) enumeration of possible accepted values */
	enum: T[];
	/** Value descriptions are indexed by the value parsed to a string (for example, `false` becomes `"false"`, `3` becomes `"3"`). */
	descriptions?: IdentifierIndexedObject<ValueDescription<T>>;
}

// Nominal properties
// -------------------------------------------------------

export interface NominalPropertyBase<
	T extends Primitive,
	A extends boolean | undefined,
> extends NominalOrOrdinalProperty<T, "nominal"> {
	array?: A;
}

export interface BooleanNominalProperty
	extends NominalPropertyBase<boolean, undefined> {}
export interface NumberNominalProperty
	extends NominalPropertyBase<number, undefined> {}
export interface NumberArrayNominalProperty
	extends NominalPropertyBase<number, true> {}
export interface StringNominalProperty
	extends NominalPropertyBase<string, undefined> {}
export interface StringArrayNominalProperty
	extends NominalPropertyBase<string, true> {}

export type NominalProperty =
	| BooleanNominalProperty
	| NumberNominalProperty
	| NumberArrayNominalProperty
	| StringNominalProperty
	| StringArrayNominalProperty;

// Ordinal properties
// -------------------------------------------------------

export interface OrdinalPropertyBase<T extends Primitive>
	extends NominalOrOrdinalProperty<T, "ordinal"> {}

export interface NumberOrdinalProperty extends OrdinalPropertyBase<number> {}
export interface StringOrdinalProperty extends OrdinalPropertyBase<string> {}

export type OrdinalProperty = NumberOrdinalProperty | StringOrdinalProperty;

// Number interval property
// -------------------------------------------------------

export interface NumberIntervalProperty extends PropertyBase<number> {
	type: "number";
	scaleOfMeasure: "interval";
}

// Property
// -------------------------------------------------------

export type Property =
	| NominalProperty
	| OrdinalProperty
	| NumberIntervalProperty;
