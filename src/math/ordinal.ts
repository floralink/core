import type { Primitive, SamePrimitiveArray } from "../types/data.js";

/**
 * Returns two values if the quantile is exactly between two values, returns exact or nearest match otherwise.
 */
export function getQuantileNumber(arr: number[], q: number) {
	const sortedArray = arr.sort((a, b) => a - b);
	const quantileIndex = arr.length * q - 0.5;

	// The center is exactly between two values
	if (quantileIndex - 0.5 === Math.floor(quantileIndex)) {
		const index1 = Math.floor(quantileIndex);
		const index2 = index1 + 1;

		// Center values are the same
		if (sortedArray[index1] === sortedArray[index2]) return sortedArray[index1];
		// Center values are different
		else return [sortedArray[index1], sortedArray[index2]];
	} else {
		// Direct or nearest index at quantile
		return sortedArray[Math.round(quantileIndex)];
	}
}

/**
 * Returns two values if the quantile is exactly between two values, returns exact or nearest match otherwise.
 */
export function getQuantileBoolean(arr: boolean[], q: number) {
	const numberArray = arr.map((booleanValue) =>
		booleanValue === true ? 1 : 0,
	);
	const quantileNumbers = getQuantileNumber(numberArray, q);
	if (Array.isArray(quantileNumbers)) {
		return quantileNumbers.map((number) => number === 1);
	} else {
		return quantileNumbers === 1;
	}
}

/**
 * Returns two values if the quantile is exactly between two values, returns exact or nearest match otherwise.
 */
export function getQuantileString(arr: string[], q: number, order: string[]) {
	const numberArray = arr.map((stringValue) => order.indexOf(stringValue));
	const quantileNumbers = getQuantileNumber(numberArray, q);
	if (Array.isArray(quantileNumbers)) {
		return quantileNumbers.map((number) => order[number]);
	} else {
		return order[quantileNumbers];
	}
}

/**
 * Returns two values if the quantile is exactly between two values, returns exact or nearest match otherwise.
 */
export function getQuantile(
	arr: Primitive[],
	q: number,
	order?: string[],
): Primitive | SamePrimitiveArray {
	if (typeof arr[0] === "number") {
		return getQuantileNumber(arr as number[], q);
	} else if (typeof arr[0] === "boolean") {
		return getQuantileBoolean(arr as boolean[], q);
	} else if (typeof arr[0] === "string" && order) {
		return getQuantileString(arr as string[], q, order);
	} else
		throw new Error(`Type "${typeof arr[0]}" is not supported for quantiles.`);
}
