import { getAverage, getVariance } from "../math/interval.js";
import { getDifferent, getFrequencies, getMode } from "../math/nominal.js";
import { getQuantile } from "../math/ordinal.js";
import type { Primitive } from "../types/data.js";
import type {
	NumberIntervalProperty,
	OrdinalProperty,
	Property,
} from "../types/property.js";
import type { Statistics } from "../types/statistics.js";

function getExcluded(values: Primitive[], filteredValues: Primitive[]) {
	const excluded = [...new Set(values)].filter(
		(v) => filteredValues.indexOf(v) === -1,
	);
	return excluded.length ? excluded : undefined;
}

/**
 * Get statistics of values for a given property
 *
 * If a property accepts array values (which only a nominal property can), they are flattened before calulcation.
 * Note that the flattened array values are not weighted by the reciprocal length of the array.
 *
 * @param property - A `Property` object
 * @param values - An array of values
 * @param decimals - Rounding to decimals (default: 2)
 * @returns `Statistics` object with contents based on the scale of measure
 */
export function getPropertyStatistics(
	property: Property,
	values: Primitive[] | Primitive[][],
	decimals: number = 2,
): Statistics {
	const flattenedValues = values.flat();

	if (propertyIsOrdinal(property)) {
		if (property.type === "number") {
			// Case: Ordinal number property
			const ordinalValues = getOrdinalValues(property, flattenedValues);

			if (ordinalValues?.length)
				return {
					total: flattenedValues.length,
					different: getDifferent(flattenedValues),
					frequencies: getFrequencies(flattenedValues),
					mode: getMode(flattenedValues),
					percentiles: {
						25: getQuantile(ordinalValues, 0.25),
						50: getQuantile(ordinalValues, 0.5),
						75: getQuantile(ordinalValues, 0.75),
						excluded: getExcluded(flattenedValues, ordinalValues),
					},
				};
		} else if (property.type === "string") {
			// Case: Ordinal string property

			// Filter out empty strings
			const filteredValues = flattenedValues.filter(
				(value) => value.toString().trim() !== "",
			);

			const ordinalValues = getOrdinalValues(property, filteredValues);
			const possibleOrdinalValuesInOrder = getPossibleOrdinalValues(
				property,
			) as string[];

			if (ordinalValues?.length)
				return {
					total: filteredValues.length,
					different: getDifferent(filteredValues),
					frequencies: getFrequencies(filteredValues),
					mode: getMode(filteredValues),
					percentiles: {
						25: getQuantile(ordinalValues, 0.25, possibleOrdinalValuesInOrder),
						50: getQuantile(ordinalValues, 0.5, possibleOrdinalValuesInOrder),
						75: getQuantile(ordinalValues, 0.75, possibleOrdinalValuesInOrder),
						excluded: getExcluded(flattenedValues, ordinalValues),
					},
				};
		}
	} else if (propertyIsInterval(property)) {
		// Case: Interval number property
		const average = getAverage(flattenedValues as number[]);
		const variance = getVariance(flattenedValues as number[], average);

		return {
			total: flattenedValues.length,
			average: parseFloat(average.toFixed(decimals)),
			variance: parseFloat(variance.toFixed(decimals)),
			standardDeviation: Math.sqrt(variance),
		};
	}

	// Case: Nominal property
	return {
		mode: getMode(flattenedValues),
		frequencies: getFrequencies(flattenedValues),
		total: values.length,
		different: getDifferent(flattenedValues),
	};
}

export function getPossibleOrdinalValues(property: Property) {
	if (propertyIsOrdinal(property))
		return (
			property.enum?.filter(
				(v) => !property.descriptions?.[v.toString()].extraOrdinal,
			) || []
		);
	else return [];
}

export function getOrdinalValues<T extends Primitive>(
	property: OrdinalProperty,
	values: T[],
) {
	// Don't filter values if there is no enumeration defined (or with zero elements)
	if (!property.enum || property.enum.length === 0) return values;
	else {
		return values.filter(
			(v) =>
				// Only keep if this value is declared in the enumeration...
				(property.enum as T[]).includes(v) &&
				// ...and not defined as a nominal value among ordinal values via the `extraOrdinal` property.
				!property.descriptions?.[v.toString()]?.extraOrdinal,
		);
	}
}

// Guards
// -------------------------------------------------------

function propertyIsOrdinal(property: Property): property is OrdinalProperty {
	return property.scaleOfMeasure === "ordinal";
}

function propertyIsInterval(
	property: Property,
): property is NumberIntervalProperty {
	return property.scaleOfMeasure === "interval" && property.type === "number";
}
