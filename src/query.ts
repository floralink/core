import type { IdentifierIndexedObject, Taxon } from "./types/data.js";
import type { ApiGroup, ApiOptions } from "./types/groups.js";
import type { OccurrenceQuery } from "./types/query.js";

// JSON (traits)
// -------------------------------------------------------

export function getTraitsByTaxonIDs<T>(
	data: IdentifierIndexedObject<T>,
	ids: string[],
): IdentifierIndexedObject<T> {
	const result: IdentifierIndexedObject<T> = {};
	ids.forEach((id: string) => {
		const identifiedValue = data[id];
		if (identifiedValue) result[id] = identifiedValue;
	});
	return result;
}

// JSON (taxon)
// -------------------------------------------------------

// NOTE: This ignores that IDs of the accepted taxon concept could potentially refer to other databases
/** Resolve potential synonyms of a `taxonID` defined in `data` and return `Taxon` object. Returns the resolved taxon's data. */
export function resolveTaxon(
	data: IdentifierIndexedObject<Taxon>,
	taxonID: string,
	path: string[] = [],
) {
	const newPath = [...path, taxonID];

	// Throw an error when synonym references form a circle
	if (path.includes(taxonID))
		throw Error(
			`Circular reference found when trying to resolve synonyms. Resolved pathway: ${newPath.join(" -> ")}`,
		);
	// Throw an error if there is no data for this taxonID
	else if (!data[taxonID]) {
		let message = `No data found for the taxon with the ID "${taxonID}"`;
		if (path.length)
			message += ` This occurred while trying to resolve synonyms along this pathway: ${newPath.join(" -> ")}`;
		throw Error(message);
	}
	// Return taxon data when there is no synonym defined
	else if (!data[taxonID].synonymOf) return data[taxonID];
	// Recursively check if there are furher synonyms
	else return resolveTaxon(data, data[taxonID].synonymOf.id, newPath);
}

export function getOuterTaxonHierarchy(
	data: IdentifierIndexedObject<Taxon>,
	taxonID: string,
) {
	const hierarchy = [resolveTaxon(data, taxonID)];
	let reachedEnd = false;

	while (!reachedEnd) {
		const parentTaxonReference = hierarchy[0].childTaxonOf;
		if (parentTaxonReference && parentTaxonReference.id !== "0") {
			hierarchy.unshift(resolveTaxon(data, parentTaxonReference.id));
		} else reachedEnd = true;
	}

	return hierarchy;
}

// API (occurrence)
// -------------------------------------------------------

export async function queryAPI(
	group: ApiGroup,
	query: OccurrenceQuery,
	options?: ApiOptions,
) {
	const rawData = await group.getRaw(query, options);
	return group.convert(rawData);
}
