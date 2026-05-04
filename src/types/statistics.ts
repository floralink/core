import type { Primitive, PropertyIndexedObject, VagueDate } from "./data.js";

// General statistics
// -------------------------------------------------------

export type Statistics =
	| NominalStatistics
	| OrdinalStatistics
	| IntervalStatistics;

interface BaseStatistics {
	/**
	 * Total number of values that went into the calculations.
	 * This excludes nominal values in ordinal properties
	 * as well as empty strings.
	 */
	total: number;
}

interface NominalStatistics extends BaseStatistics {
	/** Number of different values */
	different: number;
	frequencies: Frequencies;
	mode: Mode;
}

export type Frequencies = Record<string, number>;

export interface Mode {
	mode: Primitive | Primitive[];
	total: number;
	ratio: number;
}

interface OrdinalStatistics extends NominalStatistics {
	percentiles: Percentiles;
}

interface Percentiles {
	25: Primitive | Primitive[];
	50: Primitive | Primitive[];
	75: Primitive | Primitive[];
	excluded?: Primitive[];
}

interface IntervalStatistics extends BaseStatistics {
	average: number;
	variance: number;
	standardDeviation: number;
}

// Domain-specific statistics
// -------------------------------------------------------

interface OccurrencesStatistics {
	total: number;
	extremeDates?: ExtremeDates;
	monthlyFrequencies: Frequencies;
	yearlyFrequencies: Frequencies;
}

export interface ExtremeDates {
	minFrom: VagueDate;
	minTo: VagueDate;
	maxFrom: VagueDate;
	maxTo: VagueDate;
}

export interface QueryOccurrencesStatistics extends OccurrencesStatistics {
	uniqueTaxaCount: number;
}

export interface TaxaStatistics {
	total: number;
	rankFrequencies: Frequencies;
}

export type TraitsStatistics = PropertyIndexedObject<Statistics>;
