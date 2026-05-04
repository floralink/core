import type {
	Occurrence,
	OccurrenceIndexedObject,
	TaxonIndexedObject,
} from "../types/data.js";
import type { QueryOccurrencesStatistics } from "../types/statistics.js";
import { getOccurrencesStatistics } from "./occurrences.js";

export function getTaxonOccurrencesStatistics(
	taxonOccurrenceIDs: TaxonIndexedObject<string[]>,
	occurrencesData: OccurrenceIndexedObject<Occurrence>,
) {
	const taxonOccurrencesStatistics: TaxonIndexedObject<QueryOccurrencesStatistics> =
		{};

	Object.keys(taxonOccurrenceIDs).forEach((taxonID) => {
		const taxonOccurrences = taxonOccurrenceIDs[taxonID].map(
			(occurrenceID) => occurrencesData[occurrenceID],
		);
		taxonOccurrencesStatistics[taxonID] =
			getOccurrencesStatistics(taxonOccurrences);
	});

	return taxonOccurrencesStatistics;
}
