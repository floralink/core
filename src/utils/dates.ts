import type { VagueDate } from "../types/data.js";

/**
 * Helps to display an ISO date with time in a German locale.
 *
 * @param isoDate ISO date string
 * @returns German-localized date and time
 */
export function getDateStringFromISO(isoDate: string) {
	const date = new Date(isoDate);
	const datePart = date.toLocaleString("de-DE", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
	const timePart = date.toLocaleString("de-DE", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});

	return `${datePart} ${timePart} Uhr`;
}

/**
 * Helps to display a `VagueDate` in a German locale.
 *
 * `VagueDate` is a type specific to the NetPhyD API.
 * It allows to define resolution of data and date ranges where the actual data lies within.
 *
 * @param vagueDate A `VagueDate` object
 * @returns German-localized date (range)
 */
export function getDateStringFromVagueDate(vagueDate: VagueDate) {
	const fromDate = new Date(vagueDate.from);
	const toDate = new Date(vagueDate.to);

	switch (vagueDate.type) {
		case "DAY":
			return fromDate.toLocaleDateString("de-DE", {
				day: "2-digit",
				month: "2-digit",
				year: "numeric",
			});
		case "DAYS":
			return `zwischen ${fromDate.toLocaleDateString()} und ${toDate.toLocaleDateString()}`;
		case "MONTH_IN_YEAR":
			return fromDate.toLocaleString("default", {
				year: "numeric",
				month: "long",
			});
		case "YEAR":
			return fromDate.getFullYear().toString();
		case "TO_YEAR":
			return `bis ${toDate.getFullYear()}`;
		case "FROM_YEAR":
			return `seit ${fromDate.getFullYear()}`;
		case "YEARS":
			return `von ${fromDate.getFullYear()} bis ${toDate.getFullYear()}`;
		default:
			return `von ${fromDate.getFullYear()} bis ${toDate.getFullYear()}`;
	}
}

/**
 * Takes in a `VagueDate` and returns
 *   - the year as a string if start and end year are the same
 *   - a German year range like `"von 2010 bis 2019"`
 *
 * @param vagueDate A `VagueDate` object
 * @returns German-localized year or year range
 */
export function getYearStringFromVagueDate(vagueDate: VagueDate) {
	const yearStringParts = [];

	if (vagueDate.from)
		yearStringParts.push(`von ${vagueDate.from.substring(0, 4)}`);
	if (vagueDate.to) yearStringParts.push(`bis ${vagueDate.to.substring(0, 4)}`);

	return yearStringParts.join(" ");
}
