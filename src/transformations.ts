import type { Occurrence, TaxonIndexedObject } from "./types/data.js";

/**
 * Convert an object of occurrence data indexed by occurrence IDs to a new object
 * where each key is a taxon ID and each value is an object with an "occurrenceIDs"
 * property containing an array of occurrence IDs from the original object.
 *
 * @param {OccurrenceIndexedObject<Occurrence>} occurrences Array of occurrences.
 * @return {TaxonIndexedObject<string[]>} Object with taxon IDs as keys and an occurrenceID array as value.
 */
export function convertToTaxonOccurrenceIDs(
	occurrences: Occurrence[],
): TaxonIndexedObject<string[]> {
	const taxonData: TaxonIndexedObject<string[]> = {};
	occurrences.forEach((occurrence) => {
		if (taxonData[occurrence.taxonID] !== undefined) {
			taxonData[occurrence.taxonID].push(occurrence.id);
		} else {
			taxonData[occurrence.taxonID] = [occurrence.id];
		}
	});
	return taxonData;
}

/**
 * Returns a deduplicated list of taxon IDs referenced in the given array of occurrences.
 */
export function getTaxonIDsFromOccurrences(occurrences: Occurrence[]) {
	return occurrences
		.map((occurrence) => occurrence.taxonID)
		.filter((value, index, self) => self.indexOf(value) === index);
}
