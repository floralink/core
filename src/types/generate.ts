import type { GroupType } from "./groups.js";

export interface GeneratorConfig<T extends GroupType> {
	/** A file path of a CSV file relative to the `source` folder in the plugin's root */
	input?: string;
	/** Delimiter used in the input CSV file */
	delimiter?: string;
	/** Values to be ignored or, strictly speaking, considered as empty */
	empty?: string[];
	/**
	 * A custom function accepting a raw CSV row input
	 * and returning Floralink-typed data (`Taxon` or `Traits`).
	 * If it returns false, the entry will be ignored/discarded.
	 */
	map: MapFunction<T>;
}

export type MapFunction<ResultType> = (
	o: Record<string, string>,
) => Partial<ResultType> | false;

export interface FlatStringObject {
	[key: string]: string;
}
