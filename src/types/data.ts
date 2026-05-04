// Indexed objects
// -------------------------------------------------------

import type { PluginReference } from "./plugins.js";

export type IdentifierIndexedObject<T> = { [id: string]: T };
export type TaxonIndexedObject<T> = { [taxonID: string]: T };
export type PropertyIndexedObject<T> = { [propertyID: string]: T };
export type OccurrenceIndexedObject<T> = { [occurrenceID: string]: T };

// Taxa
// -------------------------------------------------------

export interface Taxon {
	// Identity
	// -----------------------------------------------------
	/** ID in this plugin's database */
	id: string;
	/** References to IDs of the same taxon concept in other databases. Not to be confused with `synonymOf`. */
	sameAs?: Reference[];

	// Properties
	// -----------------------------------------------------
	scientificName?: string;
	authorCitation?: string;
	vernacularNames?: Name[];
	rank: string;
	group?: string; // NOTE: This is GermanSL-specific and will be deprecated in the future.

	// Relations
	// -----------------------------------------------------
	childTaxonOf?: Reference;
	synonymOf?: Reference;
}

export interface Name {
	region: string | string[];
	name: string;
}

export interface Reference {
	id: string;
	source?: PluginReference;
	sourceName?: string; // If there is no plugin for the source
}

// Traits
// -------------------------------------------------------

export type Primitive = string | number | boolean;
export type SamePrimitiveArray = number[] | boolean[] | string[];

export interface Traits {
	taxonID: string;
	[traitID: string]: Primitive | Primitive[];
}

// Occurrences
// -------------------------------------------------------

export interface Occurrence {
	id: string;
	taxonID: string;
	date: VagueDate;
	survey?: Survey; // NOTE: experimental
}

interface Survey {
	id?: string;
	title: string;
	description: string;
}

// Base types
// -------------------------------------------------------

export interface VagueDate {
	from: string;
	to: string;
	type: VagueDateType;
}

type VagueDateType =
	| "DAY" // A precise day
	| "DAYS" // An interval between two days
	| "MONTH_IN_YEAR" // A month in a year
	| "YEAR" // A year
	| "TO_YEAR" // It's only known that the date is before a certain year
	| "FROM_YEAR" // Don't use, you always can use today as an end date
	| "YEARS"; // An interval between tow years
