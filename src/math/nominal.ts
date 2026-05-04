import type { Primitive, VagueDate } from "../types/data.js";
import type { Frequencies, Mode } from "../types/statistics.js";

/**
 * Counts the frequencies/abundances of values.
 *
 * Note that keys in the result object are always strings,
 * so numbers and booleans will be converted to strings.
 */
export function getFrequencies<ValueType extends Primitive | VagueDate>(
	values: ValueType[],
	transformToKey?: (value: ValueType) => string | number,
	checkValue?: (value: ValueType) => boolean,
): Frequencies {
	const frequencies: Frequencies = {};
	values.forEach((rawValue) => {
		if (!checkValue || checkValue(rawValue))
			countOnKeyValue(
				frequencies,
				transformToKey ? transformToKey(rawValue) : `${rawValue}`,
			);
	});
	return frequencies;
}

function countOnKeyValue(
	object: Record<string | number, number>,
	key: string | number,
) {
	if (Object.hasOwn(object, key)) {
		object[key] += 1;
	} else {
		object[key] = 1;
	}
}

export function getMode(arr: Primitive[]): Mode {
	if (arr.length === 0) throw new Error("Can't get mode of zero elements.");

	const counter: Record<string, number> = {};
	let max = 0;
	let mode: Primitive[] = [];

	arr.forEach((value) => {
		const valueKey = value.toString();
		counter[valueKey] = (counter[valueKey] || 0) + 1;

		if (counter[valueKey] === max) mode.push(value);
		else if (counter[valueKey] > max) {
			max = counter[valueKey];
			mode = [value];
		}
	});

	return {
		mode: mode.length === 1 ? mode[0] : mode,
		total: max,
		ratio: max / arr.length,
	};
}

export function getDifferent(arr: Primitive[]): number {
	return new Set(arr).size;
}
