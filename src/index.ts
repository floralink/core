// Plugins
// -------------------------------------------------------

export {
	getGroupScalesOfMeasure,
	getPluginScalesOfMeasure,
} from "./plugins.js";

// Queries
// -------------------------------------------------------

export {
	getOuterTaxonHierarchy,
	getTraitsByTaxonIDs,
	queryAPI,
	resolveTaxon,
} from "./query.js";

// Transformations
// -------------------------------------------------------

export {
	convertToTaxonOccurrenceIDs,
	getTaxonIDsFromOccurrences,
} from "./transformations.js";

// Statistics
// -------------------------------------------------------

export { getOccurrencesStatistics } from "./statistics/occurrences.js";
export { getTaxaStatistics } from "./statistics/taxa.js";
export { getTaxonOccurrencesStatistics } from "./statistics/taxonoccurrences.js";
export { getTraitsStatistics } from "./statistics/traits.js";

// Types
// -------------------------------------------------------

export type * from "./types/data.js";
export type * from "./types/generate.js";
export type * from "./types/groups.js";
export type * from "./types/plugins.js";
export type * from "./types/property.js";
export type * from "./types/query.js";
export type * from "./types/shared.js";
export type * from "./types/statistics.js";

// Dates
// -------------------------------------------------------

export {
	getDateStringFromISO,
	getDateStringFromVagueDate,
	getYearStringFromVagueDate,
} from "./utils/dates.js";

// Definitions
// -------------------------------------------------------

export {
	defineGeneratorConfig,
	defineGroup,
	defineJsonGroup,
	definePlugin,
	defineProperty,
	defineTaxaJsonGroup,
	defineTraitsJsonGroup,
} from "./utils/definitions.js";

// Regions
// -------------------------------------------------------

export * from "./utils/regions.js";
