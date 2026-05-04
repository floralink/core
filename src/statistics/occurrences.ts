import type { Occurrence, VagueDate } from "../types/data.js";
import type { QueryOccurrencesStatistics } from "../types/statistics.js";
import {
	getExtremeDates,
	getMonthlyFrequencies,
	getYearlyFrequencies,
} from "./dates.js";

/**
 * Calculate and return statistics based on the given array of occurrences.
 *
 * @param {Occurrence[]} occurrences Array of occurrences to calculate statistics from.
 * @returns {QueryOccurrencesStatistics} Object containing total occurrences count, unique taxa count, extreme dates, and yearly frequencies.
 */
export function getOccurrencesStatistics(
	occurrences: Occurrence[],
): QueryOccurrencesStatistics {
	const total = Object.keys(occurrences).length;

	const taxonIDs = Object.values(occurrences).map(
		(occurrence) => occurrence.taxonID,
	);
	const uniqueTaxaCount = taxonIDs.filter(
		(value, index, self) => self.indexOf(value) === index,
	).length;

	const occurrenceDates = Object.values(occurrences).reduce(
		(prev, curr) => prev.concat([curr.date]),
		[] as VagueDate[],
	);
	const extremeDates = getExtremeDates(occurrenceDates);
	const yearlyFrequencies = getYearlyFrequencies(occurrenceDates);
	const monthlyFrequencies = getMonthlyFrequencies(occurrenceDates);

	return {
		total,
		uniqueTaxaCount,
		extremeDates,
		monthlyFrequencies,
		yearlyFrequencies,
	};
}
