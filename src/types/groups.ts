import type {
	IdentifierIndexedObject,
	Occurrence,
	Primitive,
	Taxon,
	Traits,
} from "./data.js";
import type { GeneratorConfig } from "./generate.js";
import type { Property } from "./property.js";
import type { OccurrenceQuery } from "./query.js";
import type { Citations, Describable } from "./shared.js";

export type Group = JsonGroup | OccurrencesApiGroup;

export type GroupType = Taxon | Traits | Occurrence;

interface GroupBase<N extends "taxa" | "traits" | "occurrences">
	extends Describable {
	type: N;
	id: string;
	originalSource?: Citations;
}

// JSON groups
// -------------------------------------------------------

export type JsonGroup = TaxaJsonGroup | TraitsJsonGroup;

export interface JsonGroupBase<N extends "taxa" | "traits", D extends GroupType>
	extends GroupBase<N> {
	data: IdentifierIndexedObject<D>;
	generate: GeneratorConfig<D>;
}

// Taxa
// -------------------------------------------------------

export interface TaxaJsonGroup extends JsonGroupBase<"taxa", Taxon> {}

// Traits
// -------------------------------------------------------

export interface TraitsJsonGroup extends JsonGroupBase<"traits", Traits> {
	/** The `meta` property can be used to specify that the traits in this dataset relate to a more general concept, for example a Red List for a specific region and subset of taxa with an issue year */
	meta?: TraitsMeta;
	properties: IdentifierIndexedObject<Property>;
	/** Source for group and property descriptions if deviant from the plugin's `originalSource` */
	descriptionSource?: Citations;
	statisticsFilters?: Filter[];
}

export interface TraitsMeta {
	/** The general concept of this dataset's traits. */
	concept?: string;
	/** Properties are described for a specific region. */
	region?: Describable;
	/**
	 * A taxon ID (of this plugin's taxon reference) that is the closest common parent among all taxa in this dataset.
	 * For example, a Red List of liverworts would correspond to child taxa of "Marchantiophyta" with its taxon ID as subset.
	 */
	subset?: string;
	/** The year this dataset was published. */
	year?: number;
}

export interface Filter extends Describable {
	id: string;
	filterKey: string;
	filterValue: Primitive;
	match: boolean;
	default: boolean;
}

// API groups
// -------------------------------------------------------

export type ApiGroup = OccurrencesApiGroup;

export type ApiOptions = {
	/** The client ID passed as agent in the header */
	clientID: string;
	/** Additional parameters */
	params?: Record<string, Primitive>;
} & {
	/** Group-specific options */
	[key: string]: Primitive;
};

interface Json {
	[key: string | number]:
		| string
		| number
		| boolean
		| Json
		| string[]
		| number[]
		| boolean[]
		| Json[];
}

// NOTE: Inoptimal any.
// REASON: using Json[] as default leads to type errors
// when implementig stricter types with specific keys
// rather than a `string | number` index signature.
export interface OccurrencesApiGroup<RawType extends Json[] = any>
	extends GroupBase<"occurrences"> {
	getRaw: (query: OccurrenceQuery, options?: ApiOptions) => Promise<RawType>;
	convert: (raw: RawType) => Occurrence[];
}
