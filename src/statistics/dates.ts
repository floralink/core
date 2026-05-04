import { getFrequencies } from "../math/nominal.js";
import type { VagueDate } from "../types/data.js";
import type { ExtremeDates } from "../types/statistics.js";

function dateCloserToTarget(
	newDate: Date,
	currentDate: Date,
	extreme: "min" | "max",
) {
	return extreme === "min" ? newDate < currentDate : newDate > currentDate;
}

function vagueDateComparer(
	extreme: "min" | "max",
	target: "from" | "to",
	initialDate: VagueDate,
) {
	const otherTarget = target === "from" ? "to" : "from";

	let vagueDate = initialDate;
	let targetDate = new Date(initialDate[target]);
	let otherTargetDate = new Date(initialDate[otherTarget]);

	return {
		get() {
			return vagueDate;
		},
		feed(comparedVagueDate: VagueDate) {
			const comparedTargetDate = new Date(comparedVagueDate[target]);

			if (
				dateCloserToTarget(comparedTargetDate, targetDate, extreme) ||
				// Or other range end is closer to target -> compared date is less vague
				(comparedTargetDate === targetDate &&
					dateCloserToTarget(
						new Date(comparedVagueDate[otherTarget]),
						otherTargetDate,
						extreme,
					))
			) {
				vagueDate = comparedVagueDate;
				targetDate = new Date(initialDate[target]);
				otherTargetDate = new Date(initialDate[otherTarget]);
			}
		},
	};
}

export function getExtremeDates(dates: VagueDate[]): ExtremeDates | undefined {
	if (dates.length === 0) return undefined;

	const minFrom = vagueDateComparer("min", "from", dates[0]);
	const minTo = vagueDateComparer("min", "to", dates[0]);
	const maxFrom = vagueDateComparer("max", "from", dates[0]);
	const maxTo = vagueDateComparer("max", "to", dates[0]);

	dates.forEach((date) => {
		minFrom.feed(date);
		minTo.feed(date);
		maxFrom.feed(date);
		maxTo.feed(date);
	});

	return {
		minFrom: minFrom.get(),
		minTo: minTo.get(),
		maxFrom: maxFrom.get(),
		maxTo: maxTo.get(),
	};
}

/**
 * Returns an object with occurring years as keys and the corresponding amounts as values.
 *
 * **Note**: Input dates with ranges that aren't contained in a single year are ignored.
 */
export function getYearlyFrequencies(dates: VagueDate[]) {
	return getFrequencies(
		dates,
		(date: VagueDate) => new Date(date.from).getFullYear(),
		// Ignore date ranges that aren't contained in a single year
		(date: VagueDate) =>
			new Date(date.from).getFullYear() === new Date(date.to).getFullYear(),
	);
}

/**
 * Returns an object with occurring months as keys and the corresponding amounts as values.
 *
 * **Note**: Input dates with ranges that aren't contained in a single month are ignored.
 */
export function getMonthlyFrequencies(dates: VagueDate[]) {
	return getFrequencies(
		dates,
		(date: VagueDate) => new Date(date.from).getMonth(),
		// Ignore date ranges that aren't contained in a single month
		(date: VagueDate) =>
			new Date(date.from).getMonth() === new Date(date.to).getMonth(),
	);
}
