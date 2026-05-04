import { getFrequencies } from "../math/nominal.js";
import type { Taxon } from "../types/data.js";
import type { TaxaStatistics } from "../types/statistics.js";

export function getTaxaStatistics(taxa: Taxon[]): TaxaStatistics {
	return {
		total: taxa.length,
		rankFrequencies: getFrequencies(taxa.map((taxon) => taxon.rank)),
	};
}
